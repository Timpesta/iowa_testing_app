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
      <p className="text-slate-500 text-sm mb-6">
        No active cycle. Roster submission will be available when a cycle is started.
      </p>
    );
  }

  if (submittedAt) {
    return (
      <div className="mb-6 flex items-center gap-3">
        <span className="text-green-700 text-sm font-medium">
          Submitted on {formatSubmittedAt(submittedAt)}
        </span>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="rounded-lg bg-slate-900 px-4 py-2 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit roster"}
      </button>
      {message && (
        <p className={`mt-2 text-sm ${message.startsWith("Roster submitted") ? "text-green-700" : "text-amber-700"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
