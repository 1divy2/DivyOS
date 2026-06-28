import { useEffect, useState } from "react";
import { getVisitors, VisitorRecord } from "../services/backend";
import { useSession } from "../services/session";
import { LogOut, ShieldAlert, Activity, Users } from "lucide-react";

export function AdminDashboardFullScreen() {
  const [visitors, setVisitors] = useState<VisitorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const logout = useSession((s) => s.logout);

  useEffect(() => {
    async function load() {
      const data = await getVisitors();
      setVisitors(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] text-zinc-300 font-mono overflow-hidden flex flex-col">
      {/* Top Navigation */}
      <div className="h-16 border-b border-zinc-800 bg-[#0a0a0a]/80 backdrop-blur-xl flex items-center px-8 shrink-0 justify-between">
        <div className="flex items-center gap-4">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          <span className="text-zinc-100 font-bold tracking-widest uppercase">Admin / Security Mainframe</span>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>TERMINATE SESSION</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex flex-col">
              <div className="flex items-center gap-3 text-zinc-500 mb-4 uppercase text-xs tracking-wider">
                <Users className="w-4 h-4" />
                <span>Total Captured Visitors</span>
              </div>
              <div className="text-4xl font-light text-white">{visitors.length}</div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex flex-col">
              <div className="flex items-center gap-3 text-zinc-500 mb-4 uppercase text-xs tracking-wider">
                <Activity className="w-4 h-4" />
                <span>Database Status</span>
              </div>
              <div className="text-lg font-medium text-green-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                ONLINE (FIRESTORE)
              </div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex flex-col">
              <div className="flex items-center gap-3 text-zinc-500 mb-4 uppercase text-xs tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Auto-Responder</span>
              </div>
              <div className="text-lg font-medium text-blue-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                ACTIVE (EMAILJS)
              </div>
            </div>
          </div>

          {/* Log Table */}
          <div>
            <div className="text-zinc-500 text-xs uppercase tracking-widest mb-4">Global Visitor Log</div>
            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30">
              <div className="grid grid-cols-[1fr_2fr_2fr] gap-4 p-4 border-b border-zinc-800 bg-zinc-950/50 text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                <span>Name</span>
                <span>Email Address</span>
                <span>Timestamp of Access</span>
              </div>
              
              {loading ? (
                <div className="p-12 text-center text-zinc-500 animate-pulse">Decrypting and loading secure records...</div>
              ) : visitors.length === 0 ? (
                <div className="p-12 text-center text-zinc-500">No visitors recorded in the database yet.</div>
              ) : (
                <div className="divide-y divide-zinc-800/50">
                  {visitors.map(v => {
                    const date = new Date(v.timestamp);
                    return (
                      <div key={v.id} className="grid grid-cols-[1fr_2fr_2fr] gap-4 p-4 text-sm hover:bg-zinc-800/30 transition-colors">
                        <span className="font-medium text-zinc-200">{v.name}</span>
                        <span className="text-blue-400 truncate" title={v.email}>{v.email}</span>
                        <span className="text-zinc-500 truncate">{date.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
