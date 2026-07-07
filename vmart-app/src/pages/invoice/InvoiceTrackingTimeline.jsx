/**
 * InvoiceTrackingTimeline – Reusable progress timeline for invoice/delivery status.
 * Use `variant="list"` for compact version, omit or `variant="detail"` for full-size.
 */
export default function InvoiceTrackingTimeline({ status, variant = "detail" }) {
  const statuses = ["draft", "in_process", "delivered_to_courier", "delivered"];
  const stepLabels = ["Draft", "In Process", "With Courier", "Delivered"];
  const currentIdx = statuses.indexOf(status || "draft");
  const p = "inv";

  return (
    <div className={`${p}-timeline`}>
      {statuses.map((step, si) => {
        const isCompleted = si <= currentIdx;
        const isCurrent = si === currentIdx;
        return (
          <div key={step} className={`${p}-timeline-step`}>
            <div className={`${p}-timeline-dot-col`}>
              <div
                className={`${p}-timeline-dot${isCurrent ? ` ${p}-timeline-dot--current` : ""}${isCompleted ? ` ${p}-timeline-dot--completed` : ` ${p}-timeline-dot--default`}`}
                style={{ background: isCompleted ? "var(--accent-primary)" : undefined }}
              />
              <span
                className={`${p}-timeline-label${isCompleted ? ` ${p}-timeline-label--completed` : ""}${isCurrent ? ` ${p}-timeline-label--current` : ""}`}
              >
                {stepLabels[si]}
              </span>
            </div>
            {si < statuses.length - 1 && (
              <div className={`${p}-timeline-line${si < currentIdx ? ` ${p}-timeline-line--active` : ` ${p}-timeline-line--inactive`}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
