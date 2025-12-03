# Prompt Guide (Jules / ChatGPT / Claude / Gemini)

Jules나 다른 AI에게 이 레포를 기반으로 작업을 시킬 때 사용할 수 있는 예시 프롬프트 모음이다.  
필요에 따라 그대로 붙여넣거나, 일부 수정해서 사용할 수 있다.

---

## 1. 초기 이해용 프롬프트

**목적**: 레포 구조와 PRD를 먼저 이해시키기

> 이 리포의 구조를 이해해 줘.  
> 특히 docs/PRD.md, docs/Rules.md, docs/skills.md, docs/mcp.md를 먼저 읽고  
> 이 프로젝트가 어떤 핀볼 게임을 만들려고 하는지,  
> 그리고 services/와 game/ 디렉토리의 역할이 무엇인지 요약해 줘.

---

## 2. 기능 개발 요청 (핵심 패턴)

**패턴**:

> docs/PRD.md와 docs/Rules.md를 기준으로  
> [구현하고 싶은 기능]을 구현해 줘.  
> 관련된 파일만 수정하고, 변경된 파일과 변경 내용을 설명해 줘.

**예시 – Firestore 실제 연동**:

> docs/PRD.md의 "7. 리더보드 (Firestore)"와  
> docs/Rules.md의 Firestore 규칙을 참고해서  
> src/services/firestoreService.js를 실제 Firebase Firestore에 연결되도록 구현해 줘.  
> GitHub Actions Secrets로부터 FIREBASE_* 값을 주입받는 것을 가정하고,  
> 로컬 개발 환경에서 .env.local로 설정할 수 있는 방법도 함께 제안해 줘.

**예시 – Gemini 연동**:

> docs/PRD.md의 "8. Gemini 연동 (AI 기능)"을 기준으로  
> src/services/geminiService.js에 실제 Gemini API 호출 코드를 작성해 줘.  
> 외부 호출이 일어나는 함수는 테스트에서 mock 처리하기 쉽게 만들어 줘.

---

## 3. TypeScript 전환 요청

> 이 프로젝트를 점진적으로 TypeScript로 전환하고 싶어.  
> 우선 src/game/ 디렉토리부터 TS로 바꾸는 전략을 제안해 줘.  
> 어떤 tsconfig 설정이 필요할지와,  
> PhysicsEngine, Renderer, PinballGame에 필요한 타입 정의 예시를 함께 보여줘.

---

## 4. 테스트 코드 작성/보강 요청

> docs/Rules.md와 docs/skills.md의 "add_test_with_mocks" 스킬을 참고해서  
> src/services/firestoreService.js와 src/services/geminiService.js에 대한 테스트를  
> Jest 기반으로 다시 작성해 줘.  
> 외부 서비스는 실제로 호출하지 않고 mock만 사용하도록 해 줘.

---

## 5. 코드 리뷰/리팩터링 요청

> docs/Rules.md와 docs/skills.md의 "refactor_game_logic" 스킬을 참고해서  
> src/game/*.js 코드를 리뷰해 줘.  
> 물리/렌더링/상태 관리의 경계를 더 명확히 하거나,  
> 읽기 쉬운 구조로 리팩터링할 수 있는 포인트를 제안해 줘.

---

## 6. MCP 스타일 도구 설계/확장 요청

> docs/mcp.md를 읽고,  
> 현재 정의된 MCP-style 모듈들을 실제 코드 구조와 더 잘 맞게 다듬어 줘.  
> 특히 firestore-leaderboard, gemini-game-tip, gemini-file-search-api에 대해  
> 구체적인 함수 시그니처와 입출력 타입(JSON 스키마 형태)을 설계해 줘.

---

## 7. 다음 이터레이션 계획 요청

> docs/checklist.md와 docs/PRD.md를 보고,  
> 지금까지 구현된 코드 상태를 기준으로  
> 다음 이터레이션에서 진행하면 좋을 작업 5가지를 정리해서 제안해 줘.  
> 각 작업이 어떤 파일/모듈에 영향을 미치는지도 함께 써 줘.

---

## 사용 팁

- 레포를 처음 열었을 때는 항상 **"먼저 PRD/Rules/skills/mcp를 읽어"** 라는 식으로 지시하면 좋다.
- 구현 요청 시에는 **"docs/XXX.md를 기준으로"** 라고 명시해 두면, AI가 문서와 코드를 맞춰서 생각하기 쉽다.
- 한 번에 너무 많은 파일 수정을 요청하기보다, 기능 단위로 쪼개서 여러 번 요청하는 것이 좋다.
