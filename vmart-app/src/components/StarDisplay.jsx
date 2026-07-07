/**
 * StarDisplay – Renders a row of filled/empty star characters.
 * Used across HomePage and ShoppingPage.
 */
/**
 * StarDisplay – Renders a row of filled/empty star characters.
 * Uses inline styles to avoid CSS class dependency.
 */
export default function StarDisplay({ rating, size = 12 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        style={{ fontSize: size, lineHeight: 1, color: i <= rating ? "#f59e0b" : "var(--border)" }}
      >
        ★
      </span>,
    );
  }
  return <span style={{ whiteSpace: "nowrap" }}>{stars}</span>;
}
