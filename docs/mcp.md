# MCP-style Modules (for Gemini & Others)

Anthropic의 MCP(Modular Command/Capability) 개념을 참고하여,  
이 프로젝트에서도 **외부 기능을 모듈 단위로 정의**하는 방식을 문서화한다.

여기서의 MCP는 실제 구현이 아니라, “이런 도구가 있다면 AI가 어떻게 활용할 수 있는지”에 대한 설계 문서에 가깝다.

---

## 1. firestore-leaderboard

- **설명**: Firestore 기반 리더보드 조회/저장을 담당하는 모듈
- **역할**:
  - 상위 N개 점수 조회
  - 새로운 점수 기록 추가
- **입력 예시**:
  - `get_top_scores`: `{ "limit": 10 }`
  - `add_score`: `{ "name": "Player", "score": 1234 }`
- **출력 예시**:
  - `get_top_scores`: `[{"name": "Alice", "score": 1200, "createdAt": "..."}]`
  - `add_score`: `{ "ok": true, "id": "<doc-id>" }`
- **실제 구현 위치**:
  - `src/services/firestoreService.js`
- **AI 활용 아이디어**:
  - “최근 10게임 평균 점수 계산”과 같은 분석 로직을 AI에게 위임

---

## 2. gemini-chat

- **설명**: 일반적인 자연어 질의/응답을 Gemini에 위임하는 모듈
- **역할**:
  - 게임 관련 질문에 답변
  - 코드/설정 등에 대한 설명 생성
- **입력 예시**:
  - `{ "prompt": "핀볼 게임에서 난이도를 조절하는 방법은?" }`
- **출력 예시**:
  - `{ "answer": "중력을 조정하거나 장애물 밀도를 조절할 수 있습니다." }`
- **실제 구현 위치 (예정)**:
  - 별도 `src/services/geminiChatService.js` 또는 기존 `geminiService.js` 확장
- **AI 활용 아이디어**:
  - 개발 중 “PRD 요약”, “Rules 해석” 등의 작업을 자동화

---

## 3. gemini-game-tip

- **설명**: 게임 상태를 분석해 플레이어에게 팁을 주는 특화 모듈
- **역할**:
  - 게임 상태 스냅샷을 받아 전략/팁 생성
- **입력 예시**:
  - `{ "gameState": { ... }, "language": "ko" }`
- **출력 예시**:
  - `{ "tip": "플리퍼를 조금 더 일찍 눌러 보세요." }`
- **실제 구현 위치**:
  - 현재 `src/services/geminiService.js` 내 `suggestTipFromGameState`
- **AI 활용 아이디어**:
  - “학습 모드”에서 반복 플레이 후 패턴 분석

---

## 4. gemini-file-search-api

- **설명**: Gemini의 파일 검색 기능(예: 코드/문서 인덱싱 후 검색)을 사용하는 모듈을 가정
- **역할**:
  - 레포지토리 내 문서/코드 검색을 AI에 위임
  - PRD, Rules, Skills, Checklist, 코드 파일 등을 인덱싱 후 QA/QG에 활용
- **입력 예시**:
  - `{ "query": "리더보드 Firestore 스키마", "scope": ["docs/PRD.md", "src/services/firestoreService.js"] }`
- **출력 예시**:
  - `{ "matches": [ { "file": "docs/PRD.md", "snippet": "...leaderboard..." } ] }`
- **실제 구현 위치 (예정)**:
  - `src/services/geminiFileSearchService.js` (설계만, 실제 구현은 사용 환경에 따라 상이)
- **AI 활용 아이디어**:
  - Jules나 기타 에이전트가 “레포 전체를 이해하고 맥락 있는 수정”을 하기 위해 활용
  - 특정 규칙(Rules.md)과 코드 위반 여부 자동 검출

---


---

## 5. analytics-metrics

- **설명**: 게임 플레이 데이터를 수집/집계하는 모듈
- **역할**:
  - 플레이 시간, 평균 점수, 게임 오버까지 걸린 시간 등 기록
- **입력 예시**:
  - `{ "event": "game_over", "payload": { "score": 1234, "durationSec": 87 } }`
- **출력 예시**:
  - `{ "ok": true }` 또는 단순 로그
- **실제 구현 위치 (후보)**:
  - `src/services/analyticsService.js`
- **AI 활용 아이디어**:
  - Gemini/Claude에게 “최근 50게임 데이터를 요약해 줘” 라고 요청할 때 원천 데이터로 사용

---

## 6. config-store

- **설명**: 게임 설정값(중력, 공 속도, 난이도)을 중앙에서 관리하는 모듈
- **역할**:
  - 현재 실험 중인 파라미터 세트 조회
  - 원격/로컬 설정 변경 (실제 구현 방식은 이후 결정)
- **입력 예시**:
  - `get_config`: `{ "profile": "default" }`
  - `set_config`: `{ "profile": "experiment-1", "gravity": 2500 }`
- **출력 예시**:
  - `{ "gravity": 2000, "launchSpeed": 1500 }`
- **실제 구현 위치 (후보)**:
  - `src/services/configService.js`
- **AI 활용 아이디어**:
  - “난이도 낮추는 설정값으로 바꿔줘” 같은 자연어 명령을 설정 변경으로 매핑

---

## 7. ab-testing

- **설명**: 다른 물리 설정/점수 룰을 A/B 테스트하는 모듈
- **역할**:
  - 사용자/세션별로 실험 그룹 배정
  - 실험별 메트릭 수집에 analytics-metrics MCP 연계
- **입력 예시**:
  - `assign_variant`: `{ "userId": "abc123", "experiment": "gravity-test" }`
- **출력 예시**:
  - `{ "variant": "A" }` 또는 `{ "variant": "B" }`
- **실제 구현 위치 (후보)**:
  - `src/services/abTestService.js`
- **AI 활용 아이디어**:
  - “어떤 실험 변수가 점수 향상에 가장 영향을 줬는지 요약해 줘” 같은 분석 작업에 활용


## 8. 기타 확장 후보

- `analytics-metrics`: 플레이 데이터 수집/분석
- `config-store`: 실험 파라미터(중력, 속도 등) 원격 관리
- `ab-testing`: 다른 물리/점수 룰을 실험하기 위한 도구

---

## 설계 원칙 요약

1. **모듈 경계 명확화**  
   - MCP 단위는 외부 세계와의 경계를 담당하며, 내부(게임 로직)는 이 경계를 통해서만 상호작용한다.

2. **교체 가능성**  
   - Firestore → 다른 DB 교체 시, MCP 인터페이스는 그대로 유지하고 내부 구현만 교체하는 것을 목표로 한다.

3. **AI 친화적 인터페이스**  
   - JSON 기반의 명확한 입력/출력 구조를 사용해, AI 에이전트가 호출/조합하기 쉽게 만든다.
