# Rules

## 1. 코드 구조 및 모듈 경계

1. **게임 로직(`src/game/`)은 외부 서비스에 직접 의존하지 않는다.**
   - Firestore, Gemini 사용 금지
   - 순수 로직(물리, 렌더링, 상태 업데이트)에만 집중

2. **외부 서비스 호출은 항상 `src/services/` 디렉토리에서만 수행한다.**
   - `firestoreService.js` – Firestore 연동 전용
   - `geminiService.js` – Gemini API 연동 전용
   - 추후 다른 서비스(Supabase, 다른 AI 등) 추가 시에도 동일한 패턴 적용

3. **구성/환경값은 코드에 하드코딩하지 않는다.**
   - Firebase/Gemini API 키 등은 GitHub Actions Secrets로 관리
   - 로컬 개발 시 `.env.local` 등으로 관리하되, Git에는 커밋하지 않는다.

---

## 2. Git / 브랜치 전략 (샘플)

- 기본 브랜치: `main`
- 작업 브랜치 예시:
  - `feature/physics-tuning`
  - `feature/gemini-tips`
  - `chore/ci-setup`
- PR 생성 시:
  - 제목에 작업 범위를 명확히: 예) `feature: add basic pinball physics`
  - 설명에 관련 PRD 섹션/체크리스트 항목을 명시

---

## 3. 커밋 메시지 규칙 (샘플)

- 형식: `<type>: <short summary>`
- type 예:
  - `feat` – 새로운 기능
  - `fix` – 버그 수정
  - `chore` – 빌드, 설정, 문서 등
  - `test` – 테스트 코드 추가/수정

예)  
- `feat: add basic pinball game loop`  
- `fix: prevent ball from leaving left wall`

---

## 4. 테스트 및 mock 규칙

1. **외부 서비스는 unit test에서 직접 호출하지 않는다.**
   - 테스트는 `services/` 모듈을 mock하여 진행
   - Python의 `unittest.mock`과 같은 개념으로, JS/Python 환경에 맞는 mock 도구(Jest 등)를 사용

2. **테스트 작성 우선순위**
   - `PhysicsEngine` 물리 로직 (가능하면 단위 테스트)
   - `firestoreService`의 기본 동작 (현재는 mock 구현, 추후 실제 구현 시 다시 점검)
   - `geminiService`의 인터페이스 및 기본 응답 처리

3. **테스트 위치**
   - `tests/<도메인>/<파일명>.test.*`
   - 예: `tests/services/firestoreService.test.js`

---

## 5. Firestore 규칙

1. **컬렉션명**: `leaderboard`
2. **필드명**:
   - `name` (string)
   - `score` (number)
   - `createdAt` (Timestamp)
3. **정렬 기준**:
   - 기본: `score` 내림차순
4. **보안 규칙**:
   - 개발 초기: 테스트 편의를 위해 완화된 규칙 사용 가능
   - 실제 서비스 전환 시: 인증/권한 검토 필수

---

## 6. Gemini 규칙

1. **모델/버전**
   - 샘플 단계에서는 특정 버전 고정 없이 진행 (예: `gemini-2.0-flash`)
   - 실제 적용 시 Rules.md 업데이트 필수

2. **프롬프트 설계**
   - PRD에 정의된 목표(한 줄 팁, 전략 코칭 등)에 맞게 설계
   - 게임 상태를 그대로 덤프하기보다, 필요한 정보만 요약해서 전달하는 것을 권장

3. **비용/쿼터 관리**
   - 데모 단계에서는 호출 횟수를 제한하거나, 특정 조건에서만 Gemini 호출
   - GitHub Actions에서 대량 호출 금지

---

## 7. CI/CD 규칙 (요약)

1. **PR 생성 시**
   - 최소한 테스트 스크립트 실행 (현재는 샘플 수준)
   - 실패 시 머지 금지

2. **main 브랜치 머지 시**
   - 향후: 자동 배포 파이프라인 연계
   - 배포 관련 설정은 별도 `deploy.yml` 또는 같은 워크플로우 안에서 관리

3. **Secrets 관리**
   - 예시:
     - `FIREBASE_API_KEY`
     - `FIREBASE_PROJECT_ID`
     - `GEMINI_API_KEY`
   - Secrets 이름은 대문자 + 언더스코어로 통일

---

## 8. 문서 업데이트 규칙

- PRD, Rules, Skills, Checklist, MCP 중 **어느 하나라도 변경이 필요하면 반드시 PR에 포함**한다.
- “규칙 먼저, 코드 나중” 원칙:
  - 새로운 규칙/패턴을 도입할 때는 먼저 Rules.md에 추가한 뒤 코드/CI에 반영.

---

## 9. 향후 확장 시 고려사항

- Vite/webpack 등 번들러 도입 여부
- TypeScript 전환
- E2E 테스트(Cypress 등) 도입
- 멀티 모듈(MCP 스타일 도구) 확장


---

## 10. CI / CD 구성 원칙 (업데이트)

### ✅ CI는 항상 활성  
- `.github/workflows/ci.yml`은 universal 최소 preset  
- TypeScript 빌드 / 기본 테스트만 수행  
- 배포는 하지 않음

### ⚡ 배포는 예시 템플릿만 제공  
- `.github/workflows/deploy.firebase.yml.example`  
- `.github/workflows/deploy.github-pages.yml.example`  
- 필요할 때 `.example`을 제거하고 Secrets를 추가하면 즉시 동작하도록 구성  
- 기본 preset에서는 비활성 상태 → 혼란 최소화
