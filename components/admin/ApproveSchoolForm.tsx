"use client";

import { useState } from "react";
import { approveSchool } from "@/lib/actions/admin";

const CODE_REGEX = /^[A-Z]{2,4}$/;

export function ApproveSchoolForm({
  schoolId,
  schoolName,
}: {
  schoolId: string;
  schoolName: string;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const normalized = code.trim().toUpperCase();
    if (!CODE_REGEX.test(normalized)) {
      setError("Code must be 2–4 uppercase letters.");
      return;
    }
    setSubmitting(true);
    const result = await approveSchool(schoolId, normalized);
    setSubmitting(false);
    if (result.success) {
      setSuccessMessage(result.message);
    } else {
      setError(result.message);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value.toUpperCase().slice(0, 4));
    setError(null);
  }

  if (successMessage) {
    return (
      <div className="space-y-4">
        <div
          role="status"
          className="rounded-lg bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm"
        >
          {successMessage}
        </div>
        <a
          href="/admin/schools?filter=pending"
          className="inline-block rounded-lg bg-navy-800 px-4 py-2 text-white font-semibold hover:bg-navy-900 transition-colors"
        >
          Back to schools
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm"
        >
          {error}
        </div>
      )}
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-navy-800 mb-1">
          School code
        </label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={handleChange}
          placeholder="e.g. AABQ"
          maxLength={4}
          autoComplete="off"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-mono text-slate-900 uppercase focus:border-navy-800 focus:outline-none focus:ring-1 focus:ring-navy-800"
        />
        <p className="mt-1 text-xs text-slate-400">
          2–4 uppercase letters, unique across all schools.
        </p>
      </div>
      <div className="flex gap-3 flex-wrap">
        <button
          type="submit"
          disabled={submitting || code.length < 2}
          className="rounded-lg bg-amber-500 px-5 py-2.5 text-white font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          {submitting ? "Saving…" : "Approve school"}
        </button>
        <a
          href="/admin/schools?filter=pending"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
