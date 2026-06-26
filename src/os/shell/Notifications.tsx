import { useEffect } from "react";
import { useNotifications, type Notification } from "../services/notifications";
import { useOS, LAYOUT } from "../store";
import { motion, AnimatePresence } from "motion/react";

const LEVEL_DOT: Record<Notification["level"], string> = {
  info: "text-os-text-dim",
  success: "text-emerald-400",
  warn: "text-amber-400",
  error: "text-red-400",
};

export function NotificationToasts() {
  const items = useNotifications((s) => s.items);
  const dismiss = useNotifications((s) => s.dismiss);
  const centerOpen = useNotifications((s) => s.centerOpen);
  const visible = items.filter((i) => !i.read).slice(0, 4);

  // auto-dismiss by ttl
  useEffect(() => {
    const timers = visible
      .filter((i) => i.ttl && i.ttl > 0)
      .map((i) => setTimeout(() => useNotifications.getState().markRead(i.id), i.ttl));
    return () => timers.forEach(clearTimeout);
  }, [visible]);

  if (centerOpen) return null;

  const active = visible[0];

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] pointer-events-none flex flex-col items-center">
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ width: 140, height: 32, opacity: 0, y: -20, borderRadius: 16 }}
            animate={{ width: 340, height: active.body ? 80 : 50, opacity: 1, y: 0, borderRadius: 24 }}
            exit={{ width: 140, height: 32, opacity: 0, y: -20, borderRadius: 16 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="pointer-events-auto bg-black text-white shadow-2xl overflow-hidden relative border border-white/10 backdrop-blur-xl"
            onClick={() => dismiss(active.id)}
            style={{ cursor: "pointer" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="absolute inset-0 flex flex-col justify-center px-5"
            >
              <div className="flex items-center gap-3">
                <span className={LEVEL_DOT[active.level]}>●</span>
                <span className="font-semibold text-sm tracking-tight">{active.title}</span>
              </div>
              {active.body && (
                <div className="text-white/60 text-xs mt-1 ml-5 pr-4 truncate">
                  {active.body}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function NotificationCenter() {
  const open = useNotifications((s) => s.centerOpen);
  const items = useNotifications((s) => s.items);
  const toggle = useNotifications((s) => s.toggleCenter);
  const clearAll = useNotifications((s) => s.clearAll);
  const markAllRead = useNotifications((s) => s.markAllRead);
  const dismiss = useNotifications((s) => s.dismiss);
  const openApp = useOS((s) => s.open);

  if (!open) return null;

  return (
    <div className="fixed top-8 right-0 bottom-0 z-[85] w-[340px] bg-os-panel border-l border-os-hairline flex flex-col animate-[notif-slide_220ms_ease-out]">
      <div className="h-9 px-3 flex items-center border-b border-os-hairline text-[11px] uppercase tracking-wider text-os-text-faint">
        <span>notifications</span>
        <span className="flex-1" />
        <button onClick={markAllRead} className="hover:text-os-signal mr-3">mark read</button>
        <button onClick={clearAll} className="hover:text-os-error mr-3">clear</button>
        <button onClick={() => toggle(false)} aria-label="close" className="hover:text-os-text">×</button>
      </div>
      <div className="flex-1 overflow-auto">
        {items.length === 0 ? (
          <div className="p-8 text-center text-os-text-faint text-[12px]">no notifications.</div>
        ) : (
          items.map((n) => (
            <div key={n.id} className="px-3 py-2 border-b border-os-hairline text-[12px] hover:bg-os-panel-2">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={LEVEL_DOT[n.level]}>●</span>
                <span className="text-os-text-faint text-[10px] uppercase tracking-wider">{n.source}</span>
                <span className="flex-1" />
                <span className="text-os-text-faint text-[10px]">
                  {timeAgo(n.createdAt)}
                </span>
                <button onClick={() => dismiss(n.id)} className="text-os-text-faint hover:text-os-error ml-2">×</button>
              </div>
              <div className="text-os-text">{n.title}</div>
              {n.body && <div className="text-os-text-dim leading-snug">{n.body}</div>}
              {n.action?.appId && (
                <button
                  onClick={() => openApp(n.action!.appId!, { payload: n.action!.payload })}
                  className="mt-1 text-os-signal hover:underline"
                >
                  {n.action.label} →
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}
