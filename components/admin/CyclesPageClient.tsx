"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Cycle } from "@/lib/cycles";
import { formatCycleLabel } from "@/lib/cycles";
import { startNewCycle } from "@/lib/actions/cycles";

type Props = {
  activeCycle: Cycle | null;
  history: Cycle[];
  currentYear: number;
};

export function CyclesPageClient({ activeCycle, history, currentYear }: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState<"fall" | "spring">("fall");
  const [year, setYear] = useState(currentYear);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isSpringToFall = type === "fall";
  const warningMessage = isSpringToFall
    ? "Grades will increment by 1. Grade 12 students will be marked inactive."
    : "No grade changes. Students carry over as-is.";

  async function handleConfirm() {
    setError(null);
    setSubmitting(true);
    const result = await startNewCycle(type, year);
    setSubmitting(false);
    if (result.success) {
      setShowModal(false);
      router.refresh();
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-medium text-slate-900 mb-2">Current cycle</h2>
        {activeCycle ? (
          <p className="text-2xl font-semibold text-slate-900">
            {formatCycleLabel(activeCycle)}
          </p>
        ) : (
          <p className="text-slate-500">No active cycle.</p>
        )}
        <button
          type="button"
          onClick={() => {
            setShowModal(true);
            setError(null);
            setYear(currentYear);
          }}
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-white text-sm font-medium hover:bg-slate-800"
        >
          Start new cycle
        </button>
      </div>

      <div>
        <h2 className="text-lg font-medium text-slate-900 mb-3">Past cycles</h2>
        {history.length === 0 ? (
          <p className="text-slate-500 text-sm">No past cycles.</p>
        ) : (
          <ul className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
            {history.map((c) => (
              <li key={c.id} className="px-4 py-3 text-slate-700">
                {formatCycleLabel(c)}
              </li>
            ))}
          </ul>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-cycle-title"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 id="new-cycle-title" className="text-xl font-semibold text-slate-900 mb-4">
              Start new cycle
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "fall" | "spring")}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                >
                  <option value="fall">Fall</option>
                  <option value="spring">Spring</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  min={2000}
                  max={2100}
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value, 10) || currentYear)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                />
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm">
                {warningMessage}
              </div>
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
                  {error}
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={submitting}
                className="rounded-lg bg-slate-900 px-4 py-2 text-white font-medium hover:bg-slate-800 disabled:opacity-50"
              >
                {submitting ? "Starting…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
