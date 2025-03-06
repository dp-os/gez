---
titleSuffix: Пример HTML SSR приложения на фреймворке Gez
description: Пошаговое руководство по созданию HTML SSR приложения на основе Gez. Пример демонстрирует базовое использование фреймворка, включая инициализацию проекта, настройку HTML и конфигурацию входных файлов.
head:
  - - meta
    - property: keywords
      content: Gez, HTML, SSR приложение, TypeScript конфигурация, инициализация проекта, серверный рендеринг, клиентское взаимодействие
---

# HTML

В этом руководстве вы шаг за шагом создадите HTML SSR приложение на основе Gez. Мы рассмотрим полный пример, демонстрирующий, как использовать фреймворк Gez для создания приложения с серверным рендерингом.

## Структура проекта

Для начала давайте рассмотрим базовую структуру проекта:

```bash
.
├── package.json         # Конфигурационный файл проекта, определяющий зависимости и команды
├── tsconfig.json        # Конфигурационный файл TypeScript, настройки компиляции
└── src                  # Директория с исходным кодом
    ├── app.ts           # Главный компонент приложения, определяющий структуру страницы и логику взаимодействия
    ├── create-app.ts    # Фабрика создания экземпляра приложения, отвечающая за инициализацию
    ├── entry.client.ts  # Входной файл для клиента, обрабатывающий рендеринг в браузере
    ├── entry.node.ts    # Входной файл для сервера Node.js, отвечающий за конфигурацию среды разработки и запуск сервера
    └── entry.server.ts  # Входной файл для сервера, обрабатывающий логику SSR рендеринга
```

## Конфигурация проекта

### package.json

Создайте файл `package.json` для настройки зависимостей и скриптов проекта:

```json title="package.json"
{
  "name": "ssr-demo-html",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "gez dev",
    "build": "npm run build:dts && npm run build:ssr",
    "build:ssr": "gez build",
    "preview": "gez preview",
    "start": "NODE_ENV=production node dist/index.js",
    "build:dts": "tsc --declaration --emitDeclarationOnly --outDir dist/src"
  },
  "dependencies": {
    "@gez/core": "*"
  },
  "devDependencies": {
    "@gez/rspack": "*",
    "@types/node": "22.8.6",
    "typescript": "^5.7.3"
  }
}
```

После создания файла `package.json` установите зависимости проекта. Вы можете использовать одну из следующих команд для установки:
```bash
pnpm install
# или
yarn install
# или
npm install
```

Это установит все необходимые зависимости, включая TypeScript и зависимости для SSR.

### tsconfig.json

Создайте файл `tsconfig.json` для настройки параметров компиляции TypeScript:

```json title="tsconfig.json"
{
    "compilerOptions": {
        "module": "ESNext",
        "moduleResolution": "node",
        "isolatedModules": true,
        "resolveJsonModule": true,
        
        "target": "ESNext",
        "lib": ["ESNext", "DOM"],
        
        "strict": true,
        "skipLibCheck": true,
        "types": ["@types/node"],
        
        "experimentalDecorators": true,
        "allowSyntheticDefaultImports": true,
        
        "baseUrl": ".",
        "paths": {
            "ssr-demo-html/src/*": ["./src/*"],
            "ssr-demo-html/*": ["./*"]
        }
    },
    "include": ["src"],
    "exclude": ["dist", "node_modules"]
}
```

## Структура исходного кода

### app.ts

Создайте главный компонент приложения `src/app.ts`, реализующий структуру страницы и логику взаимодействия:

```ts title="src/app.ts"
/**
 * @file Пример компонента
 * @description Демонстрирует заголовок страницы с автоматически обновляемым временем, используя базовые функции фреймворка Gez
 */

export default class App {
    /**
     * Текущее время в формате ISO
     * @type {string}
     */
    public time = '';

    /**
     * Создание экземпляра приложения
     * @param {SsrContext} [ssrContext] - Контекст сервера, содержащий набор метаданных импорта
     */
    public constructor(public ssrContext?: SsrContext) {
        // В конструкторе не требуется дополнительная инициализация
    }

    /**
     * Рендеринг содержимого страницы
     * @returns {string} Возвращает HTML структуру страницы
     */
    public render(): string {
        // Убедитесь, что метаданные импорта корректно собираются на сервере
        if (this.ssrContext) {
            this.ssrContext.importMetaSet.add(import.meta);
        }

        return `
        <div id="app">
            <h1><a href="https://www.jsesm.com/guide/frameworks/html.html" target="_blank">Быстрый старт с Gez</a></h1>
            <time datetime="${this.time}">${this.time}</time>
        </div>
        `;
    }

    /**
     * Инициализация на клиенте
     * @throws {Error} Ошибка, если элемент отображения времени не найден
     */
    public onClient(): void {
        // Получение элемента отображения времени
        const time = document.querySelector('#app time');
        if (!time) {
            throw new Error('Элемент отображения времени не найден');
        }

        // Установка таймера для обновления времени каждую секунду
        setInterval(() => {
            this.time = new Date().toISOString();
            time.setAttribute('datetime', this.time);
            time.textContent = this.time;
        }, 1000);
    }

    /**
     * Инициализация на сервере
     */
    public onServer(): void {
        this.time = new Date().toISOString();
    }
}

/**
 * Интерфейс контекста сервера
 * @interface
 */
export interface SsrContext {
    /**
     * Набор метаданных импорта
     * @type {Set<ImportMeta>}
     */
    importMetaSet: Set<ImportMeta>;
}
```

### create-app.ts

Создайте файл `src/create-app.ts`, отвечающий за создание экземпляра приложения:

```ts title="src/create-app.ts"
/**
 * @file Создание экземпляра приложения
 * @description Отвечает за создание и конфигурацию экземпляра приложения
 */

import App from './app';

export function createApp() {
    const app = new App();
    return {
        app
    };
}
```

### entry.client.ts

Создайте входной файл для клиента `src/entry.client.ts`:

```ts title="src/entry.client.ts"
/**
 * @file Входной файл для клиента
 * @description Отвечает за логику взаимодействия на клиенте и динамическое обновление
 */

import { createApp } from './create-app';

// Создание экземпляра приложения и инициализация
const { app } = createApp();
app.onClient();
```

### entry.node.ts

Создайте файл `entry.node.ts` для конфигурации среды разработки и запуска сервера:

```ts title="src/entry.node.ts"
/**
 * @file Входной файл для сервера Node.js
 * @description Отвечает за конфигурацию среды разработки и запуск сервера, предоставляя среду выполнения SSR
 */

import http from 'node:http';
import type { GezOptions } from '@gez/core';

export default {
    /**
     * Конфигурация приложения для среды разработки
     * @description Создает и конфигурирует экземпляр приложения Rspack для сборки и горячей перезагрузки в среде разработки
     * @param gez Экземпляр фреймворка Gez, предоставляющий основные функции и интерфейсы конфигурации
     * @returns Возвращает сконфигурированный экземпляр приложения Rspack с поддержкой HMR и live preview
     */
    async devApp(gez) {
        return import('@gez/rspack').then((m) =>
            m.createRspackHtmlApp(gez, {
                config(context) {
                    // Здесь можно настроить конфигурацию компиляции Rspack
                }
            })
        );
    },

    /**
     * Конфигурация и запуск HTTP сервера
     * @description Создает экземпляр HTTP сервера, интегрирует middleware Gez для обработки SSR запросов
     * @param gez Экземпляр фреймворка Gez, предоставляющий middleware и функции рендеринга
     */
    async server(gez) {
        const server = http.createServer((req, res) => {
            // Использование middleware Gez для обработки запросов
            gez.middleware(req, res, async () => {
                // Выполнение серверного рендеринга
                const rc = await gez.render({
                    params: { url: req.url }
                });
                res.end(rc.html);
            });
        });

        server.listen(3000, () => {
            console.log('Сервер запущен: http://localhost:3000');
        });
    }
} satisfies GezOptions;
```

Этот файл является входной точкой для конфигурации среды разработки и запуска сервера. Он содержит две основные функции:

1. `devApp`: отвечает за создание и конфигурацию экземпляра приложения Rspack для среды разработки с поддержкой горячей перезагрузки и live preview.
2. `server`: отвечает за создание и конфигурацию HTTP сервера, интегрируя middleware Gez для обработки SSR запросов.

### entry.server.ts

Создайте входной файл для серверного рендеринга `src/entry.server.ts`:

```ts title="src/entry.server.ts"
/**
 * @file Входной файл для серверного рендеринга
 * @description Отвечает за процесс серверного рендеринга, генерацию HTML и инъекцию ресурсов
 */

import type { RenderContext } from '@gez/core';
import type App from './app';
import type { SsrContext } from './app';
import { createApp } from './create-app';

// Логика генерации содержимого страницы
const renderToString = (app: App, ssrContext: SsrContext): string => {
    // Инъекция контекста серверного рендеринга в экземпляр приложения
    app.ssrContext = ssrContext;
    // Инициализация на сервере
    app.onServer();

    // Генерация содержимого страницы
    return app.render();
};

export default async (rc: RenderContext) => {
    // Создание экземпляра приложения, возвращает объект с экземпляром app
    const { app } = createApp();
    // Использование renderToString для генерации содержимого страницы
    const html = renderToString(app, {
        importMetaSet: rc.importMetaSet
    });

    // Фиксация сбора зависимостей, чтобы все необходимые ресурсы были загружены
    await rc.commit();

    // Генерация полной HTML структуры
    rc.html = `<!DOCTYPE html>
<html lang="ru">
<head>
    ${rc.preload()}
    <title>Быстрый старт с Gez</title>
    ${rc.css()}
</head>
<body>
    ${html}
    ${rc.importmap()}
    ${rc.moduleEntry()}
    ${rc.modulePreload()}
</body>
</html>
`;
};
```

## Запуск проекта

После завершения настройки файлов вы можете запустить проект с помощью следующих команд:

1. Режим разработки:
```bash
npm run dev
```

2. Сборка проекта:
```bash
npm run build
```

3. Запуск в production:
```bash
npm run start
```

Теперь вы успешно создали HTML SSR приложение на основе Gez! Перейдите по адресу http://localhost:3000, чтобы увидеть результат.