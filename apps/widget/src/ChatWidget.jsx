import { useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";

const DEFAULT_PRIMARY_COLOR = "#6158ff";
const DEFAULT_PRIMARY_RGB = "97, 88, 255";
const DEFAULT_AVATAR_URL =
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHN2Z2FzdmY4MmFjYWZ2enl1cWx1d3ozYnkwNWJxb2l4dXUzcDZvOCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oriO0OEd9QIDdllqo/giphy.gif";

function extractRgbChannels(color) {
  if (typeof color !== "string") {
    return null;
  }

  const trimmed = color.trim();

  if (trimmed.startsWith("#")) {
    let hex = trimmed.slice(1);
    if ([3, 4].includes(hex.length)) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("")
        .slice(0, 6);
    }

    if ((hex.length === 6 || hex.length === 8) && /^[0-9a-f]{6,8}$/i.test(hex)) {
      const base = hex.slice(0, 6);
      const r = parseInt(base.slice(0, 2), 16);
      const g = parseInt(base.slice(2, 4), 16);
      const b = parseInt(base.slice(4, 6), 16);
      return `${r}, ${g}, ${b}`;
    }

    return null;
  }

  const rgbMatch = trimmed.match(
    /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i
  );

  if (rgbMatch) {
    const [, r, g, b] = rgbMatch.map(Number);
    if ([r, g, b].every((channel) => channel >= 0 && channel <= 255)) {
      return `${r}, ${g}, ${b}`;
    }
  }

  return null;
}

function resolveAvatarUrl(raw) {
  if (raw === undefined) {
    return DEFAULT_AVATAR_URL;
  }

  if (raw === null) {
    return "";
  }

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    return trimmed;
  }

  return DEFAULT_AVATAR_URL;
}

const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];
const CTA_OPTIONS = [
  "Pricing & Floor Plans 💸💸",
  "Download Brochure ⬇️",
  "Get The Best Quote 💰",
  "Site Visit Or Virtual Tour 🚁",
  "Pricing on Whatsapp ✅",
  "Get A Call Back 📞",
];

const BHK_OPTIONS = [
  "1 Bhk",
  "2 Bhk",
  "3 Bhk",
  "4 Bhk",
  "Other",
  "Yet to decide",
];

const generateId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function ChatWidget({
  apiBaseUrl,
  projectId,
  microsite,
  theme = {},
  onEvent,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCta, setSelectedCta] = useState(null);
  const [selectedBhk, setSelectedBhk] = useState(null);
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [visitorContext, setVisitorContext] = useState({});
  const messagesEndRef = useRef(null);
  const hasShownRef = useRef(false);
  const [manualInput, setManualInput] = useState("");

  const resolvedTheme = useMemo(
    () => ({
      agentName: theme.agentName || "Pooja Agarwal",
      avatarUrl: resolveAvatarUrl(theme.avatarUrl),
      primaryColor: theme.primaryColor || DEFAULT_PRIMARY_COLOR,
      bubblePosition: theme.bubblePosition || "bottom-right",
      welcomeMessage:
        theme.welcomeMessage ||
        "Hey, I'm Pooja Agarwal! How can I help you understand this project?",
      ctaAcknowledgement:
        theme.ctaAcknowledgement || "Sure… I’ll send that across right away!",
      bhkPrompt:
        theme.bhkPrompt || "Which configuration you are looking for?",
      inventoryMessage:
        theme.inventoryMessage ||
        "That’s cool… we have inventory available with us.",
      phonePrompt:
        theme.phonePrompt || "Please enter your mobile number...",
      thankYouMessage:
        theme.thankYouMessage ||
        "Thanks! Our expert will call you shortly 📞",
      autoOpenDelayMs: Number(theme.autoOpenDelayMs || 4000),
      bubbleTitle: theme.bubbleTitle || "Chat with us",
      bubbleSubtitle: theme.bubbleSubtitle || "Expert help in minutes",
      heroPoints:
        Array.isArray(theme.heroPoints) && theme.heroPoints.length > 0
          ? theme.heroPoints
          : [
              "Instant project availability",
              "Exclusive launch offers",
              "Dedicated closing support",
            ],
      trustBadges:
        Array.isArray(theme.trustBadges) && theme.trustBadges.length > 0
          ? theme.trustBadges
          : [
              "2000+ happy buyers assisted",
              "Verified listings • RERA compliant",
            ],
    }),
    [theme]
  );

  const ctaOptions = CTA_OPTIONS;

  const bhkOptions = BHK_OPTIONS;

  const primaryRgb = useMemo(
    () =>
      extractRgbChannels(resolvedTheme.primaryColor) ?? DEFAULT_PRIMARY_RGB,
    [resolvedTheme.primaryColor]
  );

  function trackEvent(type, payload) {
    onEvent?.(type, { projectId, microsite, ...payload });

    if (!apiBaseUrl) {
      return;
    }

    fetch(`${apiBaseUrl}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        projectId,
        microsite,
        payload,
      }),
    }).catch((error) => {
      console.error("Failed to record widget event", error);
    });
  }

  function pushSystemMessage(text) {
    setMessages((prev) => [
      ...prev,
      {
        id: generateId(),
        type: "system",
        text,
        timestamp: Date.now(),
      },
    ]);
  }

  function pushUserMessage(text) {
    setMessages((prev) => [
      ...prev,
      {
        id: generateId(),
        type: "user",
        text,
        timestamp: Date.now(),
      },
    ]);
  }

  useEffect(() => {
    if (hasShownRef.current) {
      return;
    }

    hasShownRef.current = true;
    setIsOpen(true);
    pushSystemMessage(resolvedTheme.welcomeMessage);
    trackEvent("chat_shown");
  }, [resolvedTheme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const currentUrl = new URL(window.location.href);
    const utm = UTM_PARAMS.reduce((acc, key) => {
      const value = currentUrl.searchParams.get(key);
      if (value) {
        acc[key.replace("utm_", "")] = value;
      }
      return acc;
    }, {});

    setVisitorContext((prev) => ({
      ...prev,
      utm: Object.keys(utm).length ? utm : prev?.utm,
      landingPage: `${currentUrl.pathname}${currentUrl.search}`,
      referrer: document.referrer || prev?.referrer,
      userAgent:
        typeof navigator !== "undefined"
          ? navigator.userAgent
          : prev?.userAgent,
      firstSeenAt: prev?.firstSeenAt || new Date().toISOString(),
    }));

    let cancelled = false;

    fetch("https://ipapi.co/json/")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (cancelled || !data) {
          return;
        }

        setVisitorContext((prev) => ({
          ...prev,
          location: {
            city: data.city,
            region: data.region,
            country: data.country_name,
            countryCode: data.country,
            latitude: data.latitude,
            longitude: data.longitude,
            timezone: data.timezone,
          },
          ip: data.ip,
        }));
      })
      .catch(() => {
        /* silently ignore */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen && messages.length === 0) {
      pushSystemMessage(resolvedTheme.welcomeMessage);
    }
  };

  const handleCtaSelect = (cta) => {
    setSelectedCta(cta);
    pushUserMessage(cta);
    trackEvent("cta_selected", { label: cta });
    setIsTyping(true);

    setTimeout(() => {
      pushSystemMessage(resolvedTheme.ctaAcknowledgement);
    }, 400);

    setTimeout(() => {
      pushSystemMessage(resolvedTheme.bhkPrompt);
      setIsTyping(false);
    }, 1100);
  };

  const handleBhkSelect = (bhk) => {
    setSelectedBhk(bhk);
    pushUserMessage(bhk);
    trackEvent("chat_started", { bhkType: bhk });
    setIsTyping(true);

    setTimeout(() => {
      pushSystemMessage(resolvedTheme.inventoryMessage);
    }, 500);

    setTimeout(() => {
      pushSystemMessage(resolvedTheme.phonePrompt);
      setIsTyping(false);
    }, 1500);
  };

  const replyPlaceholder = !selectedCta
    ? "Write a reply.."
    : !selectedBhk
    ? "Tell us your preferred configuration"
    : !phoneSubmitted
    ? "Enter mobile number"
    : "Write a reply..";

  async function submitLeadInput(rawInput) {
    setError(null);
    const normalizedPhone = rawInput.replace(/[^0-9+]/g, "");

    if (normalizedPhone.length < 8) {
      setError("Please enter a valid phone number");
      return false;
    }

    try {
      const submissionMessage = {
        id: generateId(),
        type: "user",
        text: normalizedPhone,
        timestamp: Date.now(),
      };

      const conversationSnapshot = messages.map((message) => ({
        id: message.id,
        type: message.type,
        text: message.text,
        timestamp: message.timestamp,
      }));

      conversationSnapshot.push(submissionMessage);

      const payload = {
        phone: normalizedPhone,
        bhkType: selectedBhk,
        microsite: microsite || projectId,
        metadata: {
          projectId,
          visitor: {
            ...visitorContext,
            lastInteractionAt: new Date().toISOString(),
          },
        },
        conversation: conversationSnapshot,
      };

      const response = await fetch(`${apiBaseUrl}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save lead");
      }

      pushUserMessage(normalizedPhone);
      setPhoneSubmitted(true);
      pushSystemMessage(resolvedTheme.thankYouMessage);
      trackEvent("lead_submitted", { bhkType: selectedBhk });
      return true;
    } catch (err) {
      console.error(err);
      setError("We couldn't save your details. Please try again.");
      return false;
    }
  }

  const handleManualSubmit = async (event) => {
    event.preventDefault();

    if (isTyping) {
      return;
    }

    const trimmed = manualInput.trim();
    if (!trimmed) {
      return;
    }

    if (!selectedCta) {
      setManualInput("");
      handleCtaSelect(trimmed);
      return;
    }

    if (!selectedBhk) {
      setManualInput("");
      handleBhkSelect(trimmed);
      return;
    }

    if (!phoneSubmitted) {
      const success = await submitLeadInput(trimmed);
      if (success) {
        setManualInput("");
      }
      return;
    }

    pushUserMessage(trimmed);
    trackEvent("manual_message", { stage: "post_lead" });
    setManualInput("");
  };

  return (
    <div
      className={`homesfy-widget homesfy-widget__${resolvedTheme.bubblePosition}`}
      style={{
        "--homesfy-primary": resolvedTheme.primaryColor,
        "--homesfy-primary-rgb": primaryRgb,
      }}
    >
      {isOpen && (
        <div className="homesfy-widget__window">
          <span className="homesfy-widget__window-glow" aria-hidden />
          <header
            className="homesfy-widget__header"
            style={{ background: resolvedTheme.primaryColor }}
          >
            <div className="homesfy-widget__header-left">
              {resolvedTheme.avatarUrl && (
                <div className="homesfy-widget__avatar-shell">
                  <img
                    src={resolvedTheme.avatarUrl}
                    alt={resolvedTheme.agentName}
                    className="homesfy-widget__agent-avatar"
                  />
                  <span className="homesfy-widget__avatar-ring" aria-hidden />
                </div>
              )}
              <div className="homesfy-widget__header-copy">
                <p className="homesfy-widget__agent-name">
                  {resolvedTheme.agentName}
                </p>
                <p className="homesfy-widget__agent-status">
                  <span className="homesfy-widget__status-dot" aria-hidden />
                  Live property expert • replies under 2 min
                </p>
              </div>
            </div>
            <button className="homesfy-widget__close" onClick={handleToggle}>
              ×
            </button>
          </header>

          {/* Hero section removed per request */}

          <div className="homesfy-widget__messages">
            {messages.map((message) => {
              const isUser = message.type === "user";

              return (
                <div
                  key={message.id}
                  className={`homesfy-widget__message-row homesfy-widget__message-row--${message.type}`}
                >
                  {!isUser && resolvedTheme.avatarUrl && (
                    <div className="homesfy-widget__message-avatar homesfy-widget__message-avatar--agent">
                      <img
                        src={resolvedTheme.avatarUrl}
                        alt={resolvedTheme.agentName}
                      />
                    </div>
                  )}

                  <div
                    className={`homesfy-widget__bubble homesfy-widget__bubble--${message.type}`}
                  >
                    {message.text.split("\n").map((line, idx) => (
                      <span key={idx}>{line}</span>
                    ))}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="homesfy-widget__message-row homesfy-widget__message-row--system">
                {resolvedTheme.avatarUrl && (
                  <div className="homesfy-widget__message-avatar homesfy-widget__message-avatar--agent">
                    <img
                      src={resolvedTheme.avatarUrl}
                      alt={resolvedTheme.agentName}
                    />
                  </div>
                )}
                <div className="homesfy-widget__bubble homesfy-widget__bubble--system">
                  <span className="homesfy-widget__typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="homesfy-widget__input">
            {!selectedCta && (
              <div className="homesfy-widget__cta-grid">
                {ctaOptions.map((option) => (
                  <button
                    key={option}
                    className="homesfy-widget__cta-button"
                    style={{
                      borderColor: resolvedTheme.primaryColor,
                      color: resolvedTheme.primaryColor,
                    }}
                    onClick={() => handleCtaSelect(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {selectedCta && !selectedBhk && !isTyping && (
              <div className="homesfy-widget__options">
                {bhkOptions.map((option) => (
                  <button
                    key={option}
                    className="homesfy-widget__option-button"
                    style={{
                      borderColor: resolvedTheme.primaryColor,
                      color: resolvedTheme.primaryColor,
                    }}
                    onClick={() => handleBhkSelect(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {phoneSubmitted && (
              <p className="homesfy-widget__footer-note">
                You can close the chat. We'll reach out soon.
              </p>
            )}

            {error && <p className="homesfy-widget__error">{error}</p>}

            <form className="homesfy-widget__form" onSubmit={handleManualSubmit}>
              <input
                type="text"
                className="homesfy-widget__field"
                placeholder={replyPlaceholder}
                value={manualInput}
                onChange={(event) => {
                  setManualInput(event.target.value);
                  if (error) {
                    setError(null);
                  }
                }}
                disabled={isTyping}
              />
              <button
                type="submit"
                className="homesfy-widget__submit"
                style={{ background: resolvedTheme.primaryColor }}
                disabled={isTyping || !manualInput.trim()}
              >
                ➤
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        className="homesfy-widget__bubble-button"
        style={{ background: resolvedTheme.primaryColor }}
        onClick={handleToggle}
      >
        <span className="homesfy-widget__bubble-glow" aria-hidden />
        <img
          src={resolvedTheme.avatarUrl}
          alt="Agent"
          className="homesfy-widget__bubble-avatar"
        />
        <div className="homesfy-widget__bubble-text">
          <span className="homesfy-widget__bubble-title">
            {resolvedTheme.bubbleTitle}
          </span>
          <span className="homesfy-widget__bubble-subtitle">
            {resolvedTheme.bubbleSubtitle}
          </span>
        </div>
      </button>
    </div>
  );
}

