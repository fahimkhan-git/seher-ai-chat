import React from "react";
import ReactDOM from "react-dom/client";
import { ChatWidget } from "./ChatWidget.jsx";
import styles from "./styles.css?inline";
import { detectPropertyFromPage } from "./propertyDetector.js";

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
    console.log("HomesfyChat: Widget already mounted for project", projectId);
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
    scriptElement?.dataset.projectId ||
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
  
  // ALWAYS detect property information from the current page
  // This ensures the widget works on ANY microsite without manual configuration
  let detectedPropertyInfo = detectPropertyFromPage();
  
  // If property detected, send it to API to update config for this project
  if (detectedPropertyInfo && apiBaseUrl && Object.keys(detectedPropertyInfo).length > 0) {
    console.log("HomesfyChat: Detected property from page, sending to API:", detectedPropertyInfo);
    try {
      await fetch(`${apiBaseUrl}/api/widget-config/${encodeURIComponent(projectId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyInfo: detectedPropertyInfo }),
      }).catch(() => {
        // Silently fail - widget will still work with detected info
      });
    } catch (error) {
      console.warn("HomesfyChat: Failed to save detected property info", error);
    }
  }
  
  // Always prioritize detected property info over remote config
  // This allows the same script to work on different microsites
  const theme = { 
    ...remoteTheme, 
    ...themeOverrides,
    // Use detected property info if available, otherwise use remote config
    propertyInfo: detectedPropertyInfo && Object.keys(detectedPropertyInfo).length > 0
      ? detectedPropertyInfo 
      : (remoteTheme?.propertyInfo || {})
  };

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

  // Auto-init when script loads (unless explicitly disabled)
  // Check if auto-init is disabled
  const scriptElement = document.currentScript;
  const autoInitDisabled = scriptElement?.dataset.autoInit === "false";
  
  // Auto-initialize if:
  // 1. Not already initialized
  // 2. Auto-init is not explicitly disabled
  // 3. Script has required data attributes (project or apiBaseUrl)
  const hasRequiredAttrs = scriptElement?.dataset.project || 
                           scriptElement?.dataset.apiBaseUrl ||
                           window?.HOMESFY_WIDGET_API_BASE_URL;
  
  if (!window.HomesfyChatInitialized && !autoInitDisabled && hasRequiredAttrs) {
    // Use DOMContentLoaded or immediate if already loaded
    const initializeWidget = () => {
      if (!window.HomesfyChatInitialized) {
        try {
          window.HomesfyChatInitialized = true;
          console.log("HomesfyChat: Auto-initializing widget...");
          console.log("HomesfyChat: Script element:", scriptElement);
          console.log("HomesfyChat: Project ID:", scriptElement?.dataset.project);
          console.log("HomesfyChat: API Base URL:", scriptElement?.dataset.apiBaseUrl);
          init().then(() => {
            console.log("HomesfyChat: Widget initialized successfully");
          }).catch((error) => {
            console.error("HomesfyChat: Initialization error:", error);
            window.HomesfyChatInitialized = false;
          });
        } catch (error) {
          console.error("HomesfyChat: Failed to auto-initialize", error);
          window.HomesfyChatInitialized = false;
        }
      }
    };
    
    // Always wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initializeWidget);
    } else {
      // DOM already loaded, initialize after a short delay to ensure everything is ready
      setTimeout(initializeWidget, 100);
    }
  } else {
    console.log("HomesfyChat: Auto-init skipped", {
      initialized: window.HomesfyChatInitialized,
      disabled: autoInitDisabled,
      hasAttrs: hasRequiredAttrs
    });
  }
}

export default HomesfyChat;

