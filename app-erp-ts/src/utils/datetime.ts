export const currentDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const currentDateTime = (): string => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = (now.getMonth() + 1).toString().padStart(2, "0");
  const dd = now.getDate().toString().padStart(2, "0");
  const hh = now.getHours().toString().padStart(2, "0");
  const min = now.getMinutes().toString().padStart(2, "0");
  const ss = now.getSeconds().toString().padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

export const formatDate = (date: any): string => {
  if (!date) return "";
  let d: Date;
  if (typeof date === "string") {
    if (date.includes("T")) {
      d = new Date(date);
    } else {
      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    }
  } else if (date instanceof Date) {
    d = date;
  } else {
    return "";
  }

  if (isNaN(d.getTime())) return "";

  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formatDateTime = (date: any): string => {
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

export const formatDateForAPI = (date: any): string | null => {
  if (!date) return null;

  let d: Date;
  if (typeof date === "string" && date.includes("T")) {
    d = new Date(date);
  } else if (date instanceof Date) {
    d = date;
  } else {
    return date;
  }

  if (isNaN(d.getTime())) return date;

  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDateTimeForAPI = (date: any): string => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  const hh = d.getHours().toString().padStart(2, "0");
  const min = d.getMinutes().toString().padStart(2, "0");
  const ss = d.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hh}:${min}:${ss}`;
};

export function isValid24HourTime(time: string): boolean {
  const regex = /^(?:[0-1]\d|2\d):[0-5]\d:[0-5]\d$/;
  return regex.test(time);
}

export const formatMinutesToHHMM = (minutes: number | null): string => {
  if (minutes == null) return "00:00";

  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const paddedHrs = String(hrs).padStart(2, "0");
  const paddedMins = String(mins).padStart(2, "0");

  return `${paddedHrs}:${paddedMins}`;
};

export const noOfDays = (fromdate: any, todate: any): number | null => {
  if (!fromdate || !todate) return null;

  const start = new Date(fromdate);
  const end = new Date(todate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  const diffTime = end.getTime() - start.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return Math.floor(diffDays) + 1;
};

export function getCurrentYear(): number {
  return new Date().getFullYear();
}
