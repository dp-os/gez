---
titleSuffix: Gez 프레임워크 모듈 임포트 경로 매핑 가이드
description: Gez 프레임워크의 경로 별칭(Path Alias) 메커니즘에 대해 자세히 설명합니다. 간소화된 임포트 경로, 깊은 중첩 방지, 타입 안전성, 모듈 해석 최적화 등의 기능을 통해 개발자가 코드 유지보수성을 향상시킬 수 있도록 돕습니다.
head:
  - - meta
    - property: keywords
      content: Gez, 경로 별칭, Path Alias, TypeScript, 모듈 임포트, 경로 매핑, 코드 유지보수성
---

# 경로 별칭

경로 별칭(Path Alias)은 모듈 임포트 경로 매핑 메커니즘으로, 개발자가 긴 모듈 경로 대신 짧고 의미 있는 식별자를 사용할 수 있게 해줍니다. Gez에서 경로 별칭 메커니즘은 다음과 같은 장점을 제공합니다:

- **임포트 경로 간소화**: 긴 상대 경로 대신 의미 있는 별칭을 사용하여 코드 가독성을 높임
- **깊은 중첩 방지**: `../../../../`와 같은 다중 디렉토리 참조로 인한 유지보수 어려움 해소
- **타입 안전성**: TypeScript의 타입 시스템과 완전히 통합되어 코드 완성 및 타입 검사 제공
- **모듈 해석 최적화**: 미리 정의된 경로 매핑을 통해 모듈 해석 성능 향상

## 기본 별칭 메커니즘

Gez는 서비스 이름(Service Name) 기반의 자동 별칭 메커니즘을 채택하며, 이는 설정보다 규약을 우선하는 설계로 다음과 같은 특징을 가집니다:

- **자동 구성**: `package.json`의 `name` 필드를 기반으로 별칭을 자동 생성하여 수동 설정 불필요
- **통일된 규범**: 모든 서비스 모듈이 일관된 명명 및 참조 규칙을 따르도록 보장
- **타입 지원**: `npm run build:dts` 명령어와 함께 사용하여 타입 선언 파일을 자동 생성, 서비스 간 타입 추론 가능
- **예측 가능성**: 서비스 이름을 통해 모듈 참조 경로를 쉽게 유추할 수 있어 유지보수 비용 감소

## 설정 설명

### package.json 설정

`package.json`에서 `name` 필드를 통해 서비스 이름을 정의하며, 이 이름은 서비스의 기본 별칭 접두사로 사용됩니다:

```json title="package.json"
{
    "name": "your-app-name"
}
```

### tsconfig.json 설정

TypeScript가 별칭 경로를 올바르게 해석할 수 있도록 `tsconfig.json`에서 `paths` 매핑을 설정해야 합니다:

```json title="tsconfig.json"
{
    "compilerOptions": {
        "paths": {
            "your-app-name/src/*": [
                "./src/*"
            ],
            "your-app-name/*": [
                "./*"
            ]
        }
    }
}
```

## 사용 예제

### 서비스 내부 모듈 임포트

```ts
// 별칭을 사용하여 임포트
import { MyComponent } from 'your-app-name/src/components';

// 상대 경로를 사용한 동등한 임포트
import { MyComponent } from '../components';
```

### 다른 서비스 모듈 임포트

```ts
// 다른 서비스의 컴포넌트 임포트
import { SharedComponent } from 'other-service/src/components';

// 다른 서비스의 유틸리티 함수 임포트
import { utils } from 'other-service/src/utils';
```

::: tip 최적의 실천 방법
- 상대 경로 대신 별칭 경로를 우선적으로 사용
- 별칭 경로의 의미와 일관성을 유지
- 별칭 경로에서 너무 많은 디렉토리 계층을 사용하지 않도록 주의

:::

``` ts
// 컴포넌트 임포트
import { Button } from 'your-app-name/src/components';
import { Layout } from 'your-app-name/src/components/layout';

// 유틸리티 함수 임포트
import { formatDate } from 'your-app-name/src/utils';
import { request } from 'your-app-name/src/utils/request';

// 타입 정의 임포트
import type { UserInfo } from 'your-app-name/src/types';
```

### 서비스 간 임포트

모듈 링크(Module Link)가 구성된 후, 동일한 방식으로 다른 서비스의 모듈을 임포트할 수 있습니다:

```ts
// 원격 서비스의 컴포넌트 임포트
import { Header } from 'remote-service/src/components';

// 원격 서비스의 유틸리티 함수 임포트
import { logger } from 'remote-service/src/utils';
```

### 사용자 정의 별칭

서드파티 패키지나 특수한 상황을 위해 Gez 설정 파일을 통해 사용자 정의 별칭을 설정할 수 있습니다:

```ts title="src/entry.node.ts"
export default {
    async devApp(gez) {
        return import('@gez/rspack').then((m) =>
            m.createApp(gez, (buildContext) => {
                buildContext.config.resolve = {
                    ...buildContext.config.resolve,
                    alias: {
                        ...buildContext.config.resolve?.alias,
                        // Vue에 특정 빌드 버전 설정
                        'vue$': 'vue/dist/vue.esm.js',
                        // 자주 사용하는 디렉토리에 짧은 별칭 설정
                        '@': './src',
                        '@components': './src/components'
                    }
                }
            })
        );
    }
} satisfies GezOptions;
```

::: warning 주의 사항
1. 비즈니스 모듈의 경우, 프로젝트의 일관성을 유지하기 위해 기본 별칭 메커니즘을 항상 사용하는 것이 좋습니다.
2. 사용자 정의 별칭은 주로 서드파티 패키지의 특수 요구 사항이나 개발 경험을 최적화하는 데 사용됩니다.
3. 사용자 정의 별칭을 과도하게 사용하면 코드의 유지보수성과 빌드 최적화에 영향을 미칠 수 있습니다.

:::