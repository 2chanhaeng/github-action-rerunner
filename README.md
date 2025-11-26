# GitHub Action Rerunner

[바로 가기 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1em; height: 1em;"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>](https://github-action-rerunner.vercel.app)

실패한 GitHub Actions를 팀원들이 직접 재실행할 수 있도록 권한을 위임하는 웹
애플리케이션입니다.

## 🎯 왜 만들었나요?

GitHub Actions가 실패했을 때, 재실행하려면 해당 레포지토리에 대한 Write 권한이
필요합니다. 하지만 보안상의 이유로 모든 팀원에게 Write 권한을 주기는 어렵습니다.

**GitHub Action Rerunner**는 이 문제를 해결합니다. 레포지토리 소유자가 토큰을
등록하면, 팀원들은 **자신에게 할당된 PR**의 실패한 Action만 재실행해
레포지토리에 대한 직접적인 권한 없이도 CI/CD를 다시 돌릴 수 있습니다!

## ✨ 주요 기능

### 레포지토리 소유자 (Owner)

- 📦 개인 및 조직 레포지토리 등록
- 🔑 GitHub Personal Access Token 등록 (암호화 저장)
- 🔗 공유 가능한 고유 링크 생성
- 👀 모든 실패한 PR 확인 및 재실행
- ⚙️ 레포지토리 설정 관리

### 팀원 (Assignee)

- 📋 자신에게 할당된 PR 목록 확인
- 🔄 실패한 GitHub Action 원클릭 재실행
- 📊 워크플로우 상태 실시간 확인

### 계정 관리

- 🔐 GitHub OAuth 로그인
- 👥 여러 GitHub 계정 연동 지원
- 🔀 계정 간 쉬운 전환

## 🛠 기술 스택

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Authentication**: NextAuth.js v5 (GitHub OAuth)
- **Database**: PostgreSQL + Prisma ORM
- **GitHub API**: Octokit

## 🚀 직접 배포하기

현재 프로젝트는 이미
[배포되어 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1em; height: 1em;"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>](https://github-action-rerunner.vercel.app)
있으나, 민감한 토큰을 다루기 때문에 직접 배포하시고 싶다면 아래 가이드를
참고하세요.

### 1. 환경 변수 설정

`.env` 파일을 생성하고 다음 값을 설정하세요:

```env
# DB (PostgreSQL)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth.js
AUTH_SECRET="use `npx auth secret`"
AUTH_GITHUB_ID="your-github-oauth-app-id"
AUTH_GITHUB_SECRET="your-github-oauth-app-secret"

# Token Encryption (32자)
ENCRYPTION_KEY="your-32-character-encryption-key"
```

### 2. GitHub OAuth App 생성

1. [GitHub Developer Settings](https://github.com/settings/developers)에서 OAuth
   App 생성
2. **Authorization callback URL**:
   `http://localhost:3000/api/auth/callback/github`
3. Client ID와 Client Secret을 환경 변수에 설정

### 3. 개발 서버 실행

```bash
# 의존성 설치
pnpm install

# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma migrate dev

# 개발 서버 실행
pnpm dev
```

[http://localhost:3000](http://localhost:3000)에서 확인하세요.

## 📖 사용 방법

### 레포지토리 등록 (소유자)

1. GitHub으로 로그인
2. 대시보드 → 레포지토리 등록
3. 등록할 레포지토리 선택
4. 설정 페이지에서 Personal Access Token 등록
   - Token에 `repo` 및 `actions` 권한 필요
5. 생성된 링크를 팀원들과 공유

### Action 재실행 (팀원)

1. 공유받은 링크로 접속
2. GitHub으로 로그인
3. 자신에게 할당된 PR 목록 확인
4. 실패한 워크플로우 옆 "Rerun" 버튼 클릭

## 🔒 보안

- Personal Access Token은 AES-256-GCM으로 암호화되어 저장됩니다
- 팀원은 자신에게 할당된 PR의 Action만 재실행할 수 있습니다
- 모든 API 요청은 세션 기반 인증을 거칩니다

## 📁 프로젝트 구조

```text
├── app/
│   ├── api/              # API 라우트
│   │   ├── accounts/     # 계정 관리 API
│   │   ├── auth/         # NextAuth.js
│   │   ├── github/       # GitHub 레포지토리 조회
│   │   └── repositories/ # 레포지토리 CRUD, PR 조회, Rerun
│   ├── dashboard/        # 대시보드 페이지
│   │   └── register/     # 레포지토리 등록
│   └── r/[slug]/         # 레포지토리 상세 페이지
│       └── config/       # 설정 페이지 (소유자 전용)
├── components/           # 공통 컴포넌트
├── lib/                  # 유틸리티
│   ├── encryption.ts     # 토큰 암호화
│   └── github.ts         # GitHub API 헬퍼
└── prisma/               # 데이터베이스 스키마
```
