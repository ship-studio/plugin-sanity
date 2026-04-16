import { jsxs, Fragment, jsx } from "data:text/javascript,export const jsx=window.__SHIPSTUDIO_REACT__.createElement;export const jsxs=window.__SHIPSTUDIO_REACT__.createElement;export const Fragment=window.__SHIPSTUDIO_REACT__.Fragment;";
import { useState, useEffect, useRef, useCallback } from "data:text/javascript,export default window.__SHIPSTUDIO_REACT__;export const useState=window.__SHIPSTUDIO_REACT__.useState;export const useEffect=window.__SHIPSTUDIO_REACT__.useEffect;export const useCallback=window.__SHIPSTUDIO_REACT__.useCallback;export const useMemo=window.__SHIPSTUDIO_REACT__.useMemo;export const useRef=window.__SHIPSTUDIO_REACT__.useRef;export const useContext=window.__SHIPSTUDIO_REACT__.useContext;export const createElement=window.__SHIPSTUDIO_REACT__.createElement;export const Fragment=window.__SHIPSTUDIO_REACT__.Fragment;";
const _w = window;
function usePluginContext() {
  const React = _w.__SHIPSTUDIO_REACT__;
  const CtxRef = _w.__SHIPSTUDIO_PLUGIN_CONTEXT_REF__;
  if (CtxRef && (React == null ? void 0 : React.useContext)) {
    const ctx = React.useContext(CtxRef);
    if (ctx) return ctx;
  }
  const directCtx = _w.__SHIPSTUDIO_PLUGIN_CONTEXT__;
  if (directCtx) return directCtx;
  throw new Error("Plugin context not available.");
}
const SANITY_CHECK_INTERVAL_MS = 5e3;
const TITLE_BAR_HEIGHT = 31;
const MAX_RECT_RETRIES = 20;
const RECT_RETRY_DELAY_MS = 50;
const STYLE_ID = "sanity-cms-styles";
const pluginCSS = `
/* Sanity Button */
.sanity-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.sanity-button:hover {
  background: var(--border);
  color: var(--text-primary);
  border-color: var(--text-muted);
}

.sanity-button svg {
  width: 14px;
  height: 14px;
}

.sanity-button-wrapper {
  position: relative;
}

.sanity-button-warning {
  border-color: var(--warning-color, #f59e0b);
  color: var(--warning-color, #f59e0b);
}

.sanity-button-warning:hover {
  background: rgba(245, 158, 11, 0.1);
  border-color: var(--warning-color, #f59e0b);
  color: var(--warning-color, #f59e0b);
}

.sanity-warning-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: var(--warning-color, #f59e0b);
  color: white;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  margin-left: 4px;
}

.sanity-env-warning {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 300px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.sanity-env-warning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 13px;
  color: var(--text-primary);
}

.sanity-env-warning-header button {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.sanity-env-warning-header button:hover {
  color: var(--text-primary);
}

.sanity-env-warning p {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.sanity-env-warning ul {
  margin: 0 0 8px 0;
  padding-left: 16px;
}

.sanity-env-warning li {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.sanity-env-warning code {
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  color: var(--warning-color, #f59e0b);
  word-break: break-all;
  display: inline-block;
}

.sanity-env-warning-hint {
  color: var(--text-muted) !important;
  font-style: italic;
}

/* Sanity Modal */
.sanity-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-primary);
  z-index: 9999;
  display: flex;
  flex-direction: column;
}

.sanity-modal {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sanity-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.sanity-modal-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
}

.sanity-modal-close {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--text-muted);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sanity-modal-close:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.sanity-modal-content {
  flex: 1;
  position: relative;
  background: var(--bg-tertiary);
}

.sanity-modal-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--text-muted);
}
`;
function useInjectStyles() {
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = pluginCSS;
    document.head.appendChild(style);
    return () => {
      var _a;
      (_a = document.getElementById(STYLE_ID)) == null ? void 0 : _a.remove();
    };
  }, []);
}
function useSanityDetection() {
  const ctx = usePluginContext();
  const project = ctx.project;
  const [hasSanity, setHasSanity] = useState(false);
  const shellRef = useRef(ctx.shell);
  shellRef.current = ctx.shell;
  useEffect(() => {
    if (!(project == null ? void 0 : project.path)) {
      setHasSanity(false);
      return;
    }
    const check = async () => {
      try {
        const configResult = await shellRef.current.exec("ls", ["sanity.config.ts", "sanity.config.js"]);
        if (configResult.exit_code === 0 && configResult.stdout.trim()) {
          setHasSanity(true);
          return;
        }
      } catch {
      }
      try {
        const pkgResult = await shellRef.current.exec("cat", ["package.json"]);
        if (pkgResult.exit_code === 0) {
          const content = pkgResult.stdout;
          if (content.includes('"sanity"') || content.includes('"next-sanity"')) {
            setHasSanity(true);
            return;
          }
        }
      } catch {
      }
      setHasSanity(false);
    };
    void check();
    const interval = setInterval(() => void check(), SANITY_CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [project == null ? void 0 : project.path]);
  return hasSanity;
}
function useSanityEnvCheck(hasSanity) {
  const ctx = usePluginContext();
  const project = ctx.project;
  const [missingKeys, setMissingKeys] = useState([]);
  const shellRef = useRef(ctx.shell);
  shellRef.current = ctx.shell;
  useEffect(() => {
    if (!hasSanity || !(project == null ? void 0 : project.path)) {
      setMissingKeys([]);
      return;
    }
    const requiredKeys = [
      "NEXT_PUBLIC_SANITY_PROJECT_ID",
      "NEXT_PUBLIC_SANITY_DATASET"
    ];
    const check = async () => {
      var _a;
      const foundKeys = /* @__PURE__ */ new Set();
      for (const envFile of [".env.local", ".env"]) {
        try {
          const result = await shellRef.current.exec("cat", [envFile]);
          if (result.exit_code === 0) {
            for (const line of result.stdout.split("\n")) {
              const trimmed = line.trim();
              if (!trimmed || trimmed.startsWith("#")) continue;
              const key = (_a = trimmed.split("=")[0]) == null ? void 0 : _a.trim();
              if (key) foundKeys.add(key);
            }
          }
        } catch {
        }
      }
      const missing = requiredKeys.filter((k) => !foundKeys.has(k));
      setMissingKeys(missing);
    };
    void check();
    const interval = setInterval(() => void check(), SANITY_CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [hasSanity, project == null ? void 0 : project.path]);
  return missingKeys;
}
function SanityIcon() {
  return /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "30 46 195 163", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M215.759 152.483L208.799 140.366L175.13 160.88L212.526 113.252L218.179 109.933L216.78 107.831L219.349 104.548L207.549 94.7227L202.147 101.608L93.1263 165.414L133.434 116.925L208.512 75.7566L201.379 61.963L160.486 84.3775L180.623 60.168L169.087 50L123.767 104.513L78.7575 129.206L113.217 83.6335L134.811 72.3909L127.953 58.4438L65.0424 91.2034L82.1978 68.4937L70.2143 58.8926L34 106.839L34.5619 107.288L41.3277 121.07L81.4753 100.155L44.8826 148.539L50.8801 153.345L54.4465 160.242L96.7156 137.06L50.1691 193.061L61.7054 203.229L64.0218 200.442L176.311 134.509L139.031 182.007L139.638 182.515L139.581 182.55L147.31 196.001L196.895 165.781L177.802 196.603L190.6 205L221 155.931L215.759 152.483Z" }) });
}
function SanityModal({ onClose, devServerUrl }) {
  const ctx = usePluginContext();
  const [webviewReady, setWebviewReady] = useState(false);
  const contentRef = useRef(null);
  const invokeRef = useRef(ctx.invoke);
  invokeRef.current = ctx.invoke;
  useEffect(() => {
    if (!contentRef.current) return;
    let cancelled = false;
    const createWebview = async () => {
      var _a;
      let rect = null;
      for (let attempt = 0; attempt < MAX_RECT_RETRIES; attempt++) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        rect = ((_a = contentRef.current) == null ? void 0 : _a.getBoundingClientRect()) ?? null;
        if (rect && rect.width > 0 && rect.height > 0) break;
        await new Promise((resolve) => setTimeout(resolve, RECT_RETRY_DELAY_MS));
      }
      if (cancelled || !rect || rect.width === 0 || rect.height === 0) {
        console.error("[sanity-cms] Modal never achieved valid dimensions");
        return;
      }
      try {
        await invokeRef.current.call("create_preview_webview", {
          url: `${devServerUrl}/studio`,
          x: rect.left,
          y: rect.top + TITLE_BAR_HEIGHT,
          width: rect.width,
          height: rect.height + 2
        });
        if (!cancelled) setWebviewReady(true);
      } catch (error) {
        console.error("[sanity-cms] Failed to create webview:", error);
      }
    };
    void createWebview();
    const handleResize = async () => {
      if (!contentRef.current) return;
      const rect = contentRef.current.getBoundingClientRect();
      try {
        await invokeRef.current.call("resize_preview_webview", {
          x: rect.left,
          y: rect.top + TITLE_BAR_HEIGHT,
          width: rect.width,
          height: rect.height + 2
        });
      } catch (error) {
        console.error("[sanity-cms] Failed to resize webview:", error);
      }
    };
    const wrappedResize = () => void handleResize();
    window.addEventListener("resize", wrappedResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", wrappedResize);
      invokeRef.current.call("destroy_preview_webview").catch((err) => {
        console.error("[sanity-cms] Failed to destroy webview on cleanup:", err);
      });
    };
  }, [devServerUrl]);
  const handleClose = useCallback(async () => {
    try {
      await invokeRef.current.call("destroy_preview_webview");
    } catch (error) {
      console.error("[sanity-cms] Failed to destroy webview:", error);
    }
    onClose();
  }, [onClose]);
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") void handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);
  return /* @__PURE__ */ jsx("div", { className: "sanity-modal-overlay", onClick: () => void handleClose(), children: /* @__PURE__ */ jsxs("div", { className: "sanity-modal", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxs("div", { className: "sanity-modal-header", children: [
      /* @__PURE__ */ jsx("span", { className: "sanity-modal-title", children: "Sanity Studio" }),
      /* @__PURE__ */ jsx("button", { className: "sanity-modal-close", onClick: () => void handleClose(), children: /* @__PURE__ */ jsxs(
        "svg",
        {
          width: "20",
          height: "20",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          children: [
            /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
            /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "sanity-modal-content", ref: contentRef, children: !webviewReady && /* @__PURE__ */ jsxs("div", { className: "sanity-modal-loading", children: [
      /* @__PURE__ */ jsx("div", { className: "spinner" }),
      /* @__PURE__ */ jsx("p", { children: "Loading Sanity Studio..." })
    ] }) })
  ] }) });
}
function SanityPreviewButton() {
  const ctx = usePluginContext();
  const project = ctx.project;
  useInjectStyles();
  const hasSanity = useSanityDetection();
  const missingEnvKeys = useSanityEnvCheck(hasSanity);
  const [showEnvWarning, setShowEnvWarning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    setShowEnvWarning(false);
    setShowModal(false);
  }, [project == null ? void 0 : project.path]);
  if (!hasSanity) return null;
  const devServerUrl = project == null ? void 0 : project.devServerUrl;
  if (!devServerUrl) return null;
  const hasWarning = missingEnvKeys.length > 0;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "sanity-button-wrapper", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          className: `sanity-button ${hasWarning ? "sanity-button-warning" : ""}`,
          onClick: () => {
            if (hasWarning) {
              setShowEnvWarning(!showEnvWarning);
            } else {
              setShowModal(true);
            }
          },
          title: hasWarning ? "Sanity env vars missing" : "Open Sanity Studio",
          children: [
            /* @__PURE__ */ jsx(SanityIcon, {}),
            hasWarning ? "Sanity" : "Open Sanity",
            hasWarning && /* @__PURE__ */ jsx("span", { className: "sanity-warning-badge", children: "!" })
          ]
        }
      ),
      showEnvWarning && hasWarning && /* @__PURE__ */ jsxs("div", { className: "sanity-env-warning", children: [
        /* @__PURE__ */ jsxs("div", { className: "sanity-env-warning-header", children: [
          /* @__PURE__ */ jsx("span", { children: "Missing Sanity Environment Variables" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setShowEnvWarning(false), children: "×" })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "Add these keys to your environment variables:" }),
        /* @__PURE__ */ jsx("ul", { children: missingEnvKeys.map((key) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("code", { children: key }) }, key)) }),
        /* @__PURE__ */ jsx("p", { className: "sanity-env-warning-hint", children: "Click the Env Vars button in the sidebar to configure." })
      ] })
    ] }),
    showModal && /* @__PURE__ */ jsx(
      SanityModal,
      {
        onClose: () => setShowModal(false),
        devServerUrl
      }
    )
  ] });
}
const name = "Sanity CMS";
const slots = {
  preview: SanityPreviewButton
};
function onActivate() {
  console.log("[sanity-cms] Plugin activated");
}
function onDeactivate() {
  console.log("[sanity-cms] Plugin deactivated");
}
export {
  name,
  onActivate,
  onDeactivate,
  slots
};
