# GitHub Action Rerunner - 개발 체크리스트

## 1. 프로젝트 설정

- [x] 필요한 패키지 설치 (next-auth, prisma, octokit 등)
- [x] 환경 변수 설정 (.env.example 생성)
- [x] Prisma 스키마 정의

## 2. 인증 시스템

- [x] NextAuth.js 설정 (GitHub OAuth)
- [x] 로그인/로그아웃 UI 구현

## 3. 데이터베이스 모델

- [x] User 모델 (GitHub 사용자 정보)
- [x] Repository 모델 (등록된 레포지토리)
- [x] 데이터베이스 마이그레이션

## 4. 레포지토리 관리

- [x] 사용자의 GitHub 레포지토리 목록 조회 API
- [x] 레포지토리 등록 페이지 및 API
- [x] 레포지토리 페이지 경로 생성 (랜덤 slug)
- [x] 레포지토리 페이지 경로 변경 기능

## 5. 토큰 관리

- [x] 레포지토리 토큰 등록 API
- [x] 토큰 암호화 저장

## 6. PR 및 GitHub Actions 기능

- [x] 담당자의 Open PR 목록 조회 API
- [x] PR의 실패한 GitHub Action 조회
- [x] 실패한 Action 재실행 API

## 7. UI 구현

- [x] 홈페이지 (로그인 버튼)
- [x] 대시보드 (레포지토리 목록)
- [x] 레포지토리 페이지 (소유자 뷰)
- [x] 레포지토리 페이지 (담당자 뷰)
- [x] PR 목록 및 Rerun 버튼
