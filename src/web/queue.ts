import { useEffect, useRef, useState } from "react";
import { useLatest, useMemoizedFn } from "../state/index.js";
import { abortError } from "../internal/utils.js";

export interface QueueTask<T> {
  id: string;
  label: string;
  status: "queued" | "running" | "success" | "error" | "cancelled";
  result?: T;
  error?: unknown;
}
interface Job<T> {
  state: QueueTask<T>;
  run: (signal: AbortSignal) => Promise<T>;
  controller: AbortController;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
}
export function useAsyncQueue<T = unknown>({
  concurrency = 3,
}: { concurrency?: number } = {}) {
  const [tasks, setTasks] = useState<QueueTask<T>[]>([]);
  const [paused, setPaused] = useState(false);
  const jobs = useRef(new Map<string, Job<T>>());
  const active = useRef(0);
  const sequence = useRef(0);
  const stopped = useRef(false);
  const mounted = useRef(true);
  const limit = useLatest(
    Number.isFinite(concurrency) ? Math.max(1, Math.floor(concurrency)) : 3,
  );
  const publish = useMemoizedFn(() => {
    if (mounted.current)
      setTasks(Array.from(jobs.current.values(), (job) => ({ ...job.state })));
  });
  const pump = useMemoizedFn(() => {
    if (!mounted.current || stopped.current) return;
    for (const job of jobs.current.values()) {
      if (active.current >= limit.current) break;
      if (job.state.status !== "queued") continue;
      active.current++;
      job.state.status = "running";
      void Promise.resolve()
        .then(() => {
          if (job.controller.signal.aborted) throw abortError();
          return job.run(job.controller.signal);
        })
        .then(
          (result) => {
            if (job.state.status === "cancelled") return;
            job.state = { ...job.state, status: "success", result };
            job.resolve(result);
          },
          (error) => {
            if (job.state.status === "cancelled") return;
            job.state = { ...job.state, status: "error", error };
            job.reject(error);
          },
        )
        .finally(() => {
          active.current--;
          publish();
          pump();
        });
    }
    publish();
  });
  const cancel = useMemoizedFn((id: string) => {
    const job = jobs.current.get(id);
    if (!job || !["queued", "running"].includes(job.state.status)) return;
    job.state = { ...job.state, status: "cancelled" };
    job.controller.abort();
    job.reject(abortError());
    publish();
  });
  const cancelAll = useMemoizedFn(() => {
    for (const id of jobs.current.keys()) cancel(id);
  });
  const add = useMemoizedFn(
    (run: (signal: AbortSignal) => Promise<T>, label: string = "") => {
      const id = `task-${++sequence.current}`;
      let resolve!: (value: T) => void;
      let reject!: (reason: unknown) => void;
      const promise = new Promise<T>((yes, no) => {
        resolve = yes;
        reject = no;
      });
      // State-based callers need not attach a catch; promise-based callers still observe rejection.
      void promise.catch(() => {});
      if (!mounted.current) {
        reject(abortError());
        return { id, promise };
      }
      jobs.current.set(id, {
        state: { id, label, status: "queued" },
        run,
        controller: new AbortController(),
        resolve,
        reject,
      });
      publish();
      pump();
      return { id, promise };
    },
  );
  const pause = useMemoizedFn(() => {
    stopped.current = true;
    setPaused(true);
  });
  const resume = useMemoizedFn(() => {
    stopped.current = false;
    setPaused(false);
    pump();
  });
  const clear = useMemoizedFn(() => {
    for (const [id, job] of jobs.current)
      if (!["queued", "running"].includes(job.state.status))
        jobs.current.delete(id);
    publish();
  });
  useEffect(() => {
    mounted.current = true;
    pump();
    return () => {
      mounted.current = false;
      cancelAll();
    };
  }, [cancelAll, pump]);
  useEffect(() => {
    pump();
  }, [concurrency, pump]);
  return {
    tasks,
    paused,
    add,
    cancel,
    cancelAll,
    pause,
    resume,
    clear,
    running: tasks.filter((t) => t.status === "running").length,
    pending: tasks.filter((t) => t.status === "queued").length,
  };
}

export interface UploadContext {
  file: File;
  signal: AbortSignal;
  onProgress: (loaded: number, total: number) => void;
}
export function createXHRUploadTransport(options: {
  url: string;
  fieldName?: string;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  method?: string;
}) {
  return ({ file, signal, onProgress }: UploadContext): Promise<string> =>
    new Promise((resolve, reject) => {
      if (signal.aborted) {
        reject(abortError());
        return;
      }
      const xhr = new XMLHttpRequest();
      const cleanup = () => {
        signal.removeEventListener("abort", abort);
        xhr.onload = null;
        xhr.onerror = null;
        xhr.onabort = null;
        xhr.upload.onprogress = null;
      };
      const abort = () => {
        xhr.abort();
        cleanup();
        reject(abortError());
      };
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) onProgress(event.loaded, event.total);
      };
      xhr.onload = () => {
        cleanup();
        if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.responseText);
        else reject(new Error(`Upload failed: HTTP ${xhr.status}`));
      };
      xhr.onerror = () => {
        cleanup();
        reject(new Error("Upload network error."));
      };
      xhr.onabort = () => {
        cleanup();
        reject(abortError());
      };
      try {
        xhr.open(options.method ?? "POST", options.url);
        xhr.withCredentials = options.withCredentials ?? false;
        for (const [name, value] of Object.entries(options.headers ?? {}))
          xhr.setRequestHeader(name, value);
        signal.addEventListener("abort", abort, { once: true });
        const body = new FormData();
        body.append(options.fieldName ?? "file", file);
        xhr.send(body);
      } catch (error) {
        cleanup();
        reject(error);
      }
    });
}

export function useUpload<T>(options: {
  transport: (context: UploadContext) => Promise<T>;
  concurrency?: number;
}) {
  const queue = useAsyncQueue<T>({ concurrency: options.concurrency });
  const files = useRef(new Map<string, File>());
  const [progress, setProgress] = useState<Record<string, number>>({});
  const transport = useMemoizedFn(options.transport);
  const add = useMemoizedFn((input: Iterable<File>) =>
    Array.from(input, (file) => {
      const task = queue.add(
        (signal) =>
          transport({
            file,
            signal,
            onProgress: (loaded, total) => {
              if (!signal.aborted && total > 0)
                setProgress((p) => ({
                  ...p,
                  [task.id]: Math.max(0, Math.min(100, (loaded / total) * 100)),
                }));
            },
          }),
        file.name,
      );
      files.current.set(task.id, file);
      return task;
    }),
  );
  const retry = useMemoizedFn((id: string) => {
    const task = queue.tasks.find((item) => item.id === id);
    const file = files.current.get(id);
    if (!file || !task || !["error", "cancelled"].includes(task.status))
      return undefined;
    return add([file])[0];
  });
  const clear = useMemoizedFn(() => {
    const retained = new Set(
      queue.tasks
        .filter((t) => ["queued", "running"].includes(t.status))
        .map((t) => t.id),
    );
    for (const id of files.current.keys())
      if (!retained.has(id)) files.current.delete(id);
    setProgress((p) =>
      Object.fromEntries(Object.entries(p).filter(([id]) => retained.has(id))),
    );
    queue.clear();
  });
  const uploads = queue.tasks.map((task) => ({
    ...task,
    file: files.current.get(task.id)!,
    progress: task.status === "success" ? 100 : (progress[task.id] ?? 0),
  }));
  return {
    uploads,
    add,
    retry,
    clear,
    cancel: queue.cancel,
    cancelAll: queue.cancelAll,
    pause: queue.pause,
    resume: queue.resume,
    paused: queue.paused,
    running: queue.running,
  };
}
