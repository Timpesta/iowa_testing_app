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

  const state = mode === "add" ? addState : editState;
  const formAction = mode === "add" ? addAction : editAction;

  if (state?.success) {
    if (mode === "add") {
      router.push("/school/roster");
      router.refresh();
    } else {
      router.push("/school/roster");
      router.refresh();
    }
    return (
      <p className="text-green-600 text-sm">
        {mode === "add" ? "Student added." : "Student updated."} Redirecting…
      </p>
    );
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
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-5 max-w-md">
      {(state && !state.success) && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm"
        >
          {state.message}
        </div>
      )}
      {fieldError && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm"
        >
          {fieldError}
        </div>
      )}

      {mode === "edit" && initial && (
        <>
          <input type="hidden" name="student_id" value={studentId} />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Student ID
            </label>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-slate-700">
              {initial.student_id}
            </div>
            <p className="mt-0.5 text-xs text-slate-500">Student ID cannot be changed.</p>
          </div>
        </>
      )}

      <div>
        <label htmlFor="first_name" className="block text-sm font-medium text-slate-700 mb-1">
          First name
        </label>
        <input
          id="first_name"
          name="first_name"
          type="text"
          required
          defaultValue={initial?.first_name}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label htmlFor="last_name" className="block text-sm font-medium text-slate-700 mb-1">
          Last name
        </label>
        <input
          id="last_name"
          name="last_name"
          type="text"
          required
          defaultValue={initial?.last_name}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div>
        <label htmlFor="date_of_birth" className="block text-sm font-medium text-slate-700 mb-1">
          Date of birth
        </label>
        <input
          id="date_of_birth"
          name="date_of_birth"
          type="text"
          required
          defaultValue={initial?.date_of_birth}
          placeholder="MM/DD/YYYY"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
        <p className="mt-1 text-xs text-slate-500">
          Format: MM/DD/YYYY (e.g. 03/15/2010). Month and day can be 1 or 2 digits.
        </p>
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-1">
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          required
          defaultValue={initial?.gender ?? ""}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        >
          <option value="">Select…</option>
          {genderOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="grade" className="block text-sm font-medium text-slate-700 mb-1">
          Grade
        </label>
        <select
          id="grade"
          name="grade"
          required
          defaultValue={initial?.grade ?? ""}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        >
          <option value="">Select…</option>
          {gradeOptions.map((g) => (
            <option key={g} value={g}>
              Grade {g}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-white font-medium hover:bg-slate-800"
        >
          {mode === "add" ? "Add student" : "Save changes"}
        </button>
        <a
          href="/school/roster"
          className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 font-medium hover:bg-slate-50"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
