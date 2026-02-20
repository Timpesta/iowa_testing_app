import { getActiveCycle, getCyclesHistory, formatCycleLabel } from "@/lib/cycles";
import { CyclesPageClient } from "@/components/admin/CyclesPageClient";

export default async function AdminCyclesPage() {
  const [activeCycle, history] = await Promise.all([
    getActiveCycle(),
    getCyclesHistory(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Cycles</h1>
      <CyclesPageClient
        activeCycle={activeCycle}
        history={history}
        currentYear={new Date().getFullYear()}
      />
    </div>
  );
}
