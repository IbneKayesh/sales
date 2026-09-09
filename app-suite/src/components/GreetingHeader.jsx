import { IconSunrise, IconSun, IconSunset, IconMoon } from "@/icons";

/**
 * Time-of-day greeting header with icon, user name, and subtitle.
 * Replaces both ModulePage's inline greeting and the old WelcomeHeader.
 *
 * Props:
 *   userName  – full name (first name is extracted automatically)
 *   subtitle  – text below the greeting (e.g. "12 applications · 48 features")
 *   icon      – override the auto time-of-day icon with a custom element
 *   actions   – optional right-side content (buttons, etc.)
 *   className – extra class on the root div
 */
export default function GreetingHeader({
  userName = "",
  subtitle,
  icon,
  actions,
  className = "",
}) {
  const firstName = userName.trim().split(/\s+/)[0];

  // Auto-detect time-of-day icon if none provided
  const resolvedIcon =
    icon ??
    (() => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) return <IconSunrise size={34} />;
      if (hour >= 12 && hour < 17) return <IconSun size={34} />;
      if (hour >= 17 && hour < 21) return <IconSunset size={34} />;
      return <IconMoon size={34} />;
    })();

  // Auto-detect greeting text
  const greetingText = (() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  })();

  return (
    <div className={`greeting-header${className ? " " + className : ""}`}>
      <div className="greeting-header__left">
        <span className="greeting-header__icon">{resolvedIcon}</span>
        <div>
          <h2 className="greeting-header__title">
            {greetingText}
            {firstName ? `, ${firstName}` : ""}!
          </h2>
          {subtitle && (
            <p className="greeting-header__subtitle">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="greeting-header__actions">{actions}</div>}
    </div>
  );
}
