---
titleSuffix: Gez 프레임워크 호환성 가이드
description: Gez 프레임워크의 환경 요구사항을 상세히 설명하며, Node.js 버전 요구사항과 브라우저 호환성 정보를 포함하여 개발자가 개발 환경을 올바르게 구성할 수 있도록 돕습니다.
head:
  - - meta
    - property: keywords
      content: Gez, Node.js, 브라우저 호환성, TypeScript, es-module-shims, 환경 설정
---

# 환경 요구사항

이 문서는 본 프레임워크를 사용하기 위한 환경 요구사항을 설명하며, Node.js 환경과 브라우저 호환성을 포함합니다.

## Node.js 환경

프레임워크는 Node.js 버전 >= 22.6을 요구하며, 주로 TypeScript 타입 임포트를 지원하기 위해 사용됩니다 (`--experimental-strip-types` 플래그 사용). 추가 컴파일 단계가 필요하지 않습니다.

## 브라우저 호환성

프레임워크는 기본적으로 호환 모드로 빌드되어 더 넓은 범위의 브라우저를 지원합니다. 그러나 완전한 브라우저 호환성을 위해서는 [es-module-shims](https://github.com/guybedford/es-module-shims) 의존성을 수동으로 추가해야 합니다.

### 호환 모드 (기본)
- 🌐 Chrome: >= 87
- 🔷 Edge: >= 88
- 🦊 Firefox: >= 78
- 🧭 Safari: >= 14

[Can I Use](https://caniuse.com/?search=dynamic%20import) 통계에 따르면, 호환 모드에서의 브라우저 커버리지는 96.81%입니다.

### 네이티브 지원 모드
- 🌐 Chrome: >= 89
- 🔷 Edge: >= 89
- 🦊 Firefox: >= 108
- 🧭 Safari: >= 16.4

네이티브 지원 모드의 장점:
- 런타임 오버헤드 없음, 추가 모듈 로더 불필요
- 브라우저 네이티브 파싱, 더 빠른 실행 속도
- 더 나은 코드 분할 및 필요시 로딩 기능

[Can I Use](https://caniuse.com/?search=importmap) 통계에 따르면, 호환 모드에서의 브라우저 커버리지는 93.5%입니다.

### 호환 지원 활성화

::: warning 중요 사항
프레임워크는 기본적으로 호환 모드로 빌드되지만, 구형 브라우저에 대한 완전한 지원을 위해서는 프로젝트에 [es-module-shims](https://github.com/guybedford/es-module-shims) 의존성을 추가해야 합니다.

:::

HTML 파일에 다음 스크립트를 추가하세요:

```html
<!-- 개발 환경 -->
<script async src="https://ga.jspm.io/npm:es-module-shims@2.0.10/dist/es-module-shims.js"></script>

<!-- 프로덕션 환경 -->
<script async src="/path/to/es-module-shims.js"></script>
```

::: tip 최적의 실천 방법

1. 프로덕션 환경 권장사항:
   - es-module-shims를 자체 서버에 배포
   - 리소스 로딩의 안정성과 접근 속도 보장
   - 잠재적인 보안 위험 회피
2. 성능 고려사항:
   - 호환 모드는 약간의 성능 오버헤드를 초래
   - 대상 사용자 그룹의 브라우저 분포에 따라 활성화 여부 결정

:::