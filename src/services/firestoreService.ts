// firestoreService.ts
// - Firestore 연동 전용 모듈
// - 이 모듈만 firebase SDK에 직접 의존하도록 설계
// - 외부에서 교체하기 쉽게, 모든 Firestore 호출은 여기서만 수행
// - unit test에서는 unittest.mock 스타일로 이 모듈 전체를 mock 처리 (예: Jest의 jest.mock)

import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
  type Firestore,
  type Timestamp
} from "firebase/firestore";

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

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

/**
 * Firestore 초기화
 * @param config Firebase 프로젝트 설정 객체
 */
export function initFirestore(config: FirestoreConfig): void {
  // 이미 초기화되어 있다면 재사용
  if (!app) {
    app = initializeApp(config);
    db = getFirestore(app);
  }
}

/**
 * 리더보드 상위 N개 조회
 */
export async function fetchLeaderboard(topN: number = 10): Promise<LeaderboardEntry[]> {
  if (!db) {
    console.warn("Firestore가 초기화되지 않았습니다. mock 데이터를 반환합니다.");
    const now = new Date();
    return [
      { name: "Alice (Mock)", score: 1200, createdAt: now },
      { name: "Bob (Mock)", score: 900, createdAt: now },
    ];
  }

  try {
    const q = query(
      collection(db, "leaderboard"),
      orderBy("score", "desc"),
      limit(topN)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        let createdAt = new Date();
        if (data.createdAt && (data.createdAt as Timestamp).toDate) {
            createdAt = (data.createdAt as Timestamp).toDate();
        }
        return {
            id: doc.id,
            name: data.name,
            score: data.score,
            createdAt: createdAt
        } as LeaderboardEntry;
    });
  } catch (e) {
    console.error("Firestore fetch error:", e);
    throw e;
  }
}

/**
 * 리더보드에 점수 저장
 */
export async function submitScore(name: string, score: number): Promise<void> {
  if (!db) {
    console.warn("Firestore가 초기화되지 않았습니다. 콘솔에만 기록합니다.");
    console.log("[Mock Firestore] submitScore:", { name, score });
    return;
  }

  try {
    const colRef = collection(db, "leaderboard");
    await addDoc(colRef, {
      name,
      score,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.error("Firestore submit error:", e);
    throw e;
  }
}
