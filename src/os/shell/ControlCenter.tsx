import { useState } from "react";
import * as DM from "@radix-ui/react-dropdown-menu";
import { useSession } from "../services/session";
import { useWallpaper, WALLPAPERS, wallpaperLabel } from "../services/wallpaper";

export function ControlCenter() {
  const wp = useWallpaper();
  const session = useSession();

  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [airdrop, setAirdrop] = useState(true);
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume] = useState(60);

  return (
    <DM.Root>
      <DM.Trigger asChild>
        <button className="flex items-center gap-2.5 px-2 py-1 rounded-md hover:bg-white/10 transition outline-none">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="22" height="12" rx="2" ry="2"></rect><path d="M23 13v-2"></path><path d="M23 13H1"></path></svg>
        </button>
      </DM.Trigger>
      
      <DM.Portal>
        <DM.Content sideOffset={8} align="end" className="glass-strong rounded-2xl border border-white/10 p-3 w-72 z-[100] animate-in fade-in zoom-in-95 duration-200 text-os-ink shadow-2xl origin-top-right">
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Comm Toggles */}
            <div className="bg-os-panel-2/50 backdrop-blur-md border border-white/5 rounded-xl p-3 flex flex-col gap-3">
              <ToggleRow icon="wifi" active={wifi} onClick={() => setWifi(!wifi)} label="Wi-Fi" sub="Home Network" />
              <ToggleRow icon="bluetooth" active={bluetooth} onClick={() => setBluetooth(!bluetooth)} label="Bluetooth" sub="On" />
              <ToggleRow icon="airdrop" active={airdrop} onClick={() => setAirdrop(!airdrop)} label="AirDrop" sub="Everyone" />
            </div>
            
            <div className="flex flex-col gap-3">
              {/* Do Not Disturb */}
              <button className="bg-os-panel-2/50 backdrop-blur-md border border-white/5 rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-white/10 transition h-1/2 group">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/30 transition">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 11.5398 21.9689 11.087 21.9088 10.6433C21.4116 11.5312 20.4729 12.1429 19.3571 12.1429C17.7003 12.1429 16.3571 10.7998 16.3571 9.14286C16.3571 8.02709 16.9688 7.08836 17.8567 6.59118C17.413 6.53111 16.9602 6.5 16.5 6.5C10.9772 6.5 6.5 10.9772 6.5 16.5C6.5 16.5 12 22 12 22Z"/></svg>
                </div>
                <span className="font-medium text-xs">Focus</span>
              </button>
              
              {/* Lock */}
              <button onClick={session.lock} className="bg-os-panel-2/50 backdrop-blur-md border border-white/5 rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-white/10 transition h-1/2 group">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 group-hover:bg-red-500/30 transition">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <span className="font-medium text-xs">Lock</span>
              </button>
            </div>
          </div>

          {/* Sliders */}
          <div className="bg-os-panel-2/50 backdrop-blur-md border border-white/5 rounded-xl p-3 mb-3 flex flex-col gap-3">
            <div className="text-[10px] uppercase text-os-ink-faint font-semibold tracking-wider">Display</div>
            <div className="h-6 bg-black/40 rounded-full overflow-hidden flex items-center shadow-inner relative">
              <div className="absolute inset-y-0 left-0 bg-white/20" style={{ width: `${brightness}%` }} />
              <svg className="absolute left-2 text-os-ink-dim" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              <input type="range" min="0" max="100" value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            <div className="text-[10px] uppercase text-os-ink-faint font-semibold tracking-wider mt-1">Sound</div>
            <div className="h-6 bg-black/40 rounded-full overflow-hidden flex items-center shadow-inner relative">
              <div className="absolute inset-y-0 left-0 bg-white/20" style={{ width: `${volume}%` }} />
              <svg className="absolute left-2 text-os-ink-dim" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(Number(e.target.value))} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>

          {/* Media Player */}
          <div className="bg-os-panel-2/50 backdrop-blur-md border border-white/5 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md"></div>
              <div>
                <div className="text-xs font-semibold">Liquid Glass</div>
                <div className="text-[10px] text-os-ink-dim">DivyOS Audio</div>
              </div>
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </button>
          </div>

        </DM.Content>
      </DM.Portal>
    </DM.Root>
  );
}

function ToggleRow({ icon, active, onClick, label, sub }: { icon: string, active: boolean, onClick: () => void, label: string, sub: string }) {
  return (
    <div className="flex items-center gap-2 cursor-pointer group" onClick={onClick}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${active ? "bg-blue-500 text-white" : "bg-black/30 text-os-ink-dim"}`}>
        {icon === "wifi" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>}
        {icon === "bluetooth" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"></polyline></svg>}
        {icon === "airdrop" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>}
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] font-medium leading-none">{label}</span>
        <span className="text-[9px] text-os-ink-dim mt-0.5">{active ? sub : "Off"}</span>
      </div>
    </div>
  );
}
