import { supabase } from "@/lib/supabase";
import { formatDateDisplay } from "@/lib/roster-utils";
import { getSubmittedSchoolIdsForActiveCycle } from "@/lib/submissions";

export type ExportRow = {
  schoolName: string;
  schoolCode: string;
  class: number;
  firstName: string;
  lastName: string;
  middleName: string;
  uniqueStudentId: string;
  dateOfBirth: string;
  gender: string;
  grade: number;
};

const CSV_HEADERS = [
  "School/Building",
  "School/Building Code",
  "Class",
  "First Name",
  "Last Name",
  "Middle Name",
  "Unique Student ID",
  "Date of Birth",
  "Gender",
  "Grade",
] as const;

function escapeCsvValue(value: string): string {
  const s = String(value ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function rowToCsvLine(row: ExportRow): string {
  return CSV_HEADERS.map((_, i) => {
    const key = [
      "schoolName",
      "schoolCode",
      "class",
      "firstName",
      "lastName",
      "middleName",
      "uniqueStudentId",
      "dateOfBirth",
      "gender",
      "grade",
    ][i] as keyof ExportRow;
    const val = row[key];
    return escapeCsvValue(key === "class" || key === "grade" ? String(val) : (val as string));
  }).join(",");
}

export function buildCsv(rows: ExportRow[]): string {
  const headerLine = CSV_HEADERS.join(",");
  const dataLines = rows.map(rowToCsvLine);
  return [headerLine, ...dataLines].join("\r\n");
}

type SchoolRow = { name: string; code: string | null };

type StudentWithSchool = {
  first_name: string;
  last_name: string;
  student_id: string;
  date_of_birth: string;
  gender: string;
  grade: number;
  school: SchoolRow | SchoolRow[] | null;
};

export async function getExportRows(limit?: number): Promise<ExportRow[]> {
  const ids = await getSubmittedSchoolIdsForActiveCycle();
  if (ids.length === 0) return [];

  let query = supabase
    .from("students")
    .select("first_name, last_name, student_id, date_of_birth, gender, grade, school:schools(name, code)")
    .eq("active", true)
    .in("school_id", ids)
    .order("school_id")
    .order("last_name")
    .order("first_name");

  if (typeof limit === "number" && limit > 0) {
    query = query.limit(limit);
  }

  const { data } = await query;
  const rows = (data ?? []) as StudentWithSchool[];

  return rows
    .filter((r) => r.school != null)
    .map((r) => {
      const school = Array.isArray(r.school) ? r.school[0] : r.school;
      if (!school) return null;
      return {
        schoolName: school.name ?? "",
        schoolCode: school.code ?? "",
        class: r.grade,
        firstName: r.first_name ?? "",
        lastName: r.last_name ?? "",
        middleName: "",
        uniqueStudentId: r.student_id ?? "",
        dateOfBirth: formatDateDisplay(r.date_of_birth),
        gender: r.gender ?? "",
        grade: r.grade,
      };
    })
    .filter((row): row is ExportRow => row != null);
}

export async function getExportCount(): Promise<{ studentCount: number; schoolCount: number }> {
  const ids = await getSubmittedSchoolIdsForActiveCycle();
  if (ids.length === 0) return { studentCount: 0, schoolCount: 0 };
  const { count } = await supabase
    .from("students")
    .select("id", { count: "exact", head: true })
    .eq("active", true)
    .in("school_id", ids);
  return { studentCount: count ?? 0, schoolCount: ids.length };
}
