import React from "react";
import ReactDOM from "react-dom/client";
import { ChatWidget } from "./ChatWidget.jsx";
import styles from "./styles.css?inline";

const mountedWidgets = new Map();

const envApiBaseUrl =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_WIDGET_API_BASE_URL
    : undefined;

const envDefaultProjectId =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_WIDGET_DEFAULT_PROJECT_ID
    : undefined;

async function fetchWidgetTheme(apiBaseUrl, projectId) {
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/widget-config/${encodeURIComponent(projectId)}`
    );
    if (!response.ok) {
      throw new Error(`Failed to load widget config for ${projectId}`);
    }
    return await response.json();
  } catch (error) {
    console.warn("HomesfyChat: using fallback theme", error);
    return {};
  }
}

function createEventDispatcher(apiBaseUrl, projectId, microsite) {
  return (type, extra = {}) => {
    try {
      const payload = {
        type,
        projectId,
        microsite,
        payload: { ...extra, at: new Date().toISOString() },
      };

      const body = JSON.stringify(payload);

      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon(`${apiBaseUrl}/api/events`, blob);
      } else {
        fetch(`${apiBaseUrl}/api/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } catch (error) {
      console.warn("HomesfyChat: failed to dispatch event", error);
    }
  };
}

function mountWidget({
  apiBaseUrl,
  projectId,
  microsite,
  theme,
  target,
}) {
  if (mountedWidgets.has(projectId)) {
    return mountedWidgets.get(projectId);
  }

  const host = target ?? document.createElement("div");
  if (!target) {
    document.body.appendChild(host);
  }

  const shadow = host.attachShadow({ mode: "open" });
  const styleTag = document.createElement("style");
  styleTag.textContent = styles;
  shadow.appendChild(styleTag);

  const mountNode = document.createElement("div");
  shadow.appendChild(mountNode);

  const root = ReactDOM.createRoot(mountNode);
  root.render(
    <ChatWidget
      apiBaseUrl={apiBaseUrl}
      projectId={projectId}
      microsite={microsite}
      theme={theme}
      onEvent={createEventDispatcher(apiBaseUrl, projectId, microsite)}
    />
  );

  const instance = {
    destroy() {
      root.unmount();
      mountedWidgets.delete(projectId);
      if (!target) {
        host.remove();
      }
    },
  };

  mountedWidgets.set(projectId, instance);
  return instance;
}

async function init(options = {}) {
  const scriptElement = options.element || document.currentScript;
  const projectId =
    options.projectId ||
    scriptElement?.dataset.project ||
    envDefaultProjectId ||
    "default";
  const apiBaseUrl =
    options.apiBaseUrl ||
    scriptElement?.dataset.apiBaseUrl ||
    envApiBaseUrl ||
    window?.HOMESFY_WIDGET_API_BASE_URL ||
    "http://localhost:4000";
  const microsite =
    options.microsite || scriptElement?.dataset.microsite || window.location.hostname;

  const themeOverrides = options.theme || {};
  const remoteTheme = await fetchWidgetTheme(apiBaseUrl, projectId);
  const theme = { ...remoteTheme, ...themeOverrides };

  return mountWidget({
    apiBaseUrl,
    projectId,
    microsite,
    theme,
    target: options.target,
  });
}

const HomesfyChat = { init };

if (typeof window !== "undefined") {
  window.HomesfyChat = HomesfyChat;

  if (document.currentScript?.dataset.autoInit !== "false") {
    init();
  }
}

export default HomesfyChat;

