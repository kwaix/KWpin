// geminiService.test.js
// - 실제 Gemini API 호출 없이, 현재 mock 구현이 의도대로 동작하는지만 확인
// - 나중에 진짜 구현을 넣을 때는 jest.mock 또는 DI 패턴으로 외부 호출을 차단

import { suggestTipFromGameState } from "../../src/services/geminiService";

describe("geminiService (mocked)", () => {
  test("suggestTipFromGameState returns a string", async () => {
    const tip = await suggestTipFromGameState({ dummy: true });
    expect(typeof tip).toBe("string");
    expect(tip.length).toBeGreaterThan(0);
  });
});
