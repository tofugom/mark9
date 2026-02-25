# Mark9 개발 워크로그

## 2026-02-26 — Phase 2: Mermaid, 테마, 코드블럭 강화

### 완료 항목

#### Mermaid 다이어그램 (Typora-style UX)
- `MermaidNodeView` 구현: 코드(상단) + 다이어그램(하단) 레이아웃
- 클릭 시 mermaid 코드 편집 활성화, 커서 이탈 시 코드 숨김
- DOMPurify를 이용한 SVG XSS 방지
- 렌더링 debounce (300ms), 에러 시 마지막 유효 SVG 유지

#### 코드블럭 강화 (CodeBlockNodeView)
- highlight.js 기반 구문 하이라이팅 (35+ 언어 등록)
- 편집 모드 / 미리보기 모드 전환 (Typora-style)
- 언어 라벨 표시 (우측 하단) + 인라인 자동완성 드롭다운
- 코드 복사 버튼 (우측 상단)
- 빈 코드블럭 생성 시 자동 편집 모드 진입

#### 키보드 핸들링 (handleCodeBlockKeyDown)
- Enter → 줄바꿈 (`\n` 삽입)
- Tab → 2칸 스페이스
- 괄호/따옴표 자동완성: `()`, `[]`, `{}`, `""`, `''`
- 닫는 괄호/따옴표 skip-over
- Backspace로 인접 괄호쌍 동시 삭제
- `handleDOMEvents.keydown`으로 Milkdown 내장 키맵보다 우선 처리

#### 테마 (Typora GitHub-style)
- Light / Dark / Sepia 3종 테마 완전 재작성
- GitHub 스타일 사이드바, 타이틀바, 에디터 배경색
- highlight.js 구문 색상 (GitHub 컬러 스킴)

#### UI 개선
- Save 버튼: 수정 시 활성화(파란색), 저장 후 비활성화 + "Saved" 메시지 (2초)
- StatusBar에도 저장 완료 메시지 표시
- EditorToolbar, StatusBar 컴포넌트 개선

#### 데스크톱 앱 (Electrobun)
- `apps/desktop` Electrobun 설정 및 빌드
- macOS 트래픽 라이트 간격 (78px spacer)
- 창 드래그: `.electrobun-webkit-app-region-drag` 클래스 적용
- `electrobun.d.ts` 타입 선언 정리

---

### 남은 과제

#### 오류 수정 (Critical)

- [ ] **코드블럭 Enter 키 오류**: 코드블럭 내에서 Enter를 누르면 작성 중인 내용과 코드블럭 전체가 삭제되는 현상 발생. `handleDOMEvents.keydown`으로 우선순위를 높였으나 실제 동작 검증 필요. Playwright 테스트 작성 후 수정 필요.
- [ ] **코드블럭 괄호 자동완성 미작동**: `()`, `[]`, `{}` 괄호 자동완성이 실제로 동작하지 않음. `handleCodeBlockKeyDown` 핸들러가 DOM 이벤트 레벨에서 정상 실행되는지 확인 및 수정 필요. Playwright 테스트 작성 후 수정 필요.

#### 기능 개선 (Phase 2 잔여)

- [ ] KaTeX 수식 렌더링
- [ ] 플러그인 API 설계
- [ ] Export (PDF, HTML)
- [ ] 데스크톱 앱 창 드래그 동작 재검증 (Electrobun 환경)
