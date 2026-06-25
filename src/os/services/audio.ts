let ctx: AudioContext | null = null;

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  return ctx;
}

export const playBootSound = () => {
  try {
    const c = getCtx();
    const master = c.createGain();
    master.gain.value = 0.4;
    master.connect(c.destination);

    // Deep bass swell
    const osc1 = c.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(110, c.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(110, c.currentTime + 2);
    
    // Harmonious fifth
    const osc2 = c.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(165, c.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(165, c.currentTime + 2);

    // Bright chime
    const osc3 = c.createOscillator();
    osc3.type = "triangle";
    osc3.frequency.setValueAtTime(880, c.currentTime);
    osc3.frequency.exponentialRampToValueAtTime(440, c.currentTime + 1.5);

    const gain1 = c.createGain();
    gain1.gain.setValueAtTime(0, c.currentTime);
    gain1.gain.linearRampToValueAtTime(0.5, c.currentTime + 0.8);
    gain1.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 4);

    const gain3 = c.createGain();
    gain3.gain.setValueAtTime(0, c.currentTime);
    gain3.gain.linearRampToValueAtTime(0.1, c.currentTime + 0.1);
    gain3.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 2);

    osc1.connect(gain1);
    osc2.connect(gain1);
    osc3.connect(gain3);
    gain1.connect(master);
    gain3.connect(master);

    osc1.start(); osc1.stop(c.currentTime + 4);
    osc2.start(); osc2.stop(c.currentTime + 4);
    osc3.start(); osc3.stop(c.currentTime + 2);
  } catch (e) {
    console.error("Audio failed", e);
  }
};

export const playClickSound = () => {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, c.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.05);
  } catch (e) {}
};

export const playNotifSound = () => {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, c.currentTime);
    osc.frequency.setValueAtTime(554.37, c.currentTime + 0.1); // C#
    osc.frequency.setValueAtTime(659.25, c.currentTime + 0.2); // E
    
    gain.gain.setValueAtTime(0, c.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, c.currentTime + 0.05);
    gain.gain.setValueAtTime(0.2, c.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.8);
    
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.8);
  } catch (e) {}
};
