import { Docs } from "./components/Docs";
import { Playground } from "./components/Playground";

export function App() {
  return (
    <main>
      <header className="hero">
        <p className="eyebrow">react-dialog-flow</p>
        <h1>Dialogs are flows, not just booleans.</h1>
        <p className="intro">
          A small React dialog stack for component-driven screens, nested
          modals, and result-bearing async work.
        </p>
        <nav aria-label="Documentation" className="docs-nav">
          <a href="#install">Install</a>
          <a href="#provider">Provider</a>
          <a href="#stack">Stack</a>
          <a href="#async">Async results</a>
          <a href="#ui">UI &amp; a11y</a>
          <a href="#playground">Playground</a>
        </nav>
      </header>
      <Docs />
      <Playground />
    </main>
  );
}
