// firestoreService.test.js
// - Jest를 사용한다고 가정한 예시 테스트 파일
// - Firestore SDK는 직접 호출하지 않고, 현재 모듈의 동작만 검증
// - unittest.mock 스타일: 외부 의존성을 모듈 경계에서 잘라내고 테스트

import { initFirestore, fetchLeaderboard, submitScore } from "../../src/services/firestoreService";

describe("firestoreService (mocked implementation)", () => {
  beforeEach(() => {
    initFirestore({ projectId: "test-project" });
  });

  test("fetchLeaderboard returns mock data", async () => {
    const data = await fetchLeaderboard(1);
    expect(data.length).toBe(1);
    expect(data[0]).toHaveProperty("name");
    expect(data[0]).toHaveProperty("score");
  });

  test("submitScore does not throw", async () => {
    await expect(submitScore("Tester", 123)).resolves.toBeUndefined();
  });
});
