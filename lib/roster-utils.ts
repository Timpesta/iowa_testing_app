const GRADE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const GENDER_MAP = { M: "Male", F: "Female", U: "Unspecified" } as const;

/** Parse MM/DD/YYYY or MM-DD-YYYY to ISO date (YYYY-MM-DD), or return null. */
export function parseDateInput(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parts = trimmed.split(/[/-]/).map((p) => p.trim());
  if (parts.length !== 3) return null;
  const [a, b, c] = parts;
  let month: string, day: string, year: string;
  if (a.length <= 2 && b.length <= 2 && c.length === 4) {
    month = a.padStart(2, "0");
    day = b.padStart(2, "0");
    year = c;
  } else return null;
  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);
  const yearNum = parseInt(year, 10);
  if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31 || yearNum < 1900 || yearNum > 2100) return null;
  return `${year}-${month}-${day}`;
}

/** Format ISO date (YYYY-MM-DD) to MM/DD/YYYY for display. */
export function formatDateDisplay(iso: string): string {
  if (!iso || iso.length < 10) return iso;
  const [y, m, d] = iso.split("T")[0].split("-");
  return `${m}/${d}/${y}`;
}

/** Format timestamp for display: e.g. "1/15/2025" */
export function formatSubmittedAt(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

export function getGradeOptions() {
  return GRADE_OPTIONS;
}

export function getGenderOptions(): { value: "M" | "F" | "U"; label: string }[] {
  return (Object.entries(GENDER_MAP) as [keyof typeof GENDER_MAP, string][]).map(([value, label]) => ({ value, label }));
}
