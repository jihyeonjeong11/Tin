# ADR-001: 인증 아키텍처 결정

- **날짜**: 2026-03-31
- **상태**: 결정됨 (MVP 기준)

## 배경

Express 백엔드(better-auth + bearer 플러그인)와 Next.js 프론트엔드가 분리된 구조에서 인증 관련 두 가지 문제가 발생했다.

### 문제 1: 레이스 컨디션

로그인 성공 후 `/home`으로 이동 시 HomeLayout이 마운트되는 시점에 `useSession()` 내부 캐시가 아직 갱신되지 않아 `session: null`을 반환하고 다시 `/login`으로 리다이렉트되는 현상.

**원인**: better-auth의 `useSession()`은 쿠키 기반으로 설계되어 있고, Bearer + localStorage 조합에서는 `signIn.email()` 후 내부 store가 즉시 갱신되지 않는다.

**임시 조치**: `router.push()` 대신 `window.location.href` 사용. 전체 페이지 리로드로 React/better-auth 캐시를 초기화한다.

### 문제 2: 크로스 오리진 쿠키

Railway의 `.up.railway.app` 도메인은 [Public Suffix List](https://publicsuffix.org/)에 등재되어 있어 `tinfrontend.up.railway.app`과 `tinbackend.up.railway.app` 간 쿠키 공유가 구조적으로 불가능하다. 이 때문에 쿠키 기반 세션으로 전환하더라도 Railway 기본 도메인에서는 동작하지 않는다.

## 고려한 옵션

### A. Next.js 풀스택으로 통합

Express를 제거하고 Next.js API Routes + Server Actions + better-auth Next.js 핸들러로 전환.

- 장점: same origin → 쿠키 문제 해결, middleware.ts로 서버사이드 auth guard, Railway 배포 1개
- 단점: 모노레포 구조가 의미 없어짐, Express 코드 마이그레이션 필요

### B. React SPA로 프론트 교체

Next.js를 Vite + React Router로 교체. 현재 프론트가 사실상 전부 `'use client'`이므로 Next.js를 라우터로만 쓰는 상황과 다르지 않다.

- 장점: 구조가 솔직해짐 (순수 SPA + REST API)
- 단점: 크로스 오리진 문제는 그대로

### C. 커스텀 도메인으로 쿠키 전환 (채택 예정)

Cloudflare에 보유한 도메인을 활용해 프론트/백엔드를 같은 registrable domain의 서브도메인으로 배포.

```
tin.yourdomain.com    → Railway 프론트 (Next.js)
api.yourdomain.com    → Railway 백엔드 (Express)
```

`Domain=.yourdomain.com` 쿠키가 두 서브도메인에서 공유된다. bearer 플러그인 제거 후 쿠키 기반으로 전환하면 레이스 컨디션도 근본적으로 해결된다.

### D. 현재 구조 유지 (Bearer + localStorage)

- 장점: 변경 없음
- 단점: 레이스 컨디션 임시 조치(`window.location.href`)로만 버팀, 보안상 localStorage 토큰은 XSS에 노출

## 결정

**MVP 단계**: 현재 구조(Bearer + localStorage) 유지, `window.location.href` 임시 조치 적용.

**커스텀 도메인 연결 후**: 옵션 C 적용 — 쿠키 기반으로 전환하고 Next.js middleware.ts에서 서버사이드 auth guard 구현.

**아키텍처 재검토는 템플릿 단계에서**: 모노레포 구조 유지 여부, Next.js 풀스택 전환 여부는 MVP 완성 후 결정.

## 참고

- [Railway 크로스 도메인 쿠키 이슈](https://station.railway.com/questions/cross-domain-cookies-on-preview-65c2b01e)
- [Public Suffix List](https://publicsuffix.org/)
