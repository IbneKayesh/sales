const currentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const currentDateTime = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = (now.getMonth() + 1).toString().padStart(2, "0");
  const dd = now.getDate().toString().padStart(2, "0");
  const hh = now.getHours().toString().padStart(2, "0");
  const min = now.getMinutes().toString().padStart(2, "0");
  const ss = now.getSeconds().toString().padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

const formatDate = (date) => {
  if (!date) return "";
  // Check if it's already a JS Date object
  let d = date;
  if (typeof date === "string") {
    // If it's a full ISO string (has T), Date constructor handles it usually.
    // If it's pure YYYY-MM-DD, splitting is safer to avoid timezone shift.
    if (date.includes("T")) {
      d = new Date(date);
    } else {
      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    }
  } else if (!(date instanceof Date)) {
    return "";
  }

  // If it ended up as a Date object from ISO string
  if (isNaN(d.getTime())) return "";

  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatDateTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  const hh = d.getHours().toString().padStart(2, "0");
  const min = d.getMinutes().toString().padStart(2, "0");
  const ss = d.getSeconds().toString().padStart(2, "0");

  return `${day}-${month}-${year} ${hh}:${min}:${ss}`;
};

const formatDateForAPI = (date) => {
  if (!date) return null;
  // If it's a Date object, convert to YYYY-MM-DD using local time
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  // If it's already a string, assume it's correct or return as is
  return date;
};

export {
  currentDate,
  currentDateTime,
  formatDate,
  formatDateTime,
  formatDateForAPI,
};
