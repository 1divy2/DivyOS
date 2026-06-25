import { useEffect } from "react";
import { useNotifications, type Notification } from "../services/notifications";
import { useOS } from "../store";

const LEVEL_DOT: Record<Notification["level"], string> = {
  info: "text-os-text-dim",
  success: "text-os-signal",
  warn: "text-os-warn",
  error: "text-os-error",
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

  return (
    <div className="fixed top-10 right-3 z-[80] flex flex-col gap-2 w-[300px] pointer-events-none">
      {visible.map((n) => (
        <div
          key={n.id}
          className="pointer-events-auto bg-os-panel border border-os-hairline shadow-lg p-3 text-[12px] animate-[notif-in_220ms_ease-out]"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className={LEVEL_DOT[n.level]}>●</span>
            <span className="text-os-text-faint text-[10px] uppercase tracking-wider">{n.source}</span>
            <span className="flex-1" />
            <button
              aria-label="Dismiss"
              onClick={() => dismiss(n.id)}
              className="text-os-text-faint hover:text-os-error"
            >
              ×
            </button>
          </div>
          <div className="text-os-text">{n.title}</div>
          {n.body && <div className="text-os-text-dim mt-1 leading-snug">{n.body}</div>}
        </div>
      ))}
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
