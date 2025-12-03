# Pinball Sample Project

Firestore 리더보드 + Gemini API + GitHub Actions 배포 구조를 실험하기 위한 샘플 프로젝트입니다.

- 순수 JS + Canvas 기반 핀볼 게임 (간단 버전)
- Firestore를 통한 리더보드 관리 (`src/services/firestoreService.js`)
- Gemini API 연동용 서비스 레이어 (`src/services/geminiService.js`)
- 외부 서비스는 모두 `services/` 디렉토리에서만 직접 호출
- PRD, Rules, Skills, Checklist, MCP 문서는 `docs/`에 위치

## 사용 방법 (요약)

1. 이 레포를 GitHub에 올립니다.
2. Firestore / Gemini API 키를 GitHub Action Secrets에 등록합니다.
3. `docs/PRD.md`를 보면서 Jules 또는 다른 AI에게
   > "PRD.md 보고 구현해줘"
   와 같은 프롬프트로 개발을 진행합니다.
4. 배포는 `.github/workflows`에 GitHub Actions 워크플로우를 추가하여 진행합니다 (현재는 샘플만 포함).

자세한 내용은 `docs/` 폴더를 참고하세요.


## Prompt 모음

- `docs/prompt.md`에 Jules/ChatGPT/Claude/Gemini에게 쓰기 좋은 예시 프롬프트들을 정리해 두었습니다.
- 레포를 처음 열 때는 이 파일과 PRD/Rules/skills/mcp를 먼저 읽도록 지시하면 좋습니다.
