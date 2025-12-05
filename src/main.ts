// main.ts
// - 캔버스 초기화
// - PinballGame 인스턴스 생성
// - Firestore / Gemini 서비스와 느슨한 결합 유지
// - 외부 서비스는 모두 services/ 모듈을 통해서만 호출

import { PinballGame } from "./game/pinballGame.js";
import { initFirestore, submitScore, fetchLeaderboard } from "./services/firestoreService.js";
import { suggestTipFromGameState } from "./services/geminiService.js";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement | null;
const scoreEl = document.getElementById("score") as HTMLSpanElement | null;
const restartBtn = document.getElementById("restartBtn") as HTMLButtonElement | null;
const saveScoreBtn = document.getElementById("saveScoreBtn") as HTMLButtonElement | null;

if (!canvas || !scoreEl || !restartBtn || !saveScoreBtn) {
  throw new Error("필요한 DOM 요소를 찾을 수 없습니다.");
}

// 이미지 로드
const ballImg = new Image();
ballImg.src = "assets/ball.png";

const game = new PinballGame(canvas, {
  ballImage: ballImg,
  onScoreChange(score) {
    scoreEl.textContent = String(score);
  },
  onGameOver: async (finalScore, gameState) => {
    console.log("Game Over, score:", finalScore);
    try {
      const tip = await suggestTipFromGameState(gameState);
      if (tip) {
        console.log("Gemini Tip:", tip);
      }
    } catch (e) {
      console.warn("Gemini tip 호출 실패 (예상 범위 내):", e);
    }
  },
});

restartBtn.addEventListener("click", () => {
  game.reset();
});

saveScoreBtn.addEventListener("click", async () => {
  const playerName = window.prompt("플레이어 이름을 입력하세요", "Player");
  if (!playerName) return;

  try {
    await submitScore(playerName, game.score);
    alert("점수가 리더보드에 저장되었습니다.");
    const top = await fetchLeaderboard(5);
    console.log("최신 리더보드(상위 5명):", top);
  } catch (e) {
    console.error("리더보드 저장/조회 실패:", e);
    alert("리더보드 저장에 실패했습니다. 콘솔을 확인하세요.");
  }
});

// Firestore 초기화 (실제 키는 GitHub Actions Secrets에서 주입)
// 이 객체는 예시이며, 실제 값은 PRD/Rules 참고
const firebaseConfig = (window as any).FIREBASE_CONFIG || {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
};
initFirestore(firebaseConfig);

// 게임 루프 시작
game.start();
