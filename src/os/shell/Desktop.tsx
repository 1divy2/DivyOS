import { useEffect, useState } from "react";
import { useOS } from "../store";
import { useSession } from "../services/session";
import { useSettings } from "../settings";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { MobileShell } from "./MobileShell";
import { Boot } from "./Boot";
import { Launcher } from "./Launcher";
import { Login } from "./Login";
import { Lock } from "./Lock";
import { PowerOverlay } from "./PowerOverlay";
import { Wallpaper } from "./Wallpaper";
import { NotificationToasts, NotificationCenter } from "./Notifications";
import { ShortcutsLayer } from "./Shortcuts";
import { DesktopContextMenu } from "./DesktopContextMenu";
import { WindowLayer } from "../Window";
import { WidgetsLayer } from "./WidgetsLayer";
import { notify } from "../services/notifications";
import { AdminDashboardFullScreen } from "../apps/AdminDashboardFullScreen";

export function Desktop() {
  const phase = useSession((s) => s.phase);
  const windows = useOS((s) => s.windows);
  const open = useOS((s) => s.open);
  const visitor = useSession((s) => s.visitorName);
  const theme = useSettings((s) => s.theme);

  useEffect(() => {
    if (phase !== "desktop") return;
    const flag = `divyos:welcomed:${useSession.getState().sessionStartedAt}`;
    if (sessionStorage.getItem(flag)) return;
    sessionStorage.setItem(flag, "1");
    setTimeout(() => {
      notify({
        source: "system",
        level: "success",
        title: `Welcome, ${visitor ?? "guest"}`,
        body: "Press ⌘K to search · right-click anywhere for actions",
      });
    }, 600);
  }, [phase, visitor]);

  useEffect(() => {
    if (phase === "desktop") {
      const flag = `divyos:about_opened:${useSession.getState().sessionStartedAt}`;
      if (!sessionStorage.getItem(flag)) {
        sessionStorage.setItem(flag, "1");
        setTimeout(() => {
          open("about", { title: "About", size: { w: 620, h: 520 } });
        }, 500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const showDesktop = phase === "desktop" || phase === "locked" || phase === "admin_dashboard";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className={`fixed inset-0 overflow-hidden theme-${theme}`} style={{ background: "var(--os-bg)", color: "var(--os-ink)" }}>
      <Wallpaper />
      {showDesktop && (
        <DesktopContextMenu>
          <div className="absolute inset-0" inert={phase === "locked" ? true : undefined}>
            {phase === "admin_dashboard" ? (
              <AdminDashboardFullScreen />
            ) : isMobile ? (
              <>
                <MobileShell />
                <WindowLayer />
              </>
            ) : (
              <>
                <WidgetsLayer />
                <MenuBar />
                <WindowLayer />
                <Dock />
                <Launcher />
              </>
            )}
            <NotificationToasts />
            <NotificationCenter />
            <ShortcutsLayer />
          </div>
        </DesktopContextMenu>
      )}
      {phase === "boot" && <Boot />}
      {phase === "login" && <Login />}
      {phase === "locked" && <Lock />}
      <PowerOverlay />
    </div>
  );
}
