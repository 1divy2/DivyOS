import { useState, useRef, useEffect } from "react";

const STATIONS = [
  { title: "Lofi Hip Hop Radio", artist: "Lofi Girl", url: "https://play.streamafrica.net/lofiradio" },
  { title: "Groove Salad (Chill)", artist: "SomaFM", url: "https://ice2.somafm.com/groovesalad-128-mp3" },
  { title: "Drone Zone (Ambient)", artist: "SomaFM", url: "https://ice1.somafm.com/dronezone-128-mp3" },
  { title: "Underground 80s", artist: "SomaFM", url: "https://ice1.somafm.com/u80s-128-mp3" },
  { title: "Secret Agent", artist: "SomaFM", url: "https://ice1.somafm.com/secretagent-128-mp3" },
  { title: "Sonic Universe (Jazz)", artist: "SomaFM", url: "https://ice1.somafm.com/sonicuniverse-128-mp3" },
  { title: "Deep Space One", artist: "SomaFM", url: "https://ice1.somafm.com/deepspaceone-128-mp3" },
  { title: "Space Station Soma", artist: "SomaFM", url: "https://ice1.somafm.com/spacestation-128-mp3" },
  { title: "Indie Pop Rocks!", artist: "SomaFM", url: "https://ice1.somafm.com/indiepop-128-mp3" },
  { title: "Illinois Street Lounge", artist: "SomaFM", url: "https://ice1.somafm.com/illstreet-128-mp3" },
  { title: "DEF CON Radio", artist: "SomaFM", url: "https://ice1.somafm.com/defcon-128-mp3" },
  { title: "Dub Step Beyond", artist: "SomaFM", url: "https://ice1.somafm.com/dubstep-128-mp3" },
  { title: "Fluid", artist: "SomaFM", url: "https://ice1.somafm.com/fluid-128-mp3" },
];

export function MusicApp() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const station = STATIONS[i];

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(station.url);
      audioRef.current.volume = volume;
    } else {
      audioRef.current.src = station.url;
    }
    
    if (playing) {
      audioRef.current.play().catch(() => setPlaying(false));
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [i]);

  useEffect(() => {
    if (audioRef.current) {
      if (playing) audioRef.current.play().catch(() => setPlaying(false));
      else audioRef.current.pause();
    }
  }, [playing]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  return (
    <div className="h-full flex flex-col" style={{ background: "linear-gradient(180deg,#1A1226 0%,#0B0D12 100%)" }}>
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6 relative overflow-hidden">
        {/* Background ambient glow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-os-iris/20 rounded-full blur-[80px] transition-opacity duration-1000 ${playing ? 'opacity-100' : 'opacity-0'}`} />
        
        <div className={`w-48 h-48 rounded-full shadow-[0_20px_60px_-12px_rgba(232,155,174,0.4)] overflow-hidden relative flex items-center justify-center border-4 border-black/50 transition-transform duration-1000 ${playing ? '[animation:spin_10s_linear_infinite]' : ''}`} style={{ background: "linear-gradient(135deg, #E89BAE 0%, #A8B4FF 100%)" }}>
           <div className="w-12 h-12 bg-black/80 rounded-full absolute" />
           <div className="w-3 h-3 bg-os-iris/50 rounded-full absolute" />
           <div className="absolute inset-0 flex items-center justify-center text-white/40 mix-blend-overlay" style={{ fontFamily: "Fraunces, serif", fontSize: 120 }}>♪</div>
        </div>
        <div className="text-center z-10">
          <div className="text-os-ink text-[20px] font-medium tracking-tight">{station.title}</div>
          <div className="text-os-ink-dim text-[13px] mt-1">{station.artist}</div>
        </div>
        
        <div className="w-full max-w-xs z-10">
          <div className="text-[11px] text-os-ink-faint mb-2 text-center uppercase tracking-widest">{playing ? "LIVE BROADCAST" : "PAUSED"}</div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden relative">
            <div className={`absolute inset-y-0 left-0 bg-os-iris rounded-full transition-all duration-1000 w-full ${playing ? 'opacity-100 animate-[pulse_2s_ease-in-out_infinite]' : 'opacity-30'}`} />
          </div>
        </div>
        
        <div className="flex items-center gap-8 text-os-ink z-10">
          <button onClick={() => { setI((i - 1 + STATIONS.length) % STATIONS.length); setPlaying(true); }} className="text-2xl opacity-70 hover:opacity-100 transition-opacity">⏮</button>
          <button onClick={() => setPlaying(!playing)} className="w-16 h-16 rounded-full bg-os-ink text-black flex items-center justify-center text-2xl hover:scale-105 active:scale-95 transition-all shadow-lg">
            {playing ? "❚❚" : "▶"}
          </button>
          <button onClick={() => { setI((i + 1) % STATIONS.length); setPlaying(true); }} className="text-2xl opacity-70 hover:opacity-100 transition-opacity">⏭</button>
        </div>
        
        {/* Volume slider */}
        <div className="w-full max-w-xs z-10 flex items-center gap-3 text-os-ink-dim mt-2">
           <span className="text-sm">🔈</span>
           <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="flex-1 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full" />
           <span className="text-sm">🔊</span>
        </div>
      </div>
      <div className="border-t border-os-hairline p-3 max-h-48 overflow-auto bg-black/40 backdrop-blur-md">
        <div className="text-[10px] text-os-ink-faint uppercase tracking-wider mb-2 px-3">Radio Stations</div>
        {STATIONS.map((st, idx) => (
          <button key={idx} onClick={() => { setI(idx); setPlaying(true); }} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 text-[13px] transition-colors ${idx === i ? "bg-os-iris/20 text-os-ink border border-os-iris/30" : "text-os-ink-dim hover:bg-white/5 border border-transparent"}`}>
            <div className={`w-2 h-2 rounded-full ${idx === i && playing ? "bg-os-signal animate-pulse" : "bg-transparent"}`} />
            <div className="flex-1 flex flex-col">
              <span className="font-medium">{st.title}</span>
              <span className="text-[11px] text-os-ink-faint">{st.artist}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
