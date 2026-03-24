# 사내 게시판 시스템 설계 문서

> This prompt is designed according to the official Claude Code guidelines:
> - **Sub-Agents**: https://code.claude.com/docs/en/sub-agents
> - **Skills**: https://code.claude.com/docs/en/skills

## 프로젝트 개요

사내 직원들이 자유롭게 소통할 수 있는 웹 기반 게시판 시스템을 구축합니다. Google OAuth를 통한 인증, 익명 게시 기능, 댓글 및 좋아요 기능을 포함한 완전한 커뮤니티 플랫폼을 개발합니다.

## 파일 구조

```
fc-idea-board/
├── .claude/
│   ├── agents/
│   │   ├── project-manager.md
│   │   ├── database-architect.md
│   │   ├── backend-developer.md
│   │   ├── ui-designer.md
│   │   ├── frontend-developer.md
│   │   ├── qa-specialist.md
│   │   └── final-reviewer.md
│   ├── skills/
│   │   ├── react-component-generator/
│   │   ├── api-endpoint-creator/
│   │   └── database-schema-builder/
│   └── CLAUDE.md
├── outputs/
│   ├── management/
│   ├── database/
│   ├── backend/
│   ├── design/
│   ├── frontend/
│   ├── testing/
│   ├── review/
│   └── documentation/
└── src/
```

## 멀티 에이전트 협업 구조

### 에이전트 협업 플로우
```
[Project Manager] → [Database Architect] → [Backend Developer] 
                                        ↓
[QA Specialist] ← [Frontend Developer] ← [UI Designer]
      ↓
[Final Reviewer]
```

## 에이전트 상세 스펙

### 1. Project Manager Agent (지휘자)

- **name**: project-manager
- **description**: MUST BE USED at project start and for coordinating all development phases and agent collaboration
- **tools**: 
  - file operations (read, write, edit)
  - task coordination
  - progress tracking
- **model**: sonnet
- **주요 기능**:
  - 전체 프로젝트 계획 수립 및 관리
  - 에이전트 간 작업 분배 및 조율
  - 개발 단계별 진행 상황 모니터링
  - 요구사항 분석 및 우선순위 설정
  - 에이전트 간 커뮤니케이션 중재
- **협업 대상**: 모든 에이전트와 직접 소통
- **출력 파일 경로**: `outputs/management/`

### 2. Database Architect Agent (Supabase MCP 연동)

- **name**: database-architect
- **description**: MUST BE USED for database schema design, migrations, and Supabase integration tasks
- **tools**:
  - file operations
  - **Supabase MCP** (데이터베이스 관리)
  - schema validation
- **model**: sonnet
- **주요 기능**:
  - Supabase 데이터베이스 스키마 설계
  - 실시간 구독 기능 구현
  - Row Level Security (RLS) 정책 설정
  - 관계형 데이터 모델링 (User, Post, Comment, Like)
  - Supabase Auth 연동 설계
- **협업 대상**: Project Manager → Backend Developer
- **출력 파일 경로**: `outputs/database/`

### 3. Backend Developer Agent

- **name**: backend-developer
- **description**: USE PROACTIVELY for API development, authentication, and server-side logic implementation
- **tools**:
  - file operations
  - shell commands for package management
  - Supabase client integration
- **model**: sonnet
- **주요 기능**:
  - RESTful API 엔드포인트 개발
  - Supabase 클라이언트 연동
  - Google OAuth + Supabase Auth 구현
  - 서버리스 함수 개발
  - 익명 게시 로직 구현
  - 실시간 기능 구현 (댓글, 좋아요)
- **협업 대상**: Database Architect → Frontend Developer
- **출력 파일 경로**: `outputs/backend/`

### 4. UI Designer Agent (Monet MCP 연동)

- **name**: ui-designer
- **description**: USE PROACTIVELY for UI/UX design, visual assets creation, and design system development
- **tools**:
  - file operations
  - **Monet MCP** (디자인 자산 생성)
  - design system management
- **model**: sonnet
- **주요 기능**:
  - 모던하고 직관적인 UI 디자인
  - 디자인 시스템 및 컴포넌트 라이브러리 구축
  - 아이콘, 이미지 등 시각적 자산 생성
  - 반응형 레이아웃 설계
  - 접근성 고려사항 구현
- **협업 대상**: Backend Developer → Frontend Developer
- **출력 파일 경로**: `outputs/design/`

### 5. Frontend Developer Agent

- **name**: frontend-developer
- **description**: MUST BE USED for all React/Next.js frontend development tasks including components, pages, and styling
- **tools**: 
  - file operations (read, write, edit)
  - web search for latest React patterns
  - Supabase client integration
- **model**: sonnet
- **주요 기능**:
  - React 컴포넌트 개발 (게시글, 댓글, 좋아요 등)
  - Next.js 페이지 라우팅 구현
  - Tailwind CSS를 활용한 반응형 UI 개발
  - Supabase 클라이언트 연동
  - 실시간 데이터 구독 구현
  - 상태 관리 (Zustand + Supabase)
- **협업 대상**: UI Designer → QA Specialist
- **출력 파일 경로**: `outputs/frontend/`

### 6. QA Specialist Agent (Playwright MCP 연동)

- **name**: qa-specialist
- **description**: MUST BE USED for all testing, quality assurance, and automated testing implementation
- **tools**:
  - file operations
  - **Playwright MCP** (E2E 테스팅)
  - browser automation
  - test reporting
- **model**: sonnet
- **주요 기능**:
  - E2E 테스트 시나리오 작성 및 실행
  - 단위 테스트 및 통합 테스트 구현
  - 브라우저 호환성 테스트
  - 성능 테스트 및 최적화 제안
  - 접근성 테스트 수행
  - 버그 리포트 및 품질 개선 제안
- **협업 대상**: Frontend Developer → Final Reviewer
- **출력 파일 경로**: `outputs/testing/`

### 7. Final Reviewer Agent (검수자)

- **name**: final-reviewer
- **description**: MUST BE USED for final code review, security audit, and deployment readiness assessment
- **tools**:
  - file operations
  - code analysis
  - security scanning
  - performance analysis
- **model**: sonnet
- **주요 기능**:
  - 전체 코드베이스 품질 검토
  - 보안 취약점 분석 및 개선 제안
  - 성능 최적화 검토
  - 배포 준비 상태 점검
  - 문서화 완성도 검토
  - 최종 승인 및 배포 권고
- **협업 대상**: QA Specialist → Project Manager (최종 보고)
- **출력 파일 경로**: `outputs/review/`

## 스킬 상세 스펙

### 1. React Component Generator Skill

- **경로**: `.claude/skills/react-component-generator/`
- **기능**: 게시판 관련 React 컴포넌트 자동 생성
- **포함 컴포넌트**:
  - PostCard (게시글 카드)
  - CommentSection (댓글 영역)
  - LikeButton (좋아요 버튼)
  - AnonymousToggle (익명 토글)
  - SortDropdown (정렬 드롭다운)

### 2. API Endpoint Creator Skill

- **경로**: `.claude/skills/api-endpoint-creator/`
- **기능**: RESTful API 엔드포인트 자동 생성
- **포함 엔드포인트**:
  - `/api/auth/*` (인증 관련)
  - `/api/posts/*` (게시글 CRUD)
  - `/api/comments/*` (댓글 CRUD)
  - `/api/likes/*` (좋아요 관리)

### 3. Database Schema Builder Skill

- **경로**: `.claude/skills/database-schema-builder/`
- **기능**: 데이터베이스 스키마 및 마이그레이션 파일 생성
- **포함 테이블**: User, Post, Comment, Like

## 출력 폴더 구조

```
outputs/
├── management/
│   ├── project-plan.md
│   ├── task-assignments.md
│   ├── progress-reports.md
│   └── agent-coordination.md
├── database/
│   ├── supabase/
│   │   ├── schema.sql
│   │   ├── rls-policies.sql
│   │   ├── functions/
│   │   └── triggers/
│   ├── migrations/
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_posts.sql
│   │   ├── 003_create_comments.sql
│   │   └── 004_create_likes.sql
│   └── seed-data.sql
├── backend/
│   ├── api/
│   │   ├── auth.ts
│   │   ├── posts.ts
│   │   ├── comments.ts
│   │   └── likes.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── middleware/
│   │   └── auth.ts
│   └── types/
│       └── database.types.ts
├── design/
│   ├── design-system/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── components.ts
│   ├── assets/
│   │   ├── icons/
│   │   ├── images/
│   │   └── logos/
│   └── mockups/
│       ├── desktop/
│       └── mobile/
├── frontend/
│   ├── components/
│   │   ├── PostCard.tsx
│   │   ├── CommentSection.tsx
│   │   ├── LikeButton.tsx
│   │   └── AnonymousToggle.tsx
│   ├── pages/
│   │   ├── index.tsx (게시글 목록)
│   │   ├── post/[id].tsx (게시글 상세)
│   │   └── write.tsx (게시글 작성)
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePosts.ts
│   │   └── useRealtime.ts
│   ├── stores/
│   │   └── authStore.ts
│   └── utils/
│       └── supabase.ts
├── testing/
│   ├── e2e/
│   │   ├── auth.spec.ts
│   │   ├── posts.spec.ts
│   │   ├── comments.spec.ts
│   │   └── likes.spec.ts
│   ├── unit/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── integration/
│   │   └── api/
│   └── reports/
│       ├── coverage/
│       └── performance/
├── review/
│   ├── code-review-reports/
│   ├── security-audit.md
│   ├── performance-analysis.md
│   ├── deployment-checklist.md
│   └── final-approval.md
└── documentation/
    ├── api-docs.md
    ├── deployment-guide.md
    ├── user-manual.md
    └── agent-collaboration-log.md
```

## 기술 스택 및 MCP 연동

### 핵심 기술 스택
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase Functions
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + Google OAuth 2.0
- **Deployment**: Vercel (Full-stack)

### MCP 연동 구성
- **Database Architect**: Supabase MCP
  - 실시간 데이터베이스 관리
  - Row Level Security 설정
  - 스키마 마이그레이션 자동화
- **UI Designer**: Monet MCP
  - 디자인 자산 자동 생성
  - 아이콘 및 이미지 생성
  - 디자인 시스템 관리
- **QA Specialist**: Playwright MCP
  - E2E 테스트 자동화
  - 브라우저 호환성 테스트
  - 성능 및 접근성 테스트

## 멀티 에이전트 개발 단계

### Phase 1: 프로젝트 초기화 및 설계
- **Project Manager**: 전체 계획 수립 및 요구사항 분석
- **Database Architect**: Supabase 스키마 설계 (MCP 활용)
- **UI Designer**: 디자인 시스템 구축 (Monet MCP 활용)

### Phase 2: 백엔드 개발
- **Backend Developer**: Supabase 연동 및 API 개발
- **Database Architect**: RLS 정책 및 실시간 구독 설정
- **QA Specialist**: API 테스트 시나리오 작성

### Phase 3: 프론트엔드 개발
- **Frontend Developer**: React 컴포넌트 및 페이지 개발
- **UI Designer**: 컴포넌트 스타일링 및 반응형 구현
- **QA Specialist**: E2E 테스트 구현 (Playwright MCP 활용)

### Phase 4: 통합 테스트 및 품질 검증
- **QA Specialist**: 전체 시스템 테스트 및 성능 검증
- **Final Reviewer**: 코드 품질 검토 및 보안 감사
- **Project Manager**: 최종 배포 준비 및 조율

### Phase 5: 배포 및 최종 검수
- **Final Reviewer**: 배포 준비 상태 점검 및 최종 승인
- **Project Manager**: 배포 실행 및 프로젝트 완료 보고

## 보안 고려사항

- Google OAuth 2.0을 통한 안전한 인증
- 회사 도메인(@company.com) 계정만 접근 허용
- JWT 토큰 만료 시간 관리
- XSS, CSRF 방어 구현
- 익명 게시글 작성자 정보 보호