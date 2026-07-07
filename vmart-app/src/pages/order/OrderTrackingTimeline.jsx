/**
 * OrderTrackingTimeline – Reusable progress timeline for order status.
 * Use `variant="list"` for the compact list-view version.
 * Use `variant="detail"` or omit for the full-size detail view.
 */
export default function OrderTrackingTimeline({ status, variant = "detail" }) {
  const statuses = [
    "pending",
    "in_process",
    "delivered_to_courier",
    "delivered",
  ];
  const stepLabels = ["Pending", "Processing", "With Courier", "Delivered"];
  const currentIdx = statuses.indexOf(status || "pending");
  const isList = variant === "list";

  if (isList) {
    const prefix = "order-timeline";
    return (
      <div className={`${prefix}-list`}>
        {statuses.map((step, si) => {
          const isCompleted = si <= currentIdx;
          const isCurrent = si === currentIdx;
          return (
            <div key={step} className={`${prefix}-step-sm`}>
              <div className={`${prefix}-dot-col-sm`}>
                <div
                  className={`${prefix}-dot-sm${isCurrent ? ` ${prefix}-dot-sm--current` : ""}${isCompleted ? ` ${prefix}-dot-sm--completed` : ` ${prefix}-dot-sm--default`}`}
                  style={{
                    background: isCompleted
                      ? "var(--accent-primary)"
                      : undefined,
                  }}
                />
                <span
                  className={`${prefix}-label-sm${isCompleted ? ` ${prefix}-label-sm--completed` : ""}${isCurrent ? ` ${prefix}-label-sm--current` : ""}`}
                >
                  {stepLabels[si]}
                </span>
              </div>
              {si < statuses.length - 1 && (
                <div
                  className={`${prefix}-line-sm`}
                  style={{
                    background:
                      si < currentIdx
                        ? "var(--accent-primary)"
                        : "var(--border)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="order-timeline">
      {statuses.map((step, si) => {
        const isCompleted = si <= currentIdx;
        const isCurrent = si === currentIdx;
        return (
          <div key={step} className="order-timeline-step">
            <div className="order-timeline-dot-col">
              <div
                className={`order-timeline-dot${isCurrent ? " order-timeline-dot--current" : ""}${isCompleted ? " order-timeline-dot--completed" : " order-timeline-dot--default"}`}
                style={{
                  background: isCompleted ? "var(--accent-primary)" : undefined,
                }}
              />
              <span
                className={`order-timeline-label${isCompleted ? " order-timeline-label--completed" : ""}${isCurrent ? " order-timeline-label--current" : ""}`}
              >
                {stepLabels[si]}
              </span>
            </div>
            {si < statuses.length - 1 && (
              <div
                className="order-timeline-line"
                style={{
                  background:
                    si < currentIdx ? "var(--accent-primary)" : "var(--border)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
