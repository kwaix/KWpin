// geminiService.ts
// - Gemini API 연동 전용 모듈
// - Google AI SDK 또는 REST API를 사용하는 부분은 모두 이 파일 안에 숨긴다.
// - 외부에서 교체하기 쉽게 인터페이스만 고정하고 내부 구현은 나중에 연결한다.
// - unit test에서는 이 모듈을 mock 하여 외부 호출 없이 테스트 가능 (unittest.mock 컨셉과 동일).

import type { GameState } from "../game/pinballGame";

export type GameStateSnapshot = GameState;

/**
 * 게임 상태를 기반으로 플레이어에게 줄 팁을 Gemini에게 요청하는 예시 함수.
 */
export async function suggestTipFromGameState(gameState: GameStateSnapshot): Promise<string> {
  // 외부 API 경계 (External API Boundary)
  // - 실제 구현에서는 @google/generative-ai 또는 REST 호출을 사용한다.
  // - API 키 / 모델명 등은 GitHub Actions Secrets로 관리하고,
  //   런타임에는 환경변수나 별도 설정 객체로 주입한다.

  // TODO: 실제 구현 예시 (참고용 주석)
  // const client = new GoogleGenerativeAI({
  //   apiKey: process.env.GEMINI_API_KEY!,
  // });
  // const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
  // const prompt = `이 핀볼 게임 상태를 보고 플레이어에게 한 줄 팁을 주세요: ${JSON.stringify(gameState)}`;
  // const result = await model.generateContent(prompt);
  // return result.response.text();

  // 샘플에서는 고정 문자열을 반환
  return "볼이 떨어지기 전에 플리퍼를 더 자주 사용해 보세요! (Mock Gemini 응답)";
}
