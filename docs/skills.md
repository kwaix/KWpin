# Skills (AI Assistant Skills)

Claude의 **skills** 개념을 참고하여,  
이 프로젝트에서 AI 도구(Jules, ChatGPT, Claude, Gemini 등)가 수행하기 좋은 작업 단위를 정의한다.

각 Skill은 “무엇을 입력받아 어떤 산출물을 내야 하는지”에 초점을 맞춘다.

---

## Skill: implement_feature_from_prd

- **설명**: PRD.md의 특정 섹션을 기반으로 실제 코드를 작성하거나 수정하는 작업
- **입력**:
  - PRD 섹션 이름 (예: "7. 리더보드 (Firestore)")
  - 현재 코드 스냅샷 (관련 파일들)
- **출력**:
  - 변경이 필요한 파일 목록
  - 각 파일별 변경 diff 또는 코드 블록
  - 간단한 변경 요약

---

## Skill: update_docs_for_change

- **설명**: 코드 변경에 따라 PRD/Rules/Checklist 등을 동기화
- **입력**:
  - 변경된 코드 내용
  - 영향 받을 수 있는 문서 목록
- **출력**:
  - 수정 제안이 반영된 Markdown 텍스트
  - 문서 내 변경 포인트 설명

---

## Skill: design_service_boundary

- **설명**: 새로운 외부 서비스(API, DB 등)를 도입할 때, `services/` 레이어에 어떤 인터페이스로 추가할지 설계
- **입력**:
  - 도입하려는 서비스 개요 (예: "새로운 분석용 API")
  - 현재 디렉토리 구조 및 services/* 내용
- **출력**:
  - 새 서비스 파일 예시 (예: `analyticsService.js`)
  - 외부 서비스 교체 전략 (예: Firestore → Supabase 전환 시 고려사항)

---

## Skill: refactor_game_logic

- **설명**: 게임 로직(`src/game/`)을 성능/가독성/테스트 용이성 측면에서 개선
- **입력**:
  - 기존 game/* 코드
  - 목표 (예: “Physics 분리 강화”, “플리퍼 제어를 독립 모듈로”)
- **출력**:
  - 리팩터링된 코드 제안
  - 변경 이유 및 장단점 설명

---

## Skill: add_test_with_mocks

- **설명**: 외부 서비스를 mock 처리한 unit test 추가
- **입력**:
  - 테스트 대상 함수/모듈 이름 (예: `firestoreService.submitScore`)
  - 사용 중인 테스트 프레임워크 (Jest, node:test 등)
- **출력**:
  - 테스트 코드 예시
  - mock 전략 설명 (unittest.mock 스타일 개념을 JS에 맞게 적용)

---

## Skill: review_pull_request

- **설명**: PR의 변경사항을 리뷰하고, 규칙 위반이나 리팩터링 포인트를 제안
- **입력**:
  - PR diff
  - 관련 PRD/Rules/Checklist 섹션
- **출력**:
  - 리뷰 코멘트 목록
  - 필요한 수정/추가 작업 요약

---

## Skill: plan_next_iteration

- **설명**: 현재 상태와 PRD를 기준으로 다음 이터레이션에 할 일을 제안
- **입력**:
  - 현재 구현 상태 요약
  - 남은 PRD 항목
- **출력**:
  - 우선순위가 매겨진 작업 목록
  - 각 작업에 대응되는 파일/모듈 정보
