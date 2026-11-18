import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { catalog, type HookName } from "./catalog";
import { GuideCode, SyntaxCode } from "./SyntaxCode";
import { CodeBlock } from "./CodeBlock";
import { DemoSource } from "./DemoSource";
import SiteSearch from "./SiteSearch";
import { useCases } from "./useCases";
import Guide from "./content/guide.mdx";
import { useLocalStorageState } from "../src";
import "./styles.scss";

const ApiReference = lazy(() => import("./ApiReference"));

const modules = import.meta.glob<{ default: ComponentType }>("./demos/*.tsx");
const sources = import.meta.glob<string>("./demos/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
});
const demos = Object.fromEntries(
  Object.entries(modules).map(([path, load]) => [
    path.split("/").pop()!.replace(".tsx", ""),
    lazy(load),
  ]),
);
const exampleModules = import.meta.glob<{ default: ComponentType }>(
  "./examples/use*.tsx",
);
const examples = Object.fromEntries(
  Object.entries(exampleModules).map(([path, load]) => [
    path.split("/").pop()!.replace(".tsx", ""),
    lazy(load),
  ]),
);
const categories = [...new Set(catalog.map((hook) => hook.category))];
const groupIcons = ["◈", "⌁", "▧", "⌘", "▤", "◇", "↗", "≡"];
const install = "npm install git+https://github.com/leonwgc/react-hooks.git";
function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
function Logo() {
  return (
    <a className="brand" href="#/" aria-label="Web Hooks 首页">
      <span className="brand-mark">
        w<span>h</span>
      </span>
      <span>
        web<span className="brand-light">hooks</span>
      </span>
    </a>
  );
}
class DemoBoundary extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <p role="alert">示例暂时无法运行，请刷新重试或查看源码。</p>
    ) : (
      this.props.children
    );
  }
}
function LiveDemo({ name }: { name: HookName }) {
  const Demo = demos[name];
  const Examples = examples[name];
  return (
    <DemoBoundary key={name}>
      <Suspense fallback={<p className="muted">正在加载示例…</p>}>
        <div className="basic-demo">
          <div className="basic-demo-content">
            <h3>基础用法</h3>
            <Demo />
          </div>
          <DemoSource source={sources[`./demos/${name}.tsx`]} basic />
        </div>
        <Suspense fallback={<p className="muted">正在加载补充场景…</p>}>
          <Examples />
        </Suspense>
      </Suspense>
    </DemoBoundary>
  );
}
function Home() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <a className="eyebrow pill" href="#/guide">
            <span className="live-dot" /> v0.5.0 · 为 React 18 / 19 而生{" "}
            <span>→</span>
          </a>
          <h1>
            少写重复逻辑，
            <br />
            <em>多做有用的事。</em>
          </h1>
          <p className="hero-description">
            从一个开关，到完整的交互。
            <br />
            67 个轻量、类型安全的 React Hooks，
            <br className="desktop-break" />
            为每一种 Web 体验提供可靠的起点。
          </p>
          <div className="hero-actions">
            <a className="button" href="#/hooks/useBoolean">
              探索 Hooks <span>→</span>
            </a>
            <a className="button secondary" href="#/guide">
              快速开始 <span>↗</span>
            </a>
          </div>
          <div className="hero-meta">
            <span>
              <span className="checkmark">✓</span> TypeScript 原生
            </span>
            <span>
              <span className="checkmark">✓</span> UI 无关
            </span>
            <span>
              <span className="checkmark">✓</span> MIT 开源
            </span>
          </div>
        </div>
        <div className="hero-code">
          <div className="code-toolbar">
            <span>
              <i />
              <i />
              <i />
            </span>
            <span>Notification.tsx</span>
            <span className="tag">React</span>
          </div>
          <div className="hero-code-body">
            {'import { useBoolean }\n  from \'@leonwgc/react-hooks\';\n\nfunction Notification() {\n  const notice = useBoolean(false);\n\n  return (\n    <button onClick={notice.toggle}>\n      {notice.value ? "开启" : "关闭"}\n    </button>\n  );\n}'
              .split("\n")
              .map((line, index) => (
                <div className="line" key={index}>
                  <b aria-hidden="true">{String(index + 1).padStart(2, "0")}</b>
                  <SyntaxCode code={line} />
                </div>
              ))}
          </div>
          <div className="hero-preview">
            <span className="preview-label">
              LIVE PREVIEW <span>试试看 →</span>
            </span>
            <LiveDemo name="useBoolean" />
          </div>
          <div className="floating-note">
            <span>↳</span> 更少样板代码，更清晰的意图。
          </div>
        </div>
      </section>
      <div className="stats-strip">
        <div className="container stats-grid">
          <div>
            <strong>67</strong>
            <span>精心组织的 Hooks</span>
          </div>
          <div>
            <strong>0</strong>
            <span>第三方运行时依赖</span>
          </div>
          <div>
            <strong>
              100<span>%</span>
            </strong>
            <span>TypeScript 编写</span>
          </div>
          <div>
            <strong>
              18 <span>/</span> 19
            </strong>
            <span>React 兼容版本</span>
          </div>
        </div>
      </div>
      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A TOOLKIT FOR THE EVERYDAY</p>
            <h2>常用能力，触手可及。</h2>
            <p>按场景找到需要的工具。独立使用，自由组合。</p>
          </div>
          <a className="text-link" href="#/hooks/useBoolean">
            查看全部 Hooks <span>→</span>
          </a>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => {
            const hooks = catalog.filter((h) => h.category === category);
            return (
              <a
                className="category-card"
                key={category}
                href={`#/hooks/${hooks[0].name}`}
              >
                <div className="category-top">
                  <span className="category-icon">{groupIcons[index]}</span>
                  <span className="muted">
                    {String(hooks.length).padStart(2, "0")} HOOKS
                  </span>
                </div>
                <h3>
                  {category}
                  <Arrow />
                </h3>
                <p>
                  {hooks
                    .slice(0, 3)
                    .map((h) => h.name)
                    .join(" · ")}
                </p>
              </a>
            );
          })}
        </div>
      </section>
      <section className="showcase-section">
        <div className="container section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">LESS GLUE. MORE FLOW.</p>
              <h2>从小交互，到完整体验。</h2>
              <p>不用想象效果。修改、点击，现在就试一试。</p>
            </div>
          </div>
          <div className="showcase-grid">
            <div className="showcase">
              <div className="showcase-title">
                <span className="tag">ANIMATION</span>
                <a href="#/hooks/useAnimate">
                  useAnimate <Arrow />
                </a>
              </div>
              <h3>让界面自然地动起来</h3>
              <LiveDemo name="useAnimate" />
            </div>
            <div className="showcase">
              <div className="showcase-title">
                <span className="tag">FORMS</span>
                <a href="#/hooks/useFieldArray">
                  useFieldArray <Arrow />
                </a>
              </div>
              <h3>让动态字段井然有序</h3>
              <LiveDemo name="useFieldArray" />
            </div>
          </div>
          <a className="scenario-link" href="#/hooks/useTable">
            <span>想看看它们如何协作？</span>{" "}
            打开搜索、分页、跨页选择与编辑组合示例 <span>→</span>
          </a>
        </div>
      </section>
      <section className="container cta">
        <div>
          <p className="eyebrow">BUILT TO FIT YOUR STACK</p>
          <h2>你的 UI，你的方式。</h2>
          <p>原生 HTML 或你的设计系统，选择权始终在你。</p>
        </div>
        <a className="button" href="#/guide">
          开始构建 <span>→</span>
        </a>
      </section>
    </>
  );
}
function HookPage({ name }: { name: string }) {
  const hook = catalog.find((item) => item.name === name);
  if (!hook)
    return (
      <article className="doc-article">
        <h1>没有找到这个 Hook</h1>
        <a href="#/hooks/useBoolean">返回 Hooks 文档</a>
      </article>
    );
  const index = catalog.indexOf(hook);
  const usage = useCases[hook.name];
  return (
    <>
      <article className="doc-article">
        <div className="breadcrumb">
          Hooks <span>/</span> {hook.category}
        </div>
        <div className="doc-title-row">
          <h1>{hook.name}</h1>
          <span className="tag">React 18 / 19</span>
        </div>
        <p className="doc-description">{hook.description}</p>
        <div className="doc-badges">
          <span>TypeScript</span>
          <span>UI 无关</span>
          <span>交互示例</span>
        </div>
        <section id="usage" className="hook-usage">
          <h2>使用场景</h2>
          <p>{usage.overview}</p>
          <ul>
            {usage.scenarios.map((scenario) => (
              <li key={scenario.title}>
                <strong>{scenario.title}：</strong>
                {scenario.description}
              </li>
            ))}
          </ul>
        </section>
        <section id="demo">
          <h2>
            交互演示 <span className="heading-hash">#</span>
          </h2>
          <div className="demo-content demo-list">
            <LiveDemo name={hook.name} />
          </div>
        </section>
        <section id="api">
          <h2>API</h2>
          <Suspense fallback={<p className="muted">正在加载 API 文档…</p>}>
            <ApiReference name={hook.name} CodeBlock={CodeBlock} />
          </Suspense>
        </section>
        <section id="behavior">
          <h2>行为与边界</h2>
          <div className="behavior-note">
            <span>i</span>
            <p>{hook.note}</p>
          </div>
        </section>
        <nav className="doc-pagination" aria-label="相邻文档">
          {index > 0 ? (
            <a href={`#/hooks/${catalog[index - 1].name}`}>
              <small>← 上一个</small>
              {catalog[index - 1].name}
            </a>
          ) : (
            <span />
          )}
          {index < catalog.length - 1 && (
            <a href={`#/hooks/${catalog[index + 1].name}`}>
              <small>下一个 →</small>
              {catalog[index + 1].name}
            </a>
          )}
        </nav>
      </article>
      <aside className="toc">
        <p>本页内容</p>
        {[
          ["usage", "使用场景"],
          ["demo", "交互演示"],
          ["api", "API"],
          ["behavior", "行为与边界"],
        ].map(([id, title]) => (
          <button
            key={id}
            onClick={() =>
              document
                .getElementById(id)
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            {title}
          </button>
        ))}
        <div className="toc-note">
          自主实现
          <br />
          零运行时依赖
          <br />
          <a
            href="https://github.com/leonwgc/react-hooks"
            target="_blank"
            rel="noreferrer"
          >
            查看 GitHub ↗
          </a>
        </div>
      </aside>
    </>
  );
}
function App() {
  const [route, setRoute] = useState(() => location.hash.slice(1) || "/");
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useLocalStorageState<"light" | "dark">(
    "web-hooks:site-theme",
    "light",
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme.value;
  }, [theme.value]);
  useEffect(() => {
    const navigate = () => {
      setRoute(location.hash.slice(1) || "/");
      setMenuOpen(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", navigate);
    return () => window.removeEventListener("hashchange", navigate);
  }, []);
  useEffect(() => {
    const name = route.startsWith("/hooks/")
      ? route.split("/")[2]
      : route === "/guide"
        ? "快速开始"
        : "为每一种 Web 体验";
    document.title = `${name} · Web Hooks`;
  }, [route]);
  const isHome = route === "/";
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        跳到主要内容
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Logo />
          <span className="version">v0.5.0</span>
          <nav className="top-nav" aria-label="主导航">
            <a className={isHome ? "active" : ""} href="#/">
              概览
            </a>
            <a
              className={route.startsWith("/hooks") ? "active" : ""}
              href="#/hooks/useBoolean"
            >
              Hooks
            </a>
            <a className={route === "/guide" ? "active" : ""} href="#/guide">
              使用指南
            </a>
          </nav>
          <div className="header-actions">
            <SiteSearch />
            <a
              className="github-link"
              href="https://github.com/leonwgc/react-hooks"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <Arrow />
            </a>
            <span className="header-divider" />
            <button
              className="theme-button"
              aria-label={
                theme.value === "light" ? "切换深色主题" : "切换浅色主题"
              }
              onClick={() =>
                theme.setValue((value) =>
                  value === "light" ? "dark" : "light",
                )
              }
            >
              {theme.value === "light" ? "☾" : "☀"}
            </button>
            {!isHome && (
              <button
                className="mobile-menu secondary"
                aria-expanded={menuOpen}
                aria-controls="docs-sidebar"
                onClick={() => setMenuOpen((v) => !v)}
              >
                目录
              </button>
            )}
          </div>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        {isHome ? (
          <Home />
        ) : (
          <div className="docs-layout">
            <aside
              id="docs-sidebar"
              className={`sidebar ${menuOpen ? "open" : ""}`}
              aria-label="文档导航"
            >
              <a
                className={`guide-link ${route === "/guide" ? "active" : ""}`}
                href="#/guide"
              >
                入门指南 <span>↗</span>
              </a>
              {categories.map((category) => {
                const list = catalog.filter(
                  (hook) => hook.category === category,
                );
                return (
                  list.length > 0 && (
                    <div className="nav-group" key={category}>
                      <h2>
                        {category}
                        <span>{list.length}</span>
                      </h2>
                      {list.map((hook) => (
                        <a
                          key={hook.name}
                          href={`#/hooks/${hook.name}`}
                          aria-current={
                            route === `/hooks/${hook.name}` ? "page" : undefined
                          }
                        >
                          {hook.name}
                          {route === `/hooks/${hook.name}` && <span>●</span>}
                        </a>
                      ))}
                    </div>
                  )
                );
              })}
              <div className="sidebar-footer">
                67 HOOKS · ENDLESS POSSIBILITIES
              </div>
            </aside>
            <div className="doc-layout-content">
              {route === "/guide" ? (
                <article className="doc-article guide-content">
                  <div className="breadcrumb">文档 / 使用指南</div>
                  <Guide components={{ code: GuideCode }} />
                  <CodeBlock code={install} language="bash" />
                </article>
              ) : (
                <HookPage key={route} name={route.split("/")[2] ?? ""} />
              )}
            </div>
          </div>
        )}
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <Logo />
          <p>由 AI（OpenAI Codex）在开发者指导下设计与开发。</p>
          <span>
            MIT License ·{" "}
            <a
              href="https://github.com/alibaba/hooks"
              target="_blank"
              rel="noreferrer"
            >
              ahooks
            </a>{" "}
            /{" "}
            <a
              href="https://github.com/streamich/react-use"
              target="_blank"
              rel="noreferrer"
            >
              react-use
            </a>{" "}
            inspired
          </span>
        </div>
      </footer>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
