---
titleSuffix: Gez 프레임워크 서비스 간 코드 공유 메커니즘
description: Gez 프레임워크의 모듈 링크 메커니즘을 상세히 설명하며, 서비스 간 코드 공유, 의존성 관리 및 ESM 규격 구현을 통해 개발자가 효율적인 마이크로 프론트엔드 애플리케이션을 구축할 수 있도록 돕습니다.
head:
  - - meta
    - property: keywords
      content: Gez, 모듈 링크, Module Link, ESM, 코드 공유, 의존성 관리, 마이크로 프론트엔드
---

# 모듈 링크

Gez 프레임워크는 서비스 간 코드 공유와 의존성 관리를 위한 완전한 모듈 링크 메커니즘을 제공합니다. 이 메커니즘은 ESM(ECMAScript Module) 규격을 기반으로 구현되었으며, 소스 코드 수준의 모듈 내보내기 및 가져오기와 완전한 의존성 관리 기능을 지원합니다.

### 핵심 개념

#### 모듈 내보내기
모듈 내보내기는 서비스 내의 특정 코드 단위(예: 컴포넌트, 유틸리티 함수 등)를 ESM 형식으로 외부에 노출하는 과정입니다. 두 가지 내보내기 유형을 지원합니다:
- **소스 코드 내보내기**: 프로젝트 내의 소스 코드 파일을 직접 내보냄
- **의존성 내보내기**: 프로젝트에서 사용하는 서드파티 의존성 패키지를 내보냄

#### 모듈 가져오기
모듈 가져오기는 서비스에서 다른 서비스가 내보낸 코드 단위를 참조하는 과정입니다. 여러 설치 방식을 지원합니다:
- **소스 코드 설치**: 개발 환경에 적합하며, 실시간 수정 및 핫 리로드를 지원
- **패키지 설치**: 프로덕션 환경에 적합하며, 빌드 결과물을 직접 사용

### 사전 로딩 메커니즘

서비스 성능을 최적화하기 위해 Gez는 지능형 모듈 사전 로딩 메커니즘을 구현했습니다:

1. **의존성 분석**
   - 빌드 시 컴포넌트 간 의존성 관계 분석
   - 핵심 경로 상의 주요 모듈 식별
   - 모듈 로딩 우선순위 결정

2. **로딩 전략**
   - **즉시 로딩**: 핵심 경로 상의 주요 모듈
   - **지연 로딩**: 비핵심 기능 모듈
   - **필요 시 로딩**: 조건부 렌더링 모듈

3. **리소스 최적화**
   - 지능형 코드 분할 전략
   - 모듈 수준의 캐시 관리
   - 필요 시 컴파일 및 패키징

## 모듈 내보내기

### 설정 설명

`entry.node.ts`에서 내보낼 모듈을 설정합니다:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        exports: [
            // 소스 코드 파일 내보내기
            'root:src/components/button.vue',  // Vue 컴포넌트
            'root:src/utils/format.ts',        // 유틸리티 함수
            // 서드파티 의존성 내보내기
            'npm:vue',                         // Vue 프레임워크
            'npm:vue-router'                   // Vue Router
        ]
    }
} satisfies GezOptions;
```

내보내기 설정은 두 가지 유형을 지원합니다:
- `root:*`: 소스 코드 파일 내보내기, 경로는 프로젝트 루트 디렉토리를 기준으로 함
- `npm:*`: 서드파티 의존성 내보내기, 패키지 이름을 직접 지정

## 모듈 가져오기

### 설정 설명

`entry.node.ts`에서 가져올 모듈을 설정합니다:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    modules: {
        // 가져오기 설정
        imports: {
            // 소스 코드 설치: 빌드 결과물 디렉토리 지정
            'ssr-remote': 'root:./node_modules/ssr-remote/dist',
            // 패키지 설치: 패키지 디렉토리 지정
            'other-remote': 'root:./node_modules/other-remote'
        },
        // 외부 의존성 설정
        externals: {
            // 원격 모듈의 의존성 사용
            'vue': 'ssr-remote/npm/vue',
            'vue-router': 'ssr-remote/npm/vue-router'
        }
    }
} satisfies GezOptions;
```

설정 항목 설명:
1. **imports**: 원격 모듈의 로컬 경로 설정
   - 소스 코드 설치: 빌드 결과물 디렉토리(dist) 지정
   - 패키지 설치: 패키지 디렉토리 직접 지정

2. **externals**: 외부 의존성 설정
   - 원격 모듈의 의존성 공유
   - 동일 의존성 중복 패키징 방지
   - 여러 모듈 간 의존성 공유 지원

### 설치 방식

#### 소스 코드 설치
개발 환경에 적합하며, 실시간 수정 및 핫 리로드를 지원합니다.

1. **Workspace 방식**
Monorepo 프로젝트에서 사용 권장:
```ts title="package.json"
{
    "devDependencies": {
        "ssr-remote": "workspace:*"
    }
}
```

2. **Link 방식**
로컬 개발 디버깅에 사용:
```ts title="package.json"
{
    "devDependencies": {
        "ssr-remote": "link:../ssr-remote"
    }
}
```

#### 패키지 설치
프로덕션 환경에 적합하며, 빌드 결과물을 직접 사용합니다.

1. **NPM Registry**
npm registry를 통해 설치:
```ts title="package.json"
{
    "dependencies": {
        "ssr-remote": "^1.0.0"
    }
}
```

2. **정적 서버**
HTTP/HTTPS 프로토콜을 통해 설치:
```ts title="package.json"
{
    "dependencies": {
        "ssr-remote": "https://cdn.example.com/ssr-remote/1.0.0.tgz"
    }
}
```

## 패키지 빌드

### 설정 설명

`entry.node.ts`에서 빌드 옵션을 설정합니다:

```ts title="src/entry.node.ts"
import type { GezOptions } from '@gez/core';

export default {
    // 모듈 내보내기 설정
    modules: {
        exports: [
            'root:src/components/button.vue',
            'root:src/utils/format.ts',
            'npm:vue'
        ]
    },
    // 빌드 설정
    pack: {
        // 빌드 활성화
        enable: true,

        // 출력 설정
        outputs: [
            'dist/client/versions/latest.tgz',
            'dist/client/versions/1.0.0.tgz'
        ],

        // 사용자 정의 package.json
        packageJson: async (gez, pkg) => {
            pkg.version = '1.0.0';
            return pkg;
        },

        // 빌드 전 처리
        onBefore: async (gez, pkg) => {
            // 타입 선언 생성
            // 테스트 케이스 실행
            // 문서 업데이트 등
        },

        // 빌드 후 처리
        onAfter: async (gez, pkg, file) => {
            // CDN에 업로드
            // npm 저장소에 배포
            // 테스트 환경에 배포 등
        }
    }
} satisfies GezOptions;
```

### 빌드 결과물

```
your-app-name.tgz
├── package.json        # 패키지 정보
├── index.js            # 프로덕션 환경 진입점
├── server/             # 서버 측 리소스
│   └── manifest.json   # 서버 측 리소스 매핑
├── node/               # Node.js 런타임
└── client/             # 클라이언트 측 리소스
    └── manifest.json   # 클라이언트 측 리소스 매핑
```

### 배포 프로세스

```bash
# 1. 프로덕션 버전 빌드
gez build

# 2. npm에 배포
npm publish dist/versions/your-app-name.tgz
```

## 모범 사례

### 개발 환경 설정
- **의존성 관리**
  - Workspace 또는 Link 방식으로 의존성 설치
  - 의존성 버전 통합 관리
  - 동일 의존성 중복 설치 방지

- **개발 경험**
  - 핫 리로드 기능 활성화
  - 적절한 사전 로딩 전략 설정
  - 빌드 속도 최적화

### 프로덕션 환경 설정
- **배포 전략**
  - NPM Registry 또는 정적 서버 사용
  - 빌드 결과물 무결성 보장
  - 그레이스케일 배포 메커니즘 적용

- **성능 최적화**
  - 리소스 사전 로딩 적절히 설정
  - 모듈 로딩 순서 최적화
  - 효과적인 캐시 전략 적용

### 버전 관리
- **버전 규칙**
  - 시맨틱 버전 규칙 준수
  - 상세한 변경 로그 유지
  - 버전 호환성 테스트 수행

- **의존성 업데이트**
  - 의존성 패키지 정기 업데이트
  - 정기적인 보안 감사 수행
  - 의존성 버전 일관성 유지
```