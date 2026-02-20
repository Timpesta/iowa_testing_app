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

type Step = "configure" | "confirm";

export function CyclesPageClient({ activeCycle, history, currentYear }: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<Step>("configure");
  const [type, setType] = useState<"fall" | "spring">("fall");
  const [year, setYear] = useState(currentYear);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isFall = type === "fall";

  const warningMessage = isFall
    ? "Starting a Fall cycle will increment every active student's grade by 1, and mark all Grade 12 students as inactive."
    : "Starting a Spring cycle carries students over as-is — no grade changes.";

  function openModal() {
    setShowModal(true);
    setStep("configure");
    setError(null);
    setYear(currentYear);
    setType("fall");
  }

  function closeModal() {
    setShowModal(false);
    setStep("configure");
    setError(null);
  }

  async function handleConfirm() {
    setError(null);
    setSubmitting(true);
    try {
      const result = await startNewCycle(type, year);
      if (result.success) {
        closeModal();
        router.refresh();
      } else {
        setError(result.message ?? "Something went wrong. Please try again.");
        setStep("configure");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setStep("configure");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-navy-800 focus:outline-none focus:ring-1 focus:ring-navy-800";

  return (
    <div className="space-y-8">
      {/* Current cycle card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Current cycle
        </h2>
        {activeCycle ? (
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-navy-800">{formatCycleLabel(activeCycle)}</p>
            <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              Active
            </span>
          </div>
        ) : (
          <p className="text-slate-400 text-sm mb-1">No active cycle. Start one below.</p>
        )}
        <button
          type="button"
          onClick={openModal}
          className="mt-4 rounded-lg bg-navy-800 px-4 py-2 text-white text-sm font-semibold hover:bg-navy-900 transition-colors"
        >
          Start new cycle
        </button>
      </div>

      {/* History */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Past cycles
        </h2>
        {history.length === 0 ? (
          <p className="text-slate-400 text-sm">No past cycles yet.</p>
        ) : (
          <ul className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {history.map((c) => (
              <li key={c.id} className="px-5 py-3 text-slate-600 text-sm">
                {formatCycleLabel(c)}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-cycle-title"
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            {step === "configure" ? (
              <>
                <h2 id="new-cycle-title" className="text-xl font-bold text-navy-800 mb-4">
                  Start new cycle
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-800 mb-1">Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as "fall" | "spring")}
                      className={inputClass}
                    >
                      <option value="fall">Fall</option>
                      <option value="spring">Spring</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-800 mb-1">Year</label>
                    <input
                      type="number"
                      min={2000}
                      max={2100}
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value, 10) || currentYear)}
                      className={inputClass}
                    />
                  </div>

                  <div
                    className={`rounded-lg border px-4 py-3 text-sm ${
                      isFall
                        ? "bg-amber-50 border-amber-200 text-amber-800"
                        : "bg-navy-50 border-navy-100 text-navy-800"
                    }`}
                  >
                    <p className="font-semibold mb-1">
                      {isFall ? "Grade changes will apply" : "No grade changes"}
                    </p>
                    <p>{warningMessage}</p>
                  </div>

                  {error && (
                    <div role="alert" className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
                      {error}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => { setError(null); setStep("confirm"); }}
                    className="rounded-lg bg-navy-800 px-4 py-2 text-white font-semibold hover:bg-navy-900 transition-colors"
                  >
                    Review &amp; confirm
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 id="new-cycle-title" className="text-xl font-bold text-navy-800 mb-1">
                  Confirm new cycle
                </h2>
                <p className="text-slate-500 text-sm mb-5">
                  Review before proceeding — this cannot be undone.
                </p>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-sm space-y-2 mb-5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">New cycle</span>
                    <span className="font-semibold text-navy-800 capitalize">{type} {year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Closes</span>
                    <span className="font-semibold text-navy-800">
                      {activeCycle ? formatCycleLabel(activeCycle) : "none"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Grade changes</span>
                    <span className="font-semibold text-navy-800">
                      {isFall ? "Yes — grades +1, grade 12 inactive" : "None"}
                    </span>
                  </div>
                </div>

                {isFall && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm mb-5">
                    <strong>Warning:</strong> All active students will have their grade
                    incremented. Grade 12 students will be marked inactive. This affects
                    every school.
                  </div>
                )}

                {error && (
                  <div role="alert" className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm mb-4">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setStep("configure")}
                    disabled={submitting}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={submitting}
                    className={`rounded-lg px-4 py-2 text-white font-semibold disabled:opacity-50 disabled:pointer-events-none transition-colors ${
                      isFall
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-navy-800 hover:bg-navy-900"
                    }`}
                  >
                    {submitting ? "Starting…" : `Start ${type} ${year}`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
