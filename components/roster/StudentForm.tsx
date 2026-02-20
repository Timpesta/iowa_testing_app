"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { addStudent, updateStudent } from "@/lib/actions/roster";
import { parseDateInput } from "@/lib/roster-utils";

type GenderOption = { value: "M" | "F" | "U"; label: string };

type Props = {
  gradeOptions: readonly number[] | number[];
  genderOptions: GenderOption[];
  mode: "add" | "edit";
  initial?: {
    student_id: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    grade: number;
  };
  studentId?: string;
};

export function StudentForm({
  gradeOptions,
  genderOptions,
  mode,
  initial,
  studentId,
}: Props) {
  const router = useRouter();
  const [addState, addAction] = useFormState(addStudent, null);
  const [editState, editAction] = useFormState(updateStudent, null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const state = mode === "add" ? addState : editState;
  const formAction = mode === "add" ? addAction : editAction;

  if (state?.success) {
    router.push("/school/roster");
    router.refresh();
    return (
      <p className="text-green-600 text-sm">
        {mode === "add" ? "Student added." : "Student updated."} Redirecting…
      </p>
    );
  }

  if (state && !state.success && pending) {
    setPending(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setFieldError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const dobInput = (formData.get("date_of_birth") as string)?.trim() ?? "";
    if (!parseDateInput(dobInput)) {
      setFieldError("Date of birth must be in format MM/DD/YYYY (e.g. 03/15/2010).");
      e.preventDefault();
      return;
    }
    setPending(true);
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:border-navy-800 focus:outline-none focus:ring-1 focus:ring-navy-800";

  const labelClass = "block text-sm font-medium text-navy-800 mb-1";

  const buttonLabel = pending
    ? mode === "add" ? "Adding…" : "Saving…"
    : mode === "add" ? "Add student" : "Save changes";

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-5 max-w-md">
      {state && !state.success && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
          {state.message}
        </div>
      )}
      {fieldError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
          {fieldError}
        </div>
      )}

      {mode === "edit" && initial && (
        <>
          <input type="hidden" name="student_id" value={studentId} />
          <div>
            <label className={labelClass}>Student ID</label>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-slate-600 text-sm">
              {initial.student_id}
            </div>
            <p className="mt-1 text-xs text-slate-400">Student ID cannot be changed.</p>
          </div>
        </>
      )}

      <div>
        <label htmlFor="first_name" className={labelClass}>First name</label>
        <input
          id="first_name"
          name="first_name"
          type="text"
          required
          defaultValue={initial?.first_name}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="last_name" className={labelClass}>Last name</label>
        <input
          id="last_name"
          name="last_name"
          type="text"
          required
          defaultValue={initial?.last_name}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="date_of_birth" className={labelClass}>Date of birth</label>
        <input
          id="date_of_birth"
          name="date_of_birth"
          type="text"
          required
          defaultValue={initial?.date_of_birth}
          placeholder="MM/DD/YYYY"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-slate-400">
          Format: MM/DD/YYYY (e.g. 03/15/2010). Month and day can be 1 or 2 digits.
        </p>
      </div>

      <div>
        <label htmlFor="gender" className={labelClass}>Gender</label>
        <select
          id="gender"
          name="gender"
          required
          defaultValue={initial?.gender ?? ""}
          className={inputClass}
        >
          <option value="">Select…</option>
          {genderOptions.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="grade" className={labelClass}>Grade</label>
        <select
          id="grade"
          name="grade"
          required
          defaultValue={initial?.grade ?? ""}
          className={inputClass}
        >
          <option value="">Select…</option>
          {gradeOptions.map((g) => (
            <option key={g} value={g}>Grade {g}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 flex-wrap pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-navy-800 px-5 py-2.5 text-white font-semibold hover:bg-navy-900 transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          {buttonLabel}
        </button>
        <a
          href="/school/roster"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
