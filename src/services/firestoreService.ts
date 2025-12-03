// firestoreService.ts
// - Firestore 연동 전용 모듈
// - 이 모듈만 firebase SDK에 직접 의존하도록 설계
// - 외부에서 교체하기 쉽게, 모든 Firestore 호출은 여기서만 수행
// - unit test에서는 unittest.mock 스타일로 이 모듈 전체를 mock 처리 (예: Jest의 jest.mock)

export interface FirestoreConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  // 필요 시 기타 필드 추가
  [key: string]: unknown;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  createdAt: Date;
  id?: string;
}

let db: { _config: FirestoreConfig; _mock: boolean } | null = null;

/**
 * Firestore 초기화
 * @param config Firebase 프로젝트 설정 객체
 *
 * 실제 프로젝트에서는 firebase SDK를 import하고 initializeApp(config) 후
 * getFirestore(app)을 사용한다.
 * 여기서는 샘플 구조만 제공하며, 외부 의존성은 나중에 연결한다.
 */
export function initFirestore(config: FirestoreConfig): void {
  // 외부 API 경계 (External API Boundary)
  // - 이 영역에서만 Firebase SDK를 사용한다.
  // - 현재는 구조 설명을 위해 db를 단순 객체로 대체한다.
  db = { _config: config, _mock: true };
}

/**
 * 리더보드 상위 N개 조회
 */
export async function fetchLeaderboard(topN: number = 10): Promise<LeaderboardEntry[]> {
  if (!db) {
    throw new Error("Firestore가 초기화되지 않았습니다. initFirestore를 먼저 호출하세요.");
  }

  // TODO: 실제 Firestore 구현 예시 (참고용 주석)
  // const q = query(
  //   collection(db, "leaderboard"),
  //   orderBy("score", "desc"),
  //   limit(topN)
  // );
  // const snapshot = await getDocs(q);
  // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaderboardEntry));

  // 현재 샘플에서는 mock 데이터를 반환
  const now = new Date();
  const mock: LeaderboardEntry[] = [
    { name: "Alice", score: 1200, createdAt: now },
    { name: "Bob", score: 900, createdAt: now },
  ];
  return mock.slice(0, topN);
}

/**
 * 리더보드에 점수 저장
 */
export async function submitScore(name: string, score: number): Promise<void> {
  if (!db) {
    throw new Error("Firestore가 초기화되지 않았습니다. initFirestore를 먼저 호출하세요.");
  }

  // TODO: 실제 Firestore 구현 예시 (참고용 주석)
  // const colRef = collection(db, "leaderboard");
  // await addDoc(colRef, {
  //   name,
  //   score,
  //   createdAt: serverTimestamp(),
  // });

  // 샘플에서는 콘솔 출력으로 대체
  console.log("[Mock Firestore] submitScore:", { name, score });
}
