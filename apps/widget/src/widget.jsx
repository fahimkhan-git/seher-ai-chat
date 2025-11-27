import React from "react";
import ReactDOM from "react-dom/client";
import { ChatWidget } from "./ChatWidget.jsx";
import styles from "./styles.css?inline";
import { detectPropertyFromPage } from "./propertyDetector.js";

const mountedWidgets = new Map();

// Get env API URL, but ignore it if it's localhost and we're on HTTPS
const rawEnvApiBaseUrl =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_WIDGET_API_BASE_URL
    : undefined;

// Filter out localhost if we're on HTTPS (runtime check)
const envApiBaseUrl = (() => {
  if (!rawEnvApiBaseUrl) return undefined;
  // If we're on HTTPS and env URL is localhost, ignore it (will use production fallback)
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && 
      (rawEnvApiBaseUrl.includes('localhost') || rawEnvApiBaseUrl.includes('127.0.0.1'))) {
    console.warn("HomesfyChat: Ignoring localhost env API URL on HTTPS site");
    return undefined;
  }
  return rawEnvApiBaseUrl;
})();

const envDefaultProjectId =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_WIDGET_DEFAULT_PROJECT_ID
    : undefined;

async function fetchWidgetTheme(apiBaseUrl, projectId) {
  try {
    // Use AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(
      `${apiBaseUrl}/api/widget-config/${encodeURIComponent(projectId)}`,
      {
        signal: controller.signal,
        credentials: 'omit', // Don't send credentials
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to load widget config for ${projectId}`);
    }
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn("HomesfyChat: Widget theme fetch timeout, using defaults");
    } else {
      console.warn("HomesfyChat: using fallback theme", error);
    }
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

      // Always use fetch with credentials: 'omit' to avoid CORS issues
      // sendBeacon doesn't support credentials control and may cause CORS errors
      fetch(`${apiBaseUrl}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
        credentials: 'omit', // CRITICAL: Must be 'omit' when using wildcard CORS
      }).catch(() => {
        // Silently fail - events are not critical for widget functionality
      });
    } catch (error) {
      console.warn("HomesfyChat: failed to dispatch event", error);
    }
  };
}

async function mountWidget({
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
    // Ensure host is visible and properly positioned
    host.style.cssText = "position: fixed !important; z-index: 2147483647 !important; pointer-events: none !important; display: block !important; visibility: visible !important; opacity: 1 !important;";
    host.setAttribute('data-homesfy-widget-host', 'true');
    
    // Ensure body exists before appending
    if (!document.body) {
      console.error("HomesfyChat: document.body not available, waiting...");
      await new Promise(resolve => {
        if (document.body) {
          resolve();
        } else {
          const observer = new MutationObserver(() => {
            if (document.body) {
              observer.disconnect();
              resolve();
            }
          });
          observer.observe(document.documentElement, { childList: true });
          // Timeout after 5 seconds
          setTimeout(() => {
            observer.disconnect();
            resolve();
          }, 5000);
        }
      });
    }
    
    if (document.body) {
      document.body.appendChild(host);
      console.log("HomesfyChat: Widget host element added to DOM", host);
    } else {
      console.error("HomesfyChat: Failed to add widget host - document.body not available");
      throw new Error("Cannot mount widget: document.body not available");
    }
  }

  let shadow;
  try {
    shadow = host.attachShadow({ mode: "open" });
  } catch (shadowError) {
    console.error("HomesfyChat: Failed to create Shadow DOM:", shadowError);
    // Fallback: use host directly if Shadow DOM is not supported
    shadow = host;
    host.style.cssText += "all: initial; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;";
  }

  const styleTag = document.createElement("style");
  styleTag.textContent = styles;
  shadow.appendChild(styleTag);

  const mountNode = document.createElement("div");
  mountNode.style.cssText = "display: block !important; visibility: visible !important; opacity: 1 !important;";
  shadow.appendChild(mountNode);
  console.log("HomesfyChat: Widget mount node created in Shadow DOM", mountNode);

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
  try {
    // Ensure DOM is ready
    if (document.readyState === 'loading') {
      await new Promise(resolve => {
        if (document.readyState !== 'loading') {
          resolve();
        } else {
          document.addEventListener('DOMContentLoaded', resolve, { once: true });
        }
      });
    }
    
    const scriptElement = options.element || document.currentScript;
    
    const projectId =
      options.projectId ||
      scriptElement?.dataset.project ||
      scriptElement?.dataset.projectId ||
      envDefaultProjectId ||
      "default";
  // Get API base URL - prioritize data attribute, then env, then window global
  // Never use localhost in production - it will cause CORS errors
  let apiBaseUrl = options.apiBaseUrl ||
    scriptElement?.dataset.apiBaseUrl ||
    envApiBaseUrl ||
    window?.HOMESFY_WIDGET_API_BASE_URL;
  
  // CRITICAL: Never use localhost on production HTTPS sites - force production API FIRST
  // This check must happen BEFORE any fallback logic to prevent localhost on HTTPS
  const isHttpsSite = window.location.protocol === 'https:';
  const isLocalhost = apiBaseUrl && (apiBaseUrl.includes('localhost') || apiBaseUrl.includes('127.0.0.1'));
  
  // Production API URL (stable domain)
  const PRODUCTION_API_URL = "https://api-three-pearl.vercel.app";
  
  if (isHttpsSite && isLocalhost) {
    console.error("HomesfyChat: ERROR - localhost API detected on HTTPS site! Forcing production API.");
    apiBaseUrl = PRODUCTION_API_URL;
    console.warn("HomesfyChat: Forced to production API:", apiBaseUrl);
  }
  
  // If no API URL provided, determine based on current site
  if (!apiBaseUrl) {
    const isLocalDev = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('localhost') ||
                       window.location.hostname === '';
    
    if (isLocalDev && window.location.protocol === 'http:') {
      // Only use localhost for actual local development (localhost + HTTP)
      apiBaseUrl = "http://localhost:4000";
      console.log("HomesfyChat: Using localhost API for local development:", apiBaseUrl);
    } else {
      // For ANY other site (production, staging, etc.), use production API
      apiBaseUrl = PRODUCTION_API_URL;
      console.warn("HomesfyChat: No API URL specified, using production API:", apiBaseUrl);
    }
  }
  
  // Final safety check - NEVER use localhost on non-localhost sites
  const currentHostname = window.location.hostname;
  const isActuallyLocalhost = currentHostname === 'localhost' || 
                               currentHostname === '127.0.0.1' ||
                               currentHostname === '';
  
  if (!isActuallyLocalhost && apiBaseUrl && (apiBaseUrl.includes('localhost') || apiBaseUrl.includes('127.0.0.1'))) {
    console.error("HomesfyChat: CRITICAL ERROR - localhost API detected on non-localhost site! Forcing production API.");
    apiBaseUrl = PRODUCTION_API_URL;
    console.warn("HomesfyChat: Final override to production API:", apiBaseUrl);
  }
  
  // Additional check: If on HTTPS, NEVER use HTTP localhost
  if (window.location.protocol === 'https:' && apiBaseUrl && (apiBaseUrl.includes('localhost') || apiBaseUrl.includes('127.0.0.1'))) {
    console.error("HomesfyChat: CRITICAL ERROR - localhost API detected on HTTPS site! Forcing production API.");
    apiBaseUrl = PRODUCTION_API_URL;
    console.warn("HomesfyChat: HTTPS override to production API:", apiBaseUrl);
  }
  
  console.log("HomesfyChat: Using API Base URL:", apiBaseUrl);
  const microsite =
    options.microsite || scriptElement?.dataset.microsite || window.location.hostname;

  const themeOverrides = options.theme || {};
  
  // IMPORTANT: Use DEFAULT config for all microsites (not project-specific)
  // Lead submission will use the actual projectId from embed script
  const leadProjectId = projectId; // Actual project ID for lead submission
  
  console.log("HomesfyChat: Using DEFAULT widget config (same for all microsites)");
  console.log("HomesfyChat: Lead submissions will use project ID:", leadProjectId);
  
  // Use default config - fetch from "default" project or use hardcoded defaults
  let remoteTheme = {};
  try {
    remoteTheme = await fetchWidgetTheme(apiBaseUrl, "default");
    console.log("HomesfyChat: Default widget config loaded:", Object.keys(remoteTheme).length > 0 ? "Config loaded" : "Using hardcoded defaults");
  } catch (error) {
    console.warn("HomesfyChat: Failed to fetch default config, using hardcoded defaults:", error);
    remoteTheme = {};
  }
  
  // ALWAYS detect property information from the current page
  // This ensures the widget works on ANY microsite without manual configuration
  // Run detection in parallel with theme fetch for faster loading
  console.log("HomesfyChat: Detecting property info from page...");
  let detectedPropertyInfo = detectPropertyFromPage();
  console.log("HomesfyChat: Property detection result:", detectedPropertyInfo && Object.keys(detectedPropertyInfo).length > 0 ? "Property detected" : "No property detected");
  
  // If property detected, use it locally (don't POST to API - requires API key)
  // The widget will use detected property info directly without updating server config
  // This avoids 401 errors and works perfectly for widget functionality
  if (detectedPropertyInfo && Object.keys(detectedPropertyInfo).length > 0) {
    console.log("HomesfyChat: Detected property from page:", detectedPropertyInfo);
    // Property info will be merged into theme below - no need to POST to API
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

    console.log("HomesfyChat: Mounting widget...");
    try {
      const widgetInstance = await mountWidget({
        apiBaseUrl,
        projectId: leadProjectId, // Pass actual project ID for lead submission
        microsite,
        theme,
        target: options.target,
      });
      console.log("HomesfyChat: Widget mounted successfully - Config from:", configProjectId, "| Leads will use:", leadProjectId);
      return widgetInstance;
    } catch (error) {
      console.error("HomesfyChat: Failed to mount widget:", error);
      // Don't throw - log error but allow page to continue
      console.warn("HomesfyChat: Widget initialization failed, but page will continue to function");
      // Return a dummy instance to prevent further errors
      return {
        destroy: () => {}
      };
    }
  } catch (initError) {
    console.error("HomesfyChat: Critical error during initialization:", initError);
    // Return a dummy instance to prevent further errors
    return {
      destroy: () => {}
    };
  }
}

const HomesfyChat = { init };

if (typeof window !== "undefined") {
  window.HomesfyChat = HomesfyChat;

  // Auto-init when script loads (unless explicitly disabled)
  // Find script element - handle both sync and async scripts
  const findScriptElement = () => {
    // Try currentScript first (works for sync scripts)
    let scriptElement = document.currentScript;
    
    // If currentScript is null (async script), find the script by src
    if (!scriptElement) {
      const scripts = document.querySelectorAll('script[src*="widget.js"]');
      // Get the last one (most likely the one that just loaded)
      scriptElement = scripts.length > 0 ? scripts[scripts.length - 1] : null;
    }
    
    return scriptElement;
  };
  
  // Function to check if we should auto-init
  const shouldAutoInit = () => {
    const scriptElement = findScriptElement();
    const autoInitDisabled = scriptElement?.dataset.autoInit === "false";
    
    // Check for required attributes - try both camelCase and kebab-case
    const hasProject = scriptElement?.dataset.project || 
                      scriptElement?.getAttribute('data-project');
    const hasApiUrl = scriptElement?.dataset.apiBaseUrl || 
                     scriptElement?.getAttribute('data-api-base-url') ||
                     window?.HOMESFY_WIDGET_API_BASE_URL;
    
    const hasRequiredAttrs = hasProject || hasApiUrl;
    
    return {
      shouldInit: !window.HomesfyChatInitialized && !autoInitDisabled && hasRequiredAttrs,
      scriptElement,
      hasProject,
      hasApiUrl
    };
  };
  
  // Auto-initialize widget
  const initializeWidget = () => {
    if (window.HomesfyChatInitialized) {
      return;
    }
    
    const check = shouldAutoInit();
    
    if (!check.shouldInit) {
      console.log("HomesfyChat: Auto-init skipped", {
        initialized: window.HomesfyChatInitialized,
        hasProject: check.hasProject,
        hasApiUrl: check.hasApiUrl,
        scriptElement: check.scriptElement
      });
      return;
    }
    
    try {
      window.HomesfyChatInitialized = true;
      const scriptElement = check.scriptElement;
      
      console.log("HomesfyChat: Auto-initializing widget...");
      console.log("HomesfyChat: Script element found:", !!scriptElement);
      console.log("HomesfyChat: Project ID:", scriptElement?.dataset.project || scriptElement?.getAttribute('data-project'));
      console.log("HomesfyChat: API Base URL:", scriptElement?.dataset.apiBaseUrl || scriptElement?.getAttribute('data-api-base-url'));
      
      // Extract options from script element
      const options = {
        element: scriptElement,
        projectId: scriptElement?.dataset.project || scriptElement?.getAttribute('data-project'),
        apiBaseUrl: scriptElement?.dataset.apiBaseUrl || scriptElement?.getAttribute('data-api-base-url') || window?.HOMESFY_WIDGET_API_BASE_URL,
        microsite: scriptElement?.dataset.microsite || scriptElement?.getAttribute('data-microsite') || window.location.hostname
      };
      
      console.log("HomesfyChat: Calling init() with options:", { projectId: options.projectId, apiBaseUrl: options.apiBaseUrl, microsite: options.microsite });
      init(options).then((instance) => {
        if (instance && typeof instance.destroy === 'function') {
          console.log("HomesfyChat: ✅ Widget initialized successfully!");
          window.HomesfyChatInitialized = true;
        } else {
          console.warn("HomesfyChat: ⚠️ Widget initialized but instance is invalid");
          window.HomesfyChatInitialized = true; // Still mark as initialized to prevent retry loops
        }
      }).catch((error) => {
        console.error("HomesfyChat: ❌ Initialization error:", error);
        console.error("HomesfyChat: Error stack:", error.stack);
        // Don't set to false - allow retry on next page load
        // But prevent infinite retry loops
        if (!window.HomesfyChatInitAttempts) {
          window.HomesfyChatInitAttempts = 0;
        }
        window.HomesfyChatInitAttempts++;
        if (window.HomesfyChatInitAttempts >= 3) {
          console.error("HomesfyChat: Too many initialization attempts, stopping retries");
          window.HomesfyChatInitialized = true; // Stop retrying
        }
      });
    } catch (error) {
      console.error("HomesfyChat: Failed to auto-initialize", error);
      window.HomesfyChatInitialized = false;
    }
  };
  
  // Try to initialize - with retry logic for async scripts
  const tryInitialize = () => {
    // Immediate attempt
    setTimeout(initializeWidget, 100);
    
    // Wait a bit for async scripts to have their attributes parsed
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        setTimeout(initializeWidget, 200);
      });
    } else {
      // DOM already loaded - try immediately, then retry if needed
      setTimeout(initializeWidget, 200);
    }
    
    // Multiple retry attempts for async scripts
    [500, 1000, 2000, 3000].forEach((delay) => {
      setTimeout(() => {
        if (!window.HomesfyChatInitialized) {
          console.log(`HomesfyChat: Retrying initialization after ${delay}ms...`);
          initializeWidget();
        }
      }, delay);
    });
  };
  
  tryInitialize();
}

export default HomesfyChat;




