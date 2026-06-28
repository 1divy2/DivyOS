import { useEffect, useState } from "react";
import { getVisitors, VisitorRecord } from "../services/backend";

export function AdminDashboardApp() {
  const [visitors, setVisitors] = useState<VisitorRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getVisitors();
      setVisitors(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="h-full flex flex-col font-mono text-[13px] bg-os-bg text-os-text overflow-hidden">
      <div className="h-14 border-b border-os-hairline flex items-center px-6 shrink-0 bg-os-panel-2 justify-between">
        <div className="flex items-center gap-3">
          <span className="text-os-signal font-bold tracking-widest uppercase">Admin / Security</span>
        </div>
        <div className="text-[11px] text-os-text-faint uppercase tracking-wider">
          Total Captured: {visitors.length}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div>
          <div className="text-os-text-faint text-[11px] uppercase tracking-widest mb-3">Visitor Log</div>
          <div className="border border-os-hairline rounded-lg overflow-hidden bg-white/5">
            <div className="grid grid-cols-[1fr_2fr_2fr] gap-4 p-3 border-b border-os-hairline bg-black/20 text-[11px] text-os-text-faint uppercase tracking-wider">
              <span>Name</span>
              <span>Email</span>
              <span>Time of Access</span>
            </div>
            
            {loading ? (
              <div className="p-6 text-center text-os-text-faint animate-pulse">Loading secure records...</div>
            ) : visitors.length === 0 ? (
              <div className="p-6 text-center text-os-text-faint">No visitors recorded yet.</div>
            ) : (
              <div className="divide-y divide-os-hairline">
                {visitors.map(v => {
                  const date = new Date(v.timestamp);
                  return (
                    <div key={v.id} className="grid grid-cols-[1fr_2fr_2fr] gap-4 p-3 text-[12px] hover:bg-white/5 transition-colors">
                      <span className="font-semibold">{v.name}</span>
                      <span className="text-os-iris truncate" title={v.email}>{v.email}</span>
                      <span className="text-os-text-dim truncate">{date.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
