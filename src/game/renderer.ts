// renderer.ts
// - CanvasRenderingContext2D를 활용한 렌더링 담당
// - 게임 상태를 받아 캔버스에 그리는 역할만 수행
// - 외부 API나 DOM 접근 없이 순수 렌더링에 집중

import type { Ball } from "./physics.js";

export interface Flipper {
  x: number;
  y: number;
  angle: number;
  length: number;
  thickness: number;
}

export interface RenderState {
  ball: Ball;
  flippers: Flipper[];
  score: number;
}

export class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ballImage: HTMLImageElement | null;

  constructor(canvas: HTMLCanvasElement, ballImage?: HTMLImageElement) {
    this.canvas = canvas;
    this.ballImage = ballImage || null;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("2D context를 가져올 수 없습니다.");
    }
    this.ctx = ctx;
  }

  clear() {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBall(ball: Ball) {
    if (this.ballImage && this.ballImage.complete && this.ballImage.naturalWidth > 0) {
      this.ctx.save();
      this.ctx.translate(ball.x, ball.y);
      // 이미지가 원형으로 보일 수 있게 클리핑하거나, 그냥 이미지를 그립니다.
      // 여기서는 이미지를 공 크기에 맞춰 그립니다.
      this.ctx.drawImage(
        this.ballImage,
        -ball.radius,
        -ball.radius,
        ball.radius * 2,
        ball.radius * 2
      );
      this.ctx.restore();
    } else {
      this.ctx.beginPath();
      this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = "#0f9";
      this.ctx.fill();
    }
  }

  drawFlipper(flipper: Flipper) {
    this.ctx.save();
    this.ctx.translate(flipper.x, flipper.y);
    this.ctx.rotate(flipper.angle);
    this.ctx.fillStyle = "#09f";
    this.ctx.fillRect(
      -flipper.length / 2,
      -flipper.thickness / 2,
      flipper.length,
      flipper.thickness
    );
    this.ctx.restore();
  }

  drawScore(score: number) {
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "16px system-ui";
    this.ctx.fillText(`Score: ${score}`, 10, 20);
  }

  render(state: RenderState) {
    this.clear();
    this.drawBall(state.ball);
    state.flippers.forEach((f) => this.drawFlipper(f));
    this.drawScore(state.score);
  }
}
