import { useEffect, useRef, useState } from "react";
import { useSession } from "../services/session";
import { useOS } from "../store";
import { identity } from "@/content/identity";
import { saveVisitor, sendWelcomeEmail } from "../services/backend";

export function Login() {
  const login = useSession((s) => s.login);
  const loginAdmin = useSession((s) => s.loginAdmin);
  const openApp = useOS((s) => s.open);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [now, setNow] = useState(() => new Date());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const submit = async () => {
    // Admin Backdoor
    if (name === "1divy2" && email === "3DBekDKZ@divyos") {
      loginAdmin();
      return;
    }

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!email.trim() || !email.includes("@gmail.com")) {
      setError("Please enter a valid Gmail address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await saveVisitor(name, email);
      // We don't await the email to avoid making them wait too long if EmailJS is slow
      sendWelcomeEmail(name, email);
      login(name);
      setTimeout(() => {
        const id = openApp("about", { title: "About", size: { w: 760, h: 640 } });
        useOS.getState().resize(id, 760, 640);
      }, 500);
    } catch (e) {
      setError("Failed to verify. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] bg-os-bg text-os-text font-mono flex flex-col items-center justify-center scanline"
      style={{ animation: "os-boot-fade 240ms ease both" }}
    >
      {/* watermark */}
      <div className="absolute top-6 left-6 text-[11px] uppercase tracking-[0.3em] text-os-text-faint">
        DivyOS · session
      </div>
      <div className="absolute top-6 right-6 text-[11px] text-os-text-faint tabular-nums">
        {now.toLocaleTimeString("en-GB")} · {now.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" })}
      </div>

      <div className="w-full max-w-md px-6">
        {/* avatar */}
        <div className="flex flex-col items-center mb-10 select-none">
          <div className="w-20 h-20 border border-os-hairline grid place-items-center text-os-signal text-3xl mb-4 bg-os-panel">
            {identity.handle.slice(0, 2).toUpperCase()}
          </div>
          <div className="text-os-text text-sm">{identity.name}</div>
          <div className="text-os-text-faint text-xs mt-0.5">{identity.handle}@divyos</div>
        </div>

        {/* prompt */}
        <div className="border border-os-hairline bg-os-panel/60">
          <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-os-text-faint border-b border-os-hairline flex items-center justify-between">
            <span>identify</span>
            <span className="text-os-signal">●</span>
          </div>
          
          <div className="px-3 py-3 flex items-center gap-2 border-b border-os-hairline">
            <span className="text-os-signal w-12">name:</span>
            <input
              ref={ref}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") document.getElementById("email-input")?.focus();
              }}
              placeholder="enter your name"
              className="flex-1 bg-transparent outline-none text-os-text placeholder:text-os-text-faint caret-os-signal"
              spellCheck={false}
              autoCapitalize="off"
              maxLength={24}
              disabled={loading}
            />
          </div>

          <div className="px-3 py-3 flex items-center gap-2">
            <span className="text-os-signal w-12">gmail:</span>
            <input
              id="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              placeholder="enter your @gmail.com"
              className="flex-1 bg-transparent outline-none text-os-text placeholder:text-os-text-faint caret-os-signal"
              spellCheck={false}
              autoCapitalize="off"
              type="email"
              disabled={loading}
            />
            {loading ? <span className="text-os-signal animate-pulse">...</span> : <span className="os-cursor" />}
          </div>
        </div>

        {error && (
          <div className="text-os-warn text-[11px] mt-2 text-center">
            {error}
          </div>
        )}

        <div className="flex justify-end items-center mt-3 text-[11px] text-os-text-faint">
          <button
            onClick={submit}
            disabled={loading}
            className="px-3 py-1 border border-os-hairline hover:border-os-signal hover:text-os-signal disabled:opacity-50"
          >
            {loading ? "verifying..." : "enter →"}
          </button>
        </div>

        <div className="mt-12 text-center text-[11px] text-os-text-faint">
          DivyOS 1.0 · cortex · build {useSession.getState().bootCount}
        </div>
      </div>
    </div>
  );
}
