# Checklist

핀볼 샘플 프로젝트를 진행하면서 사용할 수 있는 체크리스트이다.  
Jules나 다른 AI에게 "checklist.md 기준으로 다음 작업 제안해줘"라고 요청해도 된다.

---

## 1. 초기 세팅

- [ ] GitHub 리포지토리 생성
- [ ] 이 샘플 프로젝트 디렉토리 구조를 리포지토리에 업로드
- [ ] GitHub Actions 활성화
- [ ] Firestore 프로젝트 생성 및 기본 설정
- [ ] Gemini API 사용 설정 (콘솔에서 활성화)

---

## 2. Secrets 설정 (GitHub Actions)

- [ ] `FIREBASE_API_KEY`
- [ ] `FIREBASE_AUTH_DOMAIN`
- [ ] `FIREBASE_PROJECT_ID`
- [ ] `GEMINI_API_KEY`
- [ ] (선택) 기타 필요한 설정값

---

## 3. Firestore 연동 구현

- [ ] `src/services/firestoreService.js`에 실제 Firebase SDK 연결
- [ ] `leaderboard` 컬렉션 생성
- [ ] `submitScore`에서 문서 추가 확인
- [ ] `fetchLeaderboard`에서 상위 N개 레코드 조회 확인
- [ ] 단위 테스트에서 외부 호출 mock 전략 검토/적용

---

## 4. Gemini 연동 구현

- [ ] `src/services/geminiService.js`에 실제 Gemini 호출 코드 추가
- [ ] 게임 상태를 적절한 텍스트/구조로 변환
- [ ] 게임 오버 시 한 줄 팁 출력 동작 확인
- [ ] 호출 횟수 제한/에러 처리 전략 정의

---

## 5. 게임 플레이 개선

- [ ] 공 발사 로직 튜닝 (속도, 각도)
- [ ] 플리퍼 조작 구현 (좌/우 독립 제어)
- [ ] 장애물/벽 추가
- [ ] 점수 획득 규칙 추가 (충돌 시 보너스 등)
- [ ] 기본 UX 개선 (게임 오버 화면, 리스타트 버튼 등)

---

## 6. CI/CD

- [ ] GitHub Actions에서 테스트 실행 워크플로우 작성
- [ ] main 브랜치 머지 시 자동 빌드/배포 설정
- [ ] 배포 대상 선택 (GitHub Pages / Firebase Hosting / 기타)
- [ ] 실패 시 알림/로그 확인 절차 정의

---

## 7. 문서 유지보수

- [ ] PRD 업데이트 시 Rules/Checklist/Skills 검토
- [ ] Rules 변경 시 기존 코드/워크플로우와의 정합성 확인
- [ ] MCP 목록(mcp.md) 최신 상태 유지

---

## 8. 향후 아이디어

- [ ] TypeScript 도입 여부 검토
- [ ] 게임 내 튜토리얼/도움말을 Gemini로 생성하는 기능
- [ ] 멀티 모듈(MCP 스타일) 구조 확장 – 예: analytics, config management
