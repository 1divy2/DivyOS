import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;

export function PongApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let p1Y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
    let p2Y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
    let ballX = CANVAS_WIDTH / 2;
    let ballY = CANVAS_HEIGHT / 2;
    let ballVX = 5;
    let ballVY = 5;

    let upPressed = false;
    let downPressed = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") upPressed = true;
      else if (e.key === "ArrowDown") downPressed = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") upPressed = false;
      else if (e.key === "ArrowDown") downPressed = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    let animationId: number;

    const update = () => {
      // Player paddle
      if (upPressed && p1Y > 0) p1Y -= 7;
      if (downPressed && p1Y < CANVAS_HEIGHT - PADDLE_HEIGHT) p1Y += 7;

      // AI paddle
      const p2Center = p2Y + PADDLE_HEIGHT / 2;
      if (p2Center < ballY - 10) p2Y += 4;
      else if (p2Center > ballY + 10) p2Y -= 4;

      // Ball movement
      ballX += ballVX;
      ballY += ballVY;

      // Top/Bottom collisions
      if (ballY <= 0 || ballY + BALL_SIZE >= CANVAS_HEIGHT) {
        ballVY = -ballVY;
      }

      // Paddle collisions
      if (
        ballX <= PADDLE_WIDTH + 10 &&
        ballY + BALL_SIZE >= p1Y &&
        ballY <= p1Y + PADDLE_HEIGHT
      ) {
        ballVX = -ballVX;
        ballX = PADDLE_WIDTH + 10;
        ballVY += (Math.random() - 0.5) * 2;
      }

      if (
        ballX + BALL_SIZE >= CANVAS_WIDTH - PADDLE_WIDTH - 10 &&
        ballY + BALL_SIZE >= p2Y &&
        ballY <= p2Y + PADDLE_HEIGHT
      ) {
        ballVX = -ballVX;
        ballX = CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE - 10;
        ballVY += (Math.random() - 0.5) * 2;
      }

      // Scoring
      if (ballX < 0) {
        setScore((s) => ({ ...s, p2: s.p2 + 1 }));
        ballX = CANVAS_WIDTH / 2;
        ballY = CANVAS_HEIGHT / 2;
        ballVX = -5;
        ballVY = 5 * (Math.random() > 0.5 ? 1 : -1);
      } else if (ballX > CANVAS_WIDTH) {
        setScore((s) => ({ ...s, p1: s.p1 + 1 }));
        ballX = CANVAS_WIDTH / 2;
        ballY = CANVAS_HEIGHT / 2;
        ballVX = 5;
        ballVY = 5 * (Math.random() > 0.5 ? 1 : -1);
      }
    };

    const draw = () => {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = "#fff";
      // P1
      ctx.fillRect(10, p1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
      // P2
      ctx.fillRect(CANVAS_WIDTH - 20, p2Y, PADDLE_WIDTH, PADDLE_HEIGHT);
      // Ball
      ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

      // Net
      for (let i = 0; i < CANVAS_HEIGHT; i += 20) {
        ctx.fillRect(CANVAS_WIDTH / 2 - 1, i, 2, 10);
      }
    };

    const loop = () => {
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
    <div className="h-full flex flex-col items-center justify-center bg-neutral-900 font-mono text-white select-none">
      <div className="flex gap-20 text-4xl mb-6 font-bold tracking-widest text-white/50">
        <span>{score.p1}</span>
        <span>{score.p2}</span>
      </div>
      <div className="relative border-4 border-white/10 rounded-lg overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="bg-black"
        />
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
            <h1 className="text-5xl font-black mb-2 tracking-tighter text-white">PONG</h1>
            <p className="text-white/60 mb-8 text-sm uppercase tracking-widest">First to 11 wins</p>
            <button
              onClick={() => { setScore({ p1: 0, p2: 0 }); setIsPlaying(true); }}
              className="px-6 py-3 bg-white text-black rounded font-bold hover:scale-105 active:scale-95 transition-transform"
            >
              PLAY
            </button>
            <p className="mt-8 text-xs text-white/40">Use UP and DOWN arrows to move</p>
          </div>
        )}
      </div>
    </div>
  );
}
