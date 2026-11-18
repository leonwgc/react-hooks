var e=`import { Fragment, useId, useState, type ReactNode } from "react";

export function Scenario({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [version, setVersion] = useState(0);
  const id = useId();
  return (
    <section className="demo-scenario" aria-label={title}>
      <div className="demo-scenario-heading">
        <h3>{title}</h3>
        <button
          type="button"
          className="secondary"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "收起演示" : "展开演示"}
        </button>
      </div>
      <p>{description}</p>
      <div id={id} hidden={!open}>
        {open && (
          <>
            <div className="demo-stack">
              <Fragment key={version}>{children}</Fragment>
            </div>
            <button
              type="button"
              className="secondary scenario-reset"
              onClick={() => setVersion((value) => value + 1)}
            >
              重新开始此演示
            </button>
          </>
        )}
      </div>
    </section>
  );
}
`;export{e as default};