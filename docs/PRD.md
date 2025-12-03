# Pinball Game PRD

## 1. 개요

웹 브라우저에서 실행되는 간단한 2D 핀볼 게임을 만든다.  
플레이어는 키보드(스페이스바, 좌우 방향키 등)를 사용해 볼을 튕기며 최대한 오랫동안 떨어뜨리지 않고 높은 점수를 얻는 것이 목표다.

점수는 Firestore에 저장되어 리더보드로 관리되며, 향후 Gemini API를 활용해 플레이어에게 플레이 팁이나 플레이 스타일 분석을 제공하는 것을 염두에 둔다.

---

## 2. 목표

- 데모 목적의 **작은 범위의 핀볼 게임** 구현
- **Firestore 기반 리더보드** 구현
- **외부 서비스 분리 구조** 설계
  - Firestore, Gemini와의 연결부는 services 레이어로 캡슐화
  - unit test에서는 외부 서비스 모듈을 mock 처리
- GitHub Actions + Jules를 통한 CI/CD 파이프라인 실험

---

## 3. 비목표 (Non-goals)

- 물리적으로 완벽한 실제 핀볼 구현
- 복잡한 애니메이션, 고급 그래픽 연출
- 멀티플레이, 소셜 로그인, 인앱 결제 등 확장 기능
- 대규모 트래픽/고가용성 고려

---

## 4. 타겟 사용자

- 사내/개인용 데모를 보는 이해관계자
- AI 도구(Jules, ChatGPT, Claude 등)를 활용한 개발 워크플로우를 실험하고 싶은 개발자

---

## 5. 플랫폼 및 기술 스택

- **플랫폼**: 최신 데스크톱 브라우저 (Chrome/Edge 기준)
- **프론트엔드**: HTML5, CSS, JavaScript (ES Modules)
- **렌더링**: `<canvas>` 2D
- **백엔드**: Firestore (Firebase)
- **AI API**: Gemini (Google Generative AI)
- **CI/CD**: GitHub Actions (Jules가 GitHub 액세스, Actions 통해 배포)
- **문서**: Markdown (`docs/` 폴더)

---

## 6. 게임 디자인

### 6.1. 기본 규칙

- 화면 상단에서 시작하는 공(ball)이 중력에 의해 아래로 떨어진다.
- 플레이어는 플리퍼(flipper)를 사용해 공을 튕겨 올리며 가능한 오래 떨어지지 않게 유지한다.
- 공이 화면 바닥 아래로 완전히 벗어나면 게임 오버.

### 6.2. 조작

- Space: 공 발사(또는 재발사)
- 향후 확장 가능: 좌/우 화살표로 각각 플리퍼 제어

### 6.3. 점수 시스템

- 시간 경과에 따라 점수가 서서히 증가 (예: 초당 일정 점수)
- 향후 핀/장애물을 추가하여 충돌 시 추가 점수 부여 가능
- 게임 오버 시 최종 점수를 Firestore 리더보드에 저장할 수 있는 UI 제공

### 6.4. 난이도

- 초기 버전:
  - 중력, 초기 발사 속도 등은 고정값
  - 기본적인 벽/플리퍼 충돌만 처리
- 향후 버전:
  - 랜덤 장애물, 특별 점수 구역 등 추가 가능

---

## 7. 리더보드 (Firestore)

### 7.1. 컬렉션 구조 (초안)

- 컬렉션명: `leaderboard`
- 문서 필드:
  - `name` (string, required) – 플레이어 이름
  - `score` (number, required) – 최종 점수
  - `createdAt` (Timestamp, serverTimestamp) – 기록 생성 시간

### 7.2. 기능 요구사항

- 상위 N개(예: 10개) 레코드를 점수 내림차순으로 조회
- 점수 저장 성공/실패에 대한 피드백 제공
- Firestore 호출은 `src/services/firestoreService.js`에서만 수행

---

## 8. Gemini 연동 (AI 기능)

### 8.1. 1차 목표

- 게임 오버 시점에 **게임 상태 스냅샷**을 Gemini에 전달하고,
- 간단한 한 줄 팁(예: “플리퍼를 조금 더 일찍 눌러 보세요”)을 받아 콘솔 또는 alert 등으로 표시.

### 8.2. 구조 요구사항

- Gemini API 호출은 `src/services/geminiService.js`에서만 수행
- API 키는 GitHub Actions Secrets로 관리 (예: `GEMINI_API_KEY`)
- 실제 구현 전까지는 mock 응답을 사용하는 샘플 함수 제공
- unit test 시에는 이 모듈을 mock 처리하여 외부 호출 제거

### 8.3. 향후 아이디어

- 플레이어별 평균 점수/플레이 시간 분석
- “전략 코칭 모드”: 일정 점수 이하일 때 자동으로 팁 제공
- 게임 내 텍스트/튜토리얼을 Gemini로 생성/보완

---

## 9. 아키텍처 & 디렉토리 구조

- `index.html`: Canvas 및 UI 요소 정의, `src/main.js` 로딩
- `src/main.js`: 게임 초기화, UI 이벤트 연결, 서비스 레이어 호출
- `src/game/`: 게임 로직 (physics, renderer, pinballGame 등)
- `src/services/`: Firestore, Gemini 등 외부 서비스 연동 모듈
- `docs/`: PRD, Rules, Skills, Checklist, MCP 등 문서
- `tests/`: 서비스 및 로직에 대한 단위 테스트

외부 서비스는 반드시 `services/` 디렉토리를 경유해야 하며,  
게임 로직(`game/` 디렉토리)은 외부 서비스에 직접 의존하지 않는다.

---

## 10. 품질 및 테스트

- **목표 커버리지:** 핵심 로직(physics, 주요 서비스 함수)에 대해 기본적인 테스트 작성
- Firestore, Gemini 연동은 mock 기반으로 테스트
- GitHub Actions에서 최소한 테스트 스크립트를 실행

---

## 11. CI/CD 요구사항 (개요)

- PR 생성 시:
  - 테스트 실행 (성공/실패 표시)
- main 브랜치에 머지 시:
  - (선택) 빌드/배포 파이프라인 실행
  - 배포 대상: GitHub Pages 또는 별도 호스팅 (구체 방법은 Rules.md에서 정의)

---

## 12. 오픈 포인트

- 실제 배포 대상(예: GitHub Pages / Firebase Hosting / Cloud Run)은 이후 결정
- Gemini 모델 버전 및 구체적인 프롬프트 디자인
- Firestore 보안 규칙 (테스트용 vs 실제 서비스용)

이 PRD는 샘플 프로젝트를 위한 최소 요구사항이며,  
추후 Rules.md와 Checklist.md에서 구체적인 작업 단계와 규칙을 정의한다.


---

## 13. TypeScript 기반 개발 및 배포 원칙 (추가)

1. **TS는 개발용이고, 실제 배포는 JS 파일로 이루어진다.**  
   브라우저는 TypeScript를 실행할 수 없으므로, `tsc`를 통해 생성된 `build/*.js` 파일을 배포한다.

2. **모바일 웹앱 구동 문제 없음.**  
   - 현재 tsconfig의 출력 타겟(`ES2020`)은 최신 모바일 브라우저에서 문제없이 실행됨.  
   - 아주 오래된 기기를 지원해야 한다면 빌드 타겟을 낮추거나 번들러(Vite/Webpack/Rollup)를 사용할 수 있다.

3. **index.html은 TS 파일이 아닌 컴파일된 JS를 로드해야 한다.**  
   배포 전에는 반드시 아래처럼 수정해 사용한다:
   ```html
   <script type="module" src="./build/main.js"></script>
   ```

4. **교체 가능성 극대화 구조 유지.**  
   - 게임 로직(`src/game/*`)은 순수 TS로 작성 → 외부 서비스 영향 없음  
   - 서비스(`src/services/*`)는 Firestore/Gemini 등 외부 API와의 경계만 담당  
   - 서비스 레이어는 나중에 다른 DB 또는 다른 AI로 교체하기 쉬운 형태로 유지  
