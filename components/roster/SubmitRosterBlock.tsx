"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitRoster } from "@/lib/actions/submit-roster";
import { formatSubmittedAt } from "@/lib/submissions";

type Props = {
  activeCycle: { type: string; year: number } | null;
  submittedAt: string | null;
};

export function SubmitRosterBlock({ activeCycle, submittedAt }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit() {
    if (!activeCycle) return;
    setSubmitting(true);
    setMessage(null);
    const result = await submitRoster();
    setSubmitting(false);
    if (result.success) {
      setMessage(result.message);
      router.refresh();
    } else {
      setMessage(result.message);
    }
  }

  if (!activeCycle) {
    return (
      <div className="mb-6 rounded-lg bg-slate-100 border border-slate-200 px-4 py-3 text-slate-500 text-sm">
        No active cycle. Roster submission will be available when a cycle is started.
      </div>
    );
  }

  if (submittedAt) {
    return (
      <div className="mb-6 inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
        <span className="text-green-600 text-sm">✓</span>
        <span className="text-green-700 text-sm font-medium">
          Submitted on {formatSubmittedAt(submittedAt)}
        </span>
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="rounded-lg bg-amber-500 px-4 py-2 text-white text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit roster"}
      </button>
      {message && (
        <span className={`text-sm ${message.startsWith("Roster submitted") ? "text-green-700" : "text-amber-700"}`}>
          {message}
        </span>
      )}
    </div>
  );
}
