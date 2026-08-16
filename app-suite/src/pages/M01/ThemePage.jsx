import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
  PageCardFooter,
} from "@/components/PageCard";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { IconCheck, IconInfo, IconRefresh, IconSettings } from "@/icons";
import { useApp } from "@/context/AppContext";
import { DEFAULT_THEME, THEME_COLORS } from "@/utils/theme";
import { toast } from "@/components/ToastBox";

const ThemePage = () => {
  const { themeColor, setThemeColor } = useApp();

  const activeTheme =
    THEME_COLORS.find((t) => t.id === themeColor) || THEME_COLORS[0];

  const handleSelect = (theme) => {
    setThemeColor(theme.id);
    toast.success(`Theme color set to ${theme.name}`);
  };

  const handleReset = () => {
    setThemeColor(DEFAULT_THEME);
    toast.success("Theme color reset to default");
  };

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Theme"
            subtitle="Application preferences — choose the theme color used across the app"
          />
          <PageCardActions>
            <Button
              variant="outline"
              size="sm"
              icon={<IconRefresh size={14} />}
              onClick={handleReset}
              disabled={themeColor === DEFAULT_THEME}
            >
              Reset to default
            </Button>
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          <div className="general-page__section">
            <div className="general-page__section-head">
              <Badge variant="info" icon={<IconSettings size={12} />}>
                Theme Color
              </Badge>
              <span className="general-page__section-note">
                Current: {activeTheme.name} · applies instantly and is saved on
                this device
              </span>
            </div>
            <div
              className="general-page__swatches"
              role="radiogroup"
              aria-label="Theme color"
            >
              {THEME_COLORS.map((theme) => {
                const selected = theme.id === themeColor;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={`general-page__swatch-btn${
                      selected ? " general-page__swatch-btn--selected" : ""
                    }`}
                    onClick={() => handleSelect(theme)}
                    title={`${theme.name}${theme.desc ? ` — ${theme.desc}` : ""}`}
                  >
                    <span
                      className="general-page__swatch"
                      style={{ backgroundColor: theme.color }}
                    >
                      {selected && <IconCheck size={14} />}
                    </span>
                    <span className="general-page__swatch-name">
                      {theme.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="general-page__section">
            <div className="general-page__section-head">
              <Badge variant="accent" icon={<IconInfo size={12} />}>
                Preview
              </Badge>
              <span className="general-page__section-note">
                Buttons, badges and surfaces follow the selected color
              </span>
            </div>
            <div className="general-page__preview-card">
              <span className="general-page__preview-title">Sample card</span>
              <span className="general-page__preview-desc">
                This is how controls look with the current theme color.
              </span>
              <div className="general-page__preview-row">
                <Button size="sm">Primary</Button>
                <Button variant="outline" size="sm">
                  Outline
                </Button>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
              </div>
            </div>
          </div>
        </PageCardBody>
        <PageCardFooter>
          <Badge variant="info" icon={<IconInfo size={12} />}>
            Theme preference is stored in your browser and persists across
            sessions
          </Badge>
        </PageCardFooter>
      </PageCard>
    </div>
  );
};

export default ThemePage;
