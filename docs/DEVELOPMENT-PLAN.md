# Mark9 개발 계획서

> Phase 1 — MVP 개발 계획
> 작성일: 2026-02-25

---

## 1. 개발 전략 개요

Phase 1 MVP의 목표는 **GFM WYSIWYG 편집 + 파일 관리**가 동작하는 Web 앱(alpha)을 완성하는 것입니다.
PRD의 로드맵에 따라 Phase 1에 집중하되, 이후 Phase를 고려한 확장 가능한 구조로 설계합니다.

### 기술 스택 요약

| 영역 | 기술 |
|------|------|
| 모노레포 | Turborepo + pnpm workspaces |
| 에디터 엔진 | Milkdown (ProseMirror 기반) |
| 마크다운 파싱 | remark / unified (GFM) |
| 프론트엔드 | React 19 + TypeScript |
| 빌드 도구 | Vite |
| 스타일링 | Tailwind CSS 4 |
| 상태 관리 | Zustand |
| 테스트 | Vitest + Playwright |

---

## 2. 작업 단계 (Phase 1 세부)

### Step 1: 프로젝트 셋업 (모노레포, CI)

**목표:** 모노레포 구조 구축, 개발 환경 설정, CI 파이프라인

**작업 항목:**

1. **모노레포 초기화**
   - `pnpm` workspace 설정
   - Turborepo 설정 (`turbo.json`)
   - 공통 TypeScript 설정 (`tsconfig.base.json`)
   - ESLint + Prettier 설정

2. **패키지 구조 생성**
   ```
   mark9/
   ├── packages/
   │   ├── core/          # 에디터 코어
   │   └── ui/            # 공유 UI 컴포넌트
   ├── apps/
   │   └── web/           # Web 앱 (Vite + React)
   ├── turbo.json
   ├── pnpm-workspace.yaml
   └── package.json
   ```

3. **Vite + React 19 + TypeScript 앱 부트스트래핑**
   - `apps/web` 에 Vite 프로젝트 생성
   - Tailwind CSS 4 설정
   - 기본 라우팅 (단일 페이지)

4. **CI 파이프라인 (GitHub Actions)**
   - lint, typecheck, test, build 워크플로우

**산출물:** 빌드 가능한 빈 모노레포 + "Hello World" 수준 웹 앱

---

### Step 2: Milkdown 에디터 코어 통합

**목표:** Milkdown 에디터를 React 앱에 통합하고 기본 마크다운 편집 가능

**작업 항목:**

1. **`packages/core` 에디터 모듈 구성**
   - Milkdown 에디터 인스턴스 생성
   - ProseMirror 기본 스키마 설정
   - remark 파서/시리얼라이저 연결

2. **React 컴포넌트 래핑**
   - `<Mark9Editor />` 컴포넌트 구현
   - 에디터 상태를 Zustand 스토어와 연결
   - 문서 변경 콜백 (onChange)

3. **기본 편집 기능**
   - Heading (1-6)
   - Bold, Italic, Strikethrough, Code (인라인)
   - Blockquote
   - Code Block
   - Horizontal Rule
   - 마크다운 단축 입력 (`##` → H2, `>` → blockquote 등)

4. **키보드 단축키**
   - `Ctrl/Cmd + B` (Bold)
   - `Ctrl/Cmd + I` (Italic)
   - `Ctrl/Cmd + K` (Link)

**산출물:** 기본 마크다운 WYSIWYG 편집이 가능한 에디터

---

### Step 3: GFM 파싱 + WYSIWYG 렌더링

**목표:** GitHub Flavored Markdown 확장 문법 완전 지원

**작업 항목:**

1. **GFM 확장 플러그인 (`packages/core/src/plugins/gfm/`)**
   - 테이블 WYSIWYG 에디터 (행/열 추가·삭제, 셀 편집)
   - Task List (체크박스 클릭 토글)
   - Strikethrough (`~~text~~`)
   - Autolink (URL 자동 감지 → 링크 변환)

2. **리스트 개선**
   - 순서 있는 리스트 (1. 2. 3.)
   - 순서 없는 리스트 (- * +)
   - 중첩 리스트 (Tab/Shift+Tab)
   - Task List와 일반 리스트 혼합

3. **마크다운 입출력 정확성**
   - `.md` 파일 로드 → WYSIWYG 렌더링 검증
   - WYSIWYG → `.md` 시리얼라이즈 라운드트립 검증
   - 에지 케이스 테스트 (복잡한 중첩 구조 등)

**산출물:** GFM 완전 지원 WYSIWYG 에디터

---

### Step 4: 소스코드 보기 토글

**목표:** WYSIWYG ↔ 소스코드 모드 전환

**작업 항목:**

1. **소스코드 뷰 (`packages/core/src/plugins/source-view/`)**
   - CodeMirror 6 통합 (마크다운 구문 하이라이팅)
   - Raw 마크다운 텍스트 편집
   - 실시간 구문 하이라이팅

2. **모드 전환 로직**
   - `Ctrl/Cmd + /` 단축키로 토글
   - 전환 시 커서 위치 유지 (최대한)
   - WYSIWYG 상태 → 소스 텍스트 동기화
   - 소스 텍스트 → WYSIWYG 상태 동기화

3. **상태 표시**
   - 현재 모드 표시 (상태바 또는 토글 버튼)

**산출물:** 두 가지 편집 모드 간 원활한 전환

---

### Step 5: 기본 UI (사이드바, 상태바)

**목표:** 에디터 래핑 UI 레이아웃 구현

**작업 항목:**

1. **메인 레이아웃 (`packages/ui/`)**
   - 타이틀 바 (앱명, 파일명, 윈도우 컨트롤)
   - 사이드바 (파일 트리, 토글 가능)
   - 메인 에디터 영역
   - 상태바 (줄/컬럼, 인코딩, GFM 표시)

2. **사이드바 — 파일 트리**
   - 폴더 구조 트리 뷰
   - 파일/폴더 아이콘
   - `.md` 파일 필터링
   - 파일 클릭 → 에디터에서 열기
   - 새 파일/폴더 생성

3. **상태바**
   - 커서 위치 (Ln, Col)
   - 문서 인코딩 (UTF-8)
   - GFM 모드 표시
   - WYSIWYG/Source 모드 표시

4. **툴바 (선택적)**
   - 서식 버튼 (Bold, Italic, Heading 등)
   - Floating toolbar (텍스트 선택 시)

5. **테마 기반 스타일링**
   - Tailwind CSS 4 기반 디자인 토큰 정의
   - Light 테마 기본 적용
   - CSS 변수 기반 구조 (이후 Dark/Sepia 확장 대비)

**산출물:** 완성된 에디터 레이아웃 UI

---

### Step 6: 파일 열기/저장

**목표:** 파일 시스템 연동 (Web 환경)

**작업 항목:**

1. **파일 열기**
   - File System Access API (`showOpenFilePicker`)
   - 드래그 앤 드롭으로 파일 열기
   - 최근 파일 목록 (localStorage)

2. **파일 저장**
   - 수동 저장 (`Ctrl/Cmd + S`)
   - 자동 저장 (설정 가능, 기본 OFF)
   - 다른 이름으로 저장 (`showSaveFilePicker`)

3. **폴더 열기**
   - File System Access API (`showDirectoryPicker`)
   - 폴더 트리 구성 → 사이드바 연동
   - 파일 변경 감지 (FileSystemObserver 또는 polling)

4. **Zustand 파일 상태 관리**
   - 열린 파일 목록
   - 현재 활성 파일
   - 변경 여부 (dirty flag)
   - 파일 저장/로드 액션

**산출물:** 파일 열기/저장/관리가 동작하는 MVP Web 앱

---

## 3. 에이전트 팀 구성

병렬 개발을 위해 다음과 같이 에이전트 팀을 구성합니다:

### Agent 1: Infrastructure (인프라 에이전트)
- **담당:** Step 1 — 모노레포 셋업, 빌드 설정, CI
- **작업 범위:**
  - pnpm workspace + Turborepo 설정
  - 패키지 구조 생성 (core, ui, web)
  - TypeScript, ESLint, Prettier 설정
  - Vite + React 19 앱 부트스트래핑
  - Tailwind CSS 4 설정

### Agent 2: Editor Core (에디터 코어 에이전트)
- **담당:** Step 2 + Step 3 — Milkdown 통합, GFM 지원
- **의존성:** Agent 1 완료 후 시작
- **작업 범위:**
  - Milkdown 에디터 엔진 통합
  - 기본 마크다운 편집 기능
  - GFM 확장 (테이블, Task List, Strikethrough, Autolink)
  - 마크다운 파싱/시리얼라이즈 라운드트립

### Agent 3: Source View (소스뷰 에이전트)
- **담당:** Step 4 — 소스코드 보기 토글
- **의존성:** Agent 2 완료 후 시작
- **작업 범위:**
  - CodeMirror 6 통합
  - WYSIWYG ↔ Source 모드 전환
  - 커서 위치 유지 로직

### Agent 4: UI Shell (UI 셸 에이전트)
- **담당:** Step 5 — 레이아웃, 사이드바, 상태바
- **의존성:** Agent 1 완료 후 시작 (Agent 2와 병렬 가능)
- **작업 범위:**
  - 메인 레이아웃 구현
  - 사이드바 (파일 트리)
  - 상태바
  - Tailwind 기반 테마 토큰

### Agent 5: File System (파일 시스템 에이전트)
- **담당:** Step 6 — 파일 열기/저장
- **의존성:** Agent 4 (UI) + Agent 2 (에디터) 완료 후 시작
- **작업 범위:**
  - File System Access API 연동
  - 파일 열기/저장/관리
  - Zustand 파일 상태 관리
  - 사이드바 파일 트리 연동

### 실행 흐름

```
Agent 1 (Infrastructure)
    ├──→ Agent 2 (Editor Core) ──→ Agent 3 (Source View) ─┐
    └──→ Agent 4 (UI Shell) ─────────────────────────────┤
                                                          └──→ Agent 5 (File System)
```

---

## 4. 품질 기준

### 코드 품질
- TypeScript strict mode
- ESLint + Prettier 자동 포맷팅
- 함수/모듈별 단일 책임 원칙

### 테스트
- 단위 테스트: Vitest (유틸리티, 파서, 시리얼라이저)
- 컴포넌트 테스트: React Testing Library
- E2E 테스트: Playwright (핵심 편집 워크플로우)

### 성능 목표 (Phase 1)
- 초기 로딩: < 2초 (Web)
- 타이핑 지연: < 16ms (60fps)
- 번들 크기: < 3MB (gzip)

---

## 5. 시작 명령

Agent 1 (Infrastructure) 부터 시작하며, 완료 즉시 Agent 2와 Agent 4를 병렬 실행합니다.



```java
public static void main(String[] args){
  
}
```

