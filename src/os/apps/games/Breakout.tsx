import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const BALL_SIZE = 10;
const BRICK_ROWS = 5;
const BRICK_COLS = 10;
const BRICK_WIDTH = 54;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 8;
const BRICK_OFFSET_TOP = 40;
const BRICK_OFFSET_LEFT = 15;

type Brick = { x: number; y: number; status: number; color: string };

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"];

export function BreakoutApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let ballX = CANVAS_WIDTH / 2;
    let ballY = CANVAS_HEIGHT - 30;
    let ballVX = 4;
    let ballVY = -4;
    let paddleX = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
    
    let currentScore = 0;

    let rightPressed = false;
    let leftPressed = false;

    // Initialize bricks
    const bricks: Brick[][] = [];
    for (let c = 0; c < BRICK_COLS; c++) {
      bricks[c] = [];
      for (let r = 0; r < BRICK_ROWS; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1, color: COLORS[r] };
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") rightPressed = true;
      else if (e.key === "ArrowLeft") leftPressed = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") rightPressed = false;
      else if (e.key === "ArrowLeft") leftPressed = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    let animationId: number;

    const collisionDetection = () => {
      for (let c = 0; c < BRICK_COLS; c++) {
        for (let r = 0; r < BRICK_ROWS; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (
              ballX > b.x &&
              ballX < b.x + BRICK_WIDTH &&
              ballY > b.y &&
              ballY < b.y + BRICK_HEIGHT
            ) {
              ballVY = -ballVY;
              b.status = 0;
              currentScore += 10;
              setScore(currentScore);
              if (currentScore === BRICK_ROWS * BRICK_COLS * 10) {
                setWon(true);
                setIsPlaying(false);
              }
            }
          }
        }
      }
    };

    const drawBricks = () => {
      for (let c = 0; c < BRICK_COLS; c++) {
        for (let r = 0; r < BRICK_ROWS; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
            const brickY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.fillStyle = bricks[c][r].color;
            ctx.fillRect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
          }
        }
      }
    };

    const update = () => {
      if (rightPressed && paddleX < CANVAS_WIDTH - PADDLE_WIDTH) paddleX += 7;
      if (leftPressed && paddleX > 0) paddleX -= 7;

      ballX += ballVX;
      ballY += ballVY;

      // Walls
      if (ballX + ballVX > CANVAS_WIDTH - BALL_SIZE || ballX + ballVX < 0) {
        ballVX = -ballVX;
      }
      if (ballY + ballVY < 0) {
        ballVY = -ballVY;
      } else if (ballY + ballVY > CANVAS_HEIGHT - BALL_SIZE) {
        // Paddle collision
        if (ballX > paddleX && ballX < paddleX + PADDLE_WIDTH) {
          ballVY = -ballVY;
          // Add some english
          const hitPoint = ballX - (paddleX + PADDLE_WIDTH / 2);
          ballVX = hitPoint * 0.15;
        } else {
          setGameOver(true);
          setIsPlaying(false);
        }
      }

      collisionDetection();
    };

    const draw = () => {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      drawBricks();

      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);

      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(ballX + BALL_SIZE/2, ballY + BALL_SIZE/2, BALL_SIZE/2, 0, Math.PI * 2);
      ctx.fill();
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
    <div className="h-full flex flex-col items-center justify-center bg-neutral-900 font-sans text-white select-none relative">
      <div className="absolute top-6 left-8 text-2xl font-bold tracking-widest text-white/50 z-10">
        SCORE: {score}
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
            <h1 className="text-5xl font-black mb-2 tracking-tighter text-white">
              {won ? "YOU WIN" : gameOver ? "GAME OVER" : "BREAKOUT"}
            </h1>
            <p className="text-white/60 mb-8 text-sm uppercase tracking-widest">
              {won || gameOver ? `Final Score: ${score}` : "Classic Brick Breaker"}
            </p>
            <button
              onClick={() => { setScore(0); setGameOver(false); setWon(false); setIsPlaying(true); }}
              className="px-6 py-3 bg-blue-500 text-white rounded font-bold hover:scale-105 active:scale-95 transition-transform"
            >
              {gameOver || won ? "PLAY AGAIN" : "START"}
            </button>
            <p className="mt-8 text-xs text-white/40">Use LEFT and RIGHT arrows to move</p>
          </div>
        )}
      </div>
    </div>
  );
}
