// physics.ts
// - 핀볼 게임의 단순화된 물리 계산
// - 외부 서비스 의존성 없음 (순수 로직)
// - unit test 작성이 쉬운 구조

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export class PhysicsEngine {
  width: number;
  height: number;
  gravity: number;

  constructor({ width, height, gravity = 2000 }: { width: number; height: number; gravity?: number }) {
    this.width = width;
    this.height = height;
    this.gravity = gravity;
  }

  stepBall(ball: Ball, dt: number): { ball: Ball; isOutOfBounds: boolean } {
    // dt: 초 단위 (예: 1/60)
    ball.vy += this.gravity * dt;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    // 벽 충돌(좌우)
    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius;
      ball.vx *= -0.9;
    }
    if (ball.x + ball.radius > this.width) {
      ball.x = this.width - ball.radius;
      ball.vx *= -0.9;
    }

    // 상단 충돌
    if (ball.y - ball.radius < 0) {
      ball.y = ball.radius;
      ball.vy *= -0.9;
    }

    // 단순 바닥 감지 (y > height)
    const isOutOfBounds = ball.y - ball.radius > this.height;
    return { ball, isOutOfBounds };
  }
}
