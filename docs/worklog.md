# Mark9 개발 워크로그

## 2026-02-27 — Phase 4: Git 연동, KaTeX, 커맨드 팔레트, Export, Desktop 통합

### 완료 항목

#### Git 연동 (`packages/plugin-git`)
- `isomorphic-git` + `LightningFS`로 브라우저 내 Git 구현
- StatusBar에 현재 브랜치명 동적 표시
- 사이드바 파일 트리에 상태 뱃지 (M: 수정, A: 추가, D: 삭제, U: 추적안됨)
- 파일 편집 시 LightningFS에 기록하여 Git 추적 + 자동 갱신
- Git 기본 작업: `init`, `status`, `stage`, `unstage`, `commit`, `log`, `branch`, `checkout`
- 리모트 작업: `clone`, `push`, `pull` (CORS 프록시 + 토큰 필요)
- Diff 조회: HEAD vs workdir 비교

#### KaTeX 수식 렌더링 (`math-plugin.ts`)
- ProseMirror Decoration 기반 플러그인
- `$...$` 인라인 수식, `$$...$$` 블럭 수식 지원
- Typora-style UX: 렌더링 표시 ↔ 커서 진입 시 raw 소스 노출
- 렌더링된 수식 클릭 시 커서를 수식 내부로 이동하여 편집 모드 진입
- 에러 시 `throwOnError: false`로 안전 처리

#### 커맨드 팔레트 (`CommandPalette.tsx`, `command-store.ts`)
- `Cmd+Shift+P`로 열기, 퍼지 검색 지원
- 12개 커맨드 등록 (에디터/파일/뷰/테마/Git/Export)
- Zustand 스토어: `registerCommand`, `searchCommands`, `open`/`close`
- 키보드 네비게이션 (↑↓ 이동, Enter 실행, Esc 닫기)
- 카테고리 뱃지 + 단축키 힌트 표시

#### Export (`packages/plugin-export`)
- **HTML**: unified + remark-gfm + remark-math + rehype-katex → standalone HTML (GitHub 스타일 CSS 포함)
- **PDF**: HTML 렌더 후 hidden iframe에서 `window.print()` 호출
- **DOCX**: `docx` 패키지로 마크다운 AST → Word 문서 변환 (heading, bold, italic, strikethrough, code, list, table, blockquote 지원)
- `ExportDialog` UI 컴포넌트: 포맷 선택 + 내보내기 실행

#### 데스크톱 통합 (Electrobun)
- `packages/core/platform`: `isDesktop()`, `isWeb()` 플랫폼 감지 유틸
- `apps/desktop/src/renderer/rpc-client.ts`: 타입 안전 RPC 클라이언트
  - FS 작업: `readFile`, `writeFile`, `readDir`, `exists`, `mkdir`
  - Git 작업: `gitIsRepo`, `gitStatus`, `gitCurrentBranch`, `gitLog`, `gitStage`, `gitCommit`
  - Window 작업: `setWindowTitle`
  - 이벤트: `onMenuAction`, `onFSWatch`
  - 에디터 상태 알림: `notifyEditorReady`, `notifyContentChanged`
- 웹 환경에서는 모든 RPC 함수가 no-op으로 동작 (graceful fallback)

#### Collab 수정 (Phase 3 잔여)
- `synced` 상태 추적: 호스트는 항상 synced, 참여자는 Yjs 초기 동기화 완료 후 synced
- 협업 모드에서 Source 에디터 읽기 전용 처리
- `defaultValueCtx` 항상 설정되도록 수정

---

### 남은 과제

#### 오류 수정 (Critical)

- [ ] **코드블럭 Enter 키 오류**: 코드블럭 내에서 Enter를 누르면 작성 중인 내용과 코드블럭 전체가 삭제되는 현상
- [ ] **코드블럭 괄호 자동완성 미작동**: `handleCodeBlockKeyDown` 핸들러 DOM 이벤트 레벨 동작 검증 필요

#### 기능 개선

- [ ] 플러그인 API 설계
- [ ] 데스크톱 앱 창 드래그 동작 재검증 (Electrobun 환경)
- [ ] 실시간 협업 end-to-end 동기화 검증 (Phase 3에서 WIP 상태)
- [ ] DOCX Export 테이블 지원 개선 (현재 탭 구분 텍스트로 단순화)
- [ ] Git 리모트 push/pull CORS 프록시 설정 가이드

---

## 2026-02-26~27 — Phase 3: Yjs 실시간 협업

### 완료 항목

#### 협업 패키지 (`packages/collab`)
- **Yjs CRDT** 기반 실시간 공동 편집 아키텍처
- `WorkspaceManager`: 공유 Y.Doc, 파일별 XmlFragment (`doc:<filePath>`)
  - Y.Map 기반 파일 트리 동기화, 프레젠스(현재 편집 파일), 메타(호스트 정보) 관리
  - y-websocket + y-indexeddb 오프라인 퍼시스턴스
- `collab-store` (Zustand): 세션 생명주기 관리
  - `startSession` (호스트), `joinSession` (참여자), `leaveSession`
  - `kickUser` (호스트 전용, awareness 메시지 기반)
  - `regenerateSession` (방 코드 재생성)
  - localStorage 유저명 자동 저장/복원
- `useCollab` 훅: 세션 시작/참여/종료 로직 래핑
- `useCollabFile` 훅: 파일별 XmlFragment 바인딩
- `useAwareness` 훅: 접속 유저 awareness 상태 추적

#### 협업 UI 컴포넌트
- `CollabToolbar`: 호스트 시작, 참여자 참여, 방 코드 표시/복사, 종료
- `JoinDialog`: 방 코드 입력 + 유저명 설정 다이얼로그
- `UserAvatars`: 접속 유저 아바타 (이니셜 + 컬러)
- `UserList`: 접속 유저 목록 (현재 편집 파일 표시)
- `ConnectionStatus`: 연결 상태 인디케이터 (connected / connecting / disconnected)

#### 협업 서버 (`apps/server`)
- Hono + Bun WebSocket 서버 (포트 4444)
- y-websocket `setupWSConnection` 브릿지 (Bun WS → Node ws 어댑터)
- 방 관리: 자동 생성/정리, `/health`, `/rooms/:roomId` API
- 유휴 방 자동 정리 (cleanup interval)

#### 기존 UI 통합
- Sidebar에 Collab 탭 추가
- StatusBar에 연결 상태 인디케이터
- EditorToolbar에 유저 아바타 표시
- DualEditor / Mark9Editor에 `collabConfig` prop 전달
- CSP 업데이트 (WebSocket 연결 허용)

---

### Known Issues (Phase 3)

- 실시간 편집 동기화 end-to-end 미검증 (WIP)
- 협업 모드에서 Preview 깨짐

---

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

### 남은 과제 (Phase 2 시점)

#### 오류 수정 (Critical)

- [ ] **코드블럭 Enter 키 오류**: 코드블럭 내에서 Enter를 누르면 작성 중인 내용과 코드블럭 전체가 삭제되는 현상
- [ ] **코드블럭 괄호 자동완성 미작동**: `handleCodeBlockKeyDown` 핸들러 DOM 이벤트 레벨 동작 검증 필요

#### 기능 개선 (Phase 2 잔여 → Phase 4에서 해결)

- [x] KaTeX 수식 렌더링 → Phase 4에서 `math-plugin.ts`로 구현
- [x] Export (PDF, HTML) → Phase 4에서 `plugin-export` 패키지로 구현 (+ DOCX 추가)
- [ ] 플러그인 API 설계
- [ ] 데스크톱 앱 창 드래그 동작 재검증 (Electrobun 환경)
