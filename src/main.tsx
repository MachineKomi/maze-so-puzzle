import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { PresentationProvider } from "./ui/PresentationProvider";
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("The game could not find its page root.");
}

const ProofRack = import.meta.env.DEV && new URLSearchParams(location.search).has("ui-proof")
  ? lazy(() => import("./ui/testing/UiProofRack")) : null;

createRoot(root).render(
  <StrictMode>
    <PresentationProvider>{ProofRack ? <Suspense fallback={<p>Loading interface proof…</p>}><ProofRack /></Suspense> : <App />}</PresentationProvider>
  </StrictMode>,
);
