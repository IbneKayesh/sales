import Button from "@/components/Button";
import { toast } from "@/components/ToastBox";
import { IconActivity, IconArrowRight } from "@/icons";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function WelcomeHeader({ userName = "User", onRefresh, isLoading = false }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleRefresh = () => {
    onRefresh?.();
    toast.info("Dashboard refreshed");
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "var(--sp-4)",
        flexWrap: "wrap",
      }}
    >
      <div style={{ textAlign: "left" }}>
        <h2
          style={{
            fontSize: "var(--fs-2xl)",
            fontWeight: "var(--fw-bold)",
            color: "var(--text-primary)",
            margin: 0,
            letterSpacing: "-0.3px",
          }}
        >
          {getGreeting()}, {userName} 👋
        </h2>
        <p
          style={{
            fontSize: "var(--fs-sm)",
            color: "var(--text-muted)",
            margin: "var(--sp-1) 0 0",
          }}
        >
          {today} &middot; ERP Dashboard
        </p>
      </div>
      <div style={{ display: "flex", gap: "var(--sp-2)", flexShrink: 0 }}>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <IconActivity size={14} />
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
        <Button variant="primary" size="sm" onClick={() => toast.success("Report exported")}>
          <IconArrowRight size={14} />
          Export Report
        </Button>
      </div>
    </div>
  );
}