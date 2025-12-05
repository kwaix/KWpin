// pinballGame.ts
// - 게임 전체 오케스트레이션 담당
// - PhysicsEngine, Renderer를 조합
// - 외부에서 onScoreChange, onGameOver 콜백을 주입받아 UI/서비스와 분리

import { PhysicsEngine, type Ball } from "./physics.js";
import { Renderer, type Flipper, type RenderState } from "./renderer.js";

export interface GameState {
  ball: Ball;
  flippers: Flipper[];
}

export interface PinballGameOptions {
  ballImage?: HTMLImageElement;
  onScoreChange?: (score: number) => void;
  onGameOver?: (finalScore: number, gameState: GameState) => void | Promise<void>;
}

export class PinballGame {
  canvas: HTMLCanvasElement;
  renderer: Renderer;
  physics: PhysicsEngine;
  onScoreChange: (score: number) => void;
  onGameOver: (finalScore: number, gameState: GameState) => void | Promise<void>;
  score: number;
  lastTime: number | null;
  running: boolean;
  state: GameState;

  constructor(canvas: HTMLCanvasElement, { ballImage, onScoreChange, onGameOver }: PinballGameOptions) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas, ballImage);
    this.physics = new PhysicsEngine({
      width: canvas.width,
      height: canvas.height,
    });

    this.onScoreChange = onScoreChange || (() => {});
    this.onGameOver = onGameOver || (() => {});

    this.score = 0;
    this.lastTime = null;
    this.running = false;

    this.state = this._createInitialState();
    this._setupInput();
  }

  private _createInitialState(): GameState {
    return {
      ball: {
        x: this.canvas.width / 2,
        y: 100,
        vx: 0,
        vy: 0,
        radius: 10,
      },
      flippers: [
        {
          x: this.canvas.width / 2 - 80,
          y: this.canvas.height - 80,
          angle: 0.2,
          length: 100,
          thickness: 16,
        },
        {
          x: this.canvas.width / 2 + 80,
          y: this.canvas.height - 80,
          angle: -0.2,
          length: 100,
          thickness: 16,
        },
      ],
    };
  }

  private _setupInput() {
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.code === "Space") {
        this.launchBall();
      }
    });
  }

  launchBall() {
    // 간단한 발사 로직: 위로 튀어오르도록 속도 부여
    if (this.state.ball.vy === 0) {
      this.state.ball.vx = (Math.random() - 0.5) * 600;
      this.state.ball.vy = -1500;
    }
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this._loop);
  }

  reset() {
    this.state = this._createInitialState();
    this.score = 0;
    this.onScoreChange(this.score);
    if (!this.running) {
      this.start();
    }
  }

  private _loop = (timestamp: number) => {
    if (!this.running) return;
    const last = this.lastTime ?? timestamp;
    const dt = (timestamp - last) / 1000;
    this.lastTime = timestamp;

    this._update(dt);
    const renderState: RenderState = {
      ...this.state,
      score: this.score,
    };
    this.renderer.render(renderState);

    requestAnimationFrame(this._loop);
  };

  private _update(dt: number) {
    const { ball } = this.state;
    const { ball: updatedBall, isOutOfBounds } = this.physics.stepBall(ball, dt);
    this.state.ball = updatedBall;

    // 매우 단순한 점수 증가 규칙: 시간이 지날수록 점수 증가
    this.score += Math.floor(dt * 10);
    this.onScoreChange(this.score);

    if (isOutOfBounds) {
      this.running = false;
      const gameStateSnapshot: GameState = JSON.parse(JSON.stringify(this.state));
      void this.onGameOver(this.score, gameStateSnapshot);
    }
  }
}
