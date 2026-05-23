export const formatFeatureTypeLabel = (type) => {
  const map = {
    project: "PRJ",
    module: "MOD",
    submodule: "SUB",
    feature: "FEAT",
  };
  return map[type] || (type ? String(type).slice(0, 4).toUpperCase() : "—");
};

const parseDateOnly = (dateStr) => {
  const [y, m, d] = String(dateStr).slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** Days until end_date from today; negative means overdue. */
export const formatEndDateRemaining = (dateStr) => {
  const end = parseDateOnly(dateStr);
  if (!end) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffDays = Math.round((end - today) / (1000 * 60 * 60 * 24));

  if (diffDays > 1) return `${diffDays}d left`;
  if (diffDays === 1) return "1d left";
  if (diffDays === 0) return "Today";
  if (diffDays === -1) return "1d overdue";
  return `${Math.abs(diffDays)}d overdue`;
};

export const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
