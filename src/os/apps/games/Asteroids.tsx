import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;

type Entity = { x: number; y: number; vx: number; vy: number; radius: number; angle: number };
type Asteroid = Entity & { vertices: number[]; type: 1 | 2 | 3 };
type Bullet = { x: number; y: number; vx: number; vy: number; life: number };

export function AsteroidsApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let currentScore = 0;
    
    const ship = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      vx: 0,
      vy: 0,
      angle: -Math.PI / 2,
      radius: 12
    };

    let bullets: Bullet[] = [];
    let asteroids: Asteroid[] = [];

    const keys = { w: false, a: false, d: false, space: false };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "ArrowUp") keys.w = true;
      if (e.key === "a" || e.key === "ArrowLeft") keys.a = true;
      if (e.key === "d" || e.key === "ArrowRight") keys.d = true;
      if (e.key === " ") {
        if (!keys.space) {
          bullets.push({
            x: ship.x + Math.cos(ship.angle) * ship.radius,
            y: ship.y + Math.sin(ship.angle) * ship.radius,
            vx: Math.cos(ship.angle) * 8,
            vy: Math.sin(ship.angle) * 8,
            life: 60
          });
        }
        keys.space = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "ArrowUp") keys.w = false;
      if (e.key === "a" || e.key === "ArrowLeft") keys.a = false;
      if (e.key === "d" || e.key === "ArrowRight") keys.d = false;
      if (e.key === " ") keys.space = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const createAsteroid = (x: number, y: number, type: 1|2|3) => {
      const radius = type === 3 ? 30 : type === 2 ? 20 : 10;
      const vertices = [];
      const numVerts = 8 + Math.floor(Math.random() * 4);
      for (let i = 0; i < numVerts; i++) {
        vertices.push(radius * (0.8 + Math.random() * 0.4));
      }
      return {
        x, y,
        vx: (Math.random() - 0.5) * (4 - type),
        vy: (Math.random() - 0.5) * (4 - type),
        radius,
        angle: Math.random() * Math.PI * 2,
        vertices,
        type
      };
    };

    // Initial asteroids
    for (let i = 0; i < 4; i++) {
      asteroids.push(createAsteroid(Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT, 3));
    }

    let animationId: number;

    const wrap = (entity: {x: number; y: number}) => {
      if (entity.x < 0) entity.x = CANVAS_WIDTH;
      if (entity.x > CANVAS_WIDTH) entity.x = 0;
      if (entity.y < 0) entity.y = CANVAS_HEIGHT;
      if (entity.y > CANVAS_HEIGHT) entity.y = 0;
    };

    const update = () => {
      if (keys.a) ship.angle -= 0.1;
      if (keys.d) ship.angle += 0.1;
      if (keys.w) {
        ship.vx += Math.cos(ship.angle) * 0.2;
        ship.vy += Math.sin(ship.angle) * 0.2;
      }
      ship.vx *= 0.99;
      ship.vy *= 0.99;
      ship.x += ship.vx;
      ship.y += ship.vy;
      wrap(ship);

      // Bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx;
        b.y += b.vy;
        b.life--;
        wrap(b);
        if (b.life <= 0) bullets.splice(i, 1);
      }

      // Asteroids
      for (let i = asteroids.length - 1; i >= 0; i--) {
        const a = asteroids[i];
        a.x += a.vx;
        a.y += a.vy;
        a.angle += 0.02;
        wrap(a);

        // Collision with ship
        const distSq = (ship.x - a.x) ** 2 + (ship.y - a.y) ** 2;
        if (distSq < (ship.radius + a.radius) ** 2) {
          setGameOver(true);
          setIsPlaying(false);
        }

        // Collision with bullets
        for (let j = bullets.length - 1; j >= 0; j--) {
          const b = bullets[j];
          const bDistSq = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
          if (bDistSq < a.radius ** 2) {
            bullets.splice(j, 1);
            asteroids.splice(i, 1);
            currentScore += (4 - a.type) * 100;
            setScore(currentScore);
            
            if (a.type > 1) {
              asteroids.push(createAsteroid(a.x, a.y, (a.type - 1) as 1|2));
              asteroids.push(createAsteroid(a.x, a.y, (a.type - 1) as 1|2));
            }
            break;
          }
        }
      }
      
      if (asteroids.length === 0) {
        for (let i = 0; i < 4 + currentScore/1000; i++) {
          asteroids.push(createAsteroid(Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT, 3));
        }
      }
    };

    const draw = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;

      // Draw Ship
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.angle);
      ctx.beginPath();
      ctx.moveTo(ship.radius, 0);
      ctx.lineTo(-ship.radius, ship.radius * 0.7);
      ctx.lineTo(-ship.radius * 0.5, 0);
      ctx.lineTo(-ship.radius, -ship.radius * 0.7);
      ctx.closePath();
      ctx.stroke();
      if (keys.w && Math.random() > 0.3) {
        ctx.beginPath();
        ctx.moveTo(-ship.radius * 0.6, 0);
        ctx.lineTo(-ship.radius * 1.5, ship.radius * 0.3);
        ctx.lineTo(-ship.radius * 1.5, -ship.radius * 0.3);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();

      // Draw Bullets
      ctx.fillStyle = "#fff";
      for (const b of bullets) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Asteroids
      for (const a of asteroids) {
        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.angle);
        ctx.beginPath();
        for (let i = 0; i < a.vertices.length; i++) {
          const angle = (i / a.vertices.length) * Math.PI * 2;
          const r = a.vertices[i];
          const vx = Math.cos(angle) * r;
          const vy = Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
    };

    const loop = () => {
      if (!isPlaying) return;
      update();
      draw();
      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-black font-mono text-white select-none relative">
      <div className="absolute top-6 left-8 text-2xl font-bold tracking-widest text-white z-10">
        {score}
      </div>
      <div className="relative border-4 border-white/20 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)]">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="bg-black"
        />
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
            <h1 className="text-5xl font-black mb-2 tracking-tighter text-white">
              {gameOver ? "GAME OVER" : "ASTEROIDS"}
            </h1>
            <p className="text-white/60 mb-8 text-sm uppercase tracking-widest">
              {gameOver ? `Final Score: ${score}` : "Space Survival"}
            </p>
            <button
              onClick={() => { setScore(0); setGameOver(false); setIsPlaying(true); }}
              className="px-6 py-3 bg-white text-black rounded font-bold hover:scale-105 active:scale-95 transition-transform"
            >
              {gameOver ? "RETRY" : "START"}
            </button>
            <p className="mt-8 text-xs text-white/40 max-w-[200px] leading-relaxed">
              Use W to thrust. A/D to rotate. SPACE to shoot.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
