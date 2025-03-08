"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["6547"],{324:function(e,n,r){r.r(n),r.d(n,{default:()=>c});var s=r(1549),d=r(6603);function i(e){let n=Object.assign({h1:"h1",a:"a",p:"p",ul:"ul",li:"li",strong:"strong",h2:"h2",h3:"h3",pre:"pre",code:"code",h4:"h4"},(0,d.ah)(),e.components);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(n.h1,{id:"rendercontext",children:["RenderContext",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#rendercontext",children:"#"})]}),"\n",(0,s.jsx)(n.p,{children:"RenderContext — это основной класс в фреймворке Gez, отвечающий за управление полным жизненным циклом серверного рендеринга (SSR). Он предоставляет полный набор API для обработки контекста рендеринга, управления ресурсами, синхронизации состояния и других ключевых задач:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Управление рендерингом"}),": Управление процессом серверного рендеринга, поддержка многопоточного рендеринга, условного рендеринга и других сценариев."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Управление ресурсами"}),": Интеллектуальный сбор и внедрение статических ресурсов, таких как JS, CSS, для оптимизации производительности загрузки."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Синхронизация состояния"}),": Обработка сериализации состояния на сервере, обеспечение правильной гидратации на клиенте."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Управление маршрутизацией"}),": Поддержка серверных перенаправлений, установка кодов состояния и других расширенных функций."]}),"\n"]}),"\n",(0,s.jsxs)(n.h2,{id:"определения-типов",children:["Определения типов",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#определения-типов",children:"#"})]}),"\n",(0,s.jsxs)(n.h3,{id:"serverrenderhandle",children:["ServerRenderHandle",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#serverrenderhandle",children:"#"})]}),"\n",(0,s.jsx)(n.p,{children:"Определение типа функции обработки серверного рендеринга."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"type ServerRenderHandle = (rc: RenderContext) => Promise<void> | void;\n"})}),"\n",(0,s.jsx)(n.p,{children:"Функция обработки серверного рендеринга — это асинхронная или синхронная функция, которая принимает экземпляр RenderContext в качестве параметра и используется для обработки логики серверного рендеринга."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",meta:'title="entry.node.ts"',children:"// 1. Асинхронная функция\nexport default async (rc: RenderContext) => {\n  const app = createApp();\n  const html = await renderToString(app);\n  rc.html = html;\n};\n\n// 2. Синхронная функция\nexport const simple = (rc: RenderContext) => {\n  rc.html = '<h1>Hello World</h1>';\n};\n"})}),"\n",(0,s.jsxs)(n.h3,{id:"renderfiles",children:["RenderFiles",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#renderfiles",children:"#"})]}),"\n",(0,s.jsx)(n.p,{children:"Определение типа списка файлов ресурсов, собранных в процессе рендеринга."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"interface RenderFiles {\n  js: string[];\n  css: string[];\n  modulepreload: string[];\n  resources: string[];\n}\n"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"js"}),": Список файлов JavaScript"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"css"}),": Список файлов стилей"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"modulepreload"}),": Список модулей ESM, которые необходимо предварительно загрузить"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"resources"}),": Список других ресурсов (изображения, шрифты и т.д.)"]}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"// Пример списка файлов ресурсов\nrc.files = {\n  js: [\n    '/assets/entry-client.js',\n    '/assets/vendor.js'\n  ],\n  css: [\n    '/assets/main.css',\n    '/assets/vendor.css'\n  ],\n  modulepreload: [\n    '/assets/Home.js',\n    '/assets/About.js'\n  ],\n  resources: [\n    '/assets/logo.png',\n    '/assets/font.woff2'\n  ]\n};\n"})}),"\n",(0,s.jsxs)(n.h3,{id:"importmapmode",children:["ImportmapMode",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#importmapmode",children:"#"})]}),"\n",(0,s.jsx)(n.p,{children:"Определение режима генерации importmap."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"type ImportmapMode = 'inline' | 'js';\n"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"inline"}),": Встраивание содержимого importmap непосредственно в HTML, подходит для следующих сценариев:","\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Необходимо уменьшить количество HTTP-запросов"}),"\n",(0,s.jsx)(n.li,{children:"Содержимое importmap небольшое"}),"\n",(0,s.jsx)(n.li,{children:"Требуется высокая производительность при загрузке первой страницы"}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"js"}),": Генерация содержимого importmap в виде отдельного JS-файла, подходит для следующих сценариев:","\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Содержимое importmap большое"}),"\n",(0,s.jsx)(n.li,{children:"Необходимо использовать механизм кэширования браузера"}),"\n",(0,s.jsx)(n.li,{children:"Несколько страниц используют один и тот же importmap"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Класс контекста рендеринга, отвечающий за управление ресурсами и генерацию HTML в процессе серверного рендеринга (SSR)."}),"\n",(0,s.jsxs)(n.h2,{id:"параметры-экземпляра",children:["Параметры экземпляра",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#параметры-экземпляра",children:"#"})]}),"\n",(0,s.jsx)(n.p,{children:"Определение параметров конфигурации контекста рендеринга."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"interface RenderContextOptions {\n  base?: string\n  entryName?: string\n  params?: Record<string, any>\n  importmapMode?: ImportmapMode\n}\n"})}),"\n",(0,s.jsxs)(n.h4,{id:"base",children:["base",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#base",children:"#"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Тип"}),": ",(0,s.jsx)(n.code,{children:"string"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Значение по умолчанию"}),": ",(0,s.jsx)(n.code,{children:"''"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Базовый путь для статических ресурсов."}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Все статические ресурсы (JS, CSS, изображения и т.д.) загружаются относительно этого пути"}),"\n",(0,s.jsx)(n.li,{children:"Поддерживает динамическую конфигурацию во время выполнения, без необходимости пересборки"}),"\n",(0,s.jsx)(n.li,{children:"Часто используется в многоязычных сайтах, микросервисных приложениях и других сценариях"}),"\n"]}),"\n",(0,s.jsxs)(n.h4,{id:"entryname",children:["entryName",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryname",children:"#"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Тип"}),": ",(0,s.jsx)(n.code,{children:"string"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Значение по умолчанию"}),": ",(0,s.jsx)(n.code,{children:"'default'"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Имя функции входа для серверного рендеринга. Используется для указания функции входа, которая будет использоваться при серверном рендеринге, когда модуль экспортирует несколько функций рендеринга."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",meta:'title="src/entry.server.ts"',children:"export const mobile = async (rc: RenderContext) => {\n  // Логика рендеринга для мобильных устройств\n};\n\nexport const desktop = async (rc: RenderContext) => {\n  // Логика рендеринга для настольных устройств\n};\n"})}),"\n",(0,s.jsxs)(n.h4,{id:"params",children:["params",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#params",children:"#"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Тип"}),": ",(0,s.jsx)(n.code,{children:"Record<string, any>"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Значение по умолчанию"}),": ",(0,s.jsx)(n.code,{children:"{}"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Параметры рендеринга. Можно передавать параметры любого типа в функцию рендеринга, часто используется для передачи информации о запросе (URL, параметры запроса и т.д.)."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const rc = await gez.render({\n  params: {\n    url: req.url,\n    lang: 'zh-CN',\n    theme: 'dark'\n  }\n});\n"})}),"\n",(0,s.jsxs)(n.h4,{id:"importmapmode-1",children:["importmapMode",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#importmapmode-1",children:"#"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Тип"}),": ",(0,s.jsx)(n.code,{children:"'inline' | 'js'"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Значение по умолчанию"}),": ",(0,s.jsx)(n.code,{children:"'inline'"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Режим генерации карты импорта (Import Map):"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"inline"}),": Встраивание содержимого importmap непосредственно в HTML"]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"js"}),": Генерация содержимого importmap в виде отдельного JS-файла"]}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.h2,{id:"свойства-экземпляра",children:["Свойства экземпляра",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#свойства-экземпляра",children:"#"})]}),"\n",(0,s.jsxs)(n.h3,{id:"gez",children:["gez",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#gez",children:"#"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Тип"}),": ",(0,s.jsx)(n.code,{children:"Gez"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Только для чтения"}),": ",(0,s.jsx)(n.code,{children:"true"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Ссылка на экземпляр Gez. Используется для доступа к основным функциям и конфигурациям фреймворка."}),"\n",(0,s.jsxs)(n.h3,{id:"redirect",children:["redirect",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#redirect",children:"#"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Тип"}),": ",(0,s.jsx)(n.code,{children:"string | null"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Значение по умолчанию"}),": ",(0,s.jsx)(n.code,{children:"null"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Адрес перенаправления. После установки сервер может выполнить HTTP-перенаправление на основе этого значения, часто используется для проверки авторизации, управления доступом и других сценариев."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",meta:'title="entry.node.ts"',children:"// Пример проверки авторизации\nexport default async (rc: RenderContext) => {\n  if (!isLoggedIn()) {\n    rc.redirect = '/login';\n    rc.status = 302;\n    return;\n  }\n  // Продолжение рендеринга страницы...\n};\n\n// Пример управления доступом\nexport default async (rc: RenderContext) => {\n  if (!hasPermission()) {\n    rc.redirect = '/403';\n    rc.status = 403;\n    return;\n  }\n  // Продолжение рендеринга страницы...\n};\n"})}),"\n",(0,s.jsxs)(n.h3,{id:"status",children:["status",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#status",children:"#"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Тип"}),": ",(0,s.jsx)(n.code,{children:"number | null"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Значение по умолчанию"}),": ",(0,s.jsx)(n.code,{children:"null"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Код состояния HTTP. Можно установить любой допустимый код состояния HTTP, часто используется для обработки ошибок, перенаправлений и других сценариев."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",meta:'title="entry.node.ts"',children:"// Пример обработки ошибки 404\nexport default async (rc: RenderContext) => {\n  const page = await findPage(rc.params.url);\n  if (!page) {\n    rc.status = 404;\n    // Рендеринг страницы 404...\n    return;\n  }\n  // Продолжение рендеринга страницы...\n};\n\n// Пример временного перенаправления\nexport default async (rc: RenderContext) => {\n  if (needMaintenance()) {\n    rc.redirect = '/maintenance';\n    rc.status = 307; // Временное перенаправление, метод запроса остается неизменным\n    return;\n  }\n  // Продолжение рендеринга страницы...\n};\n"})}),"\n",(0,s.jsxs)(n.h3,{id:"html",children:["html",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#html",children:"#"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Тип"}),": ",(0,s.jsx)(n.code,{children:"string"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Значение по умолчанию"}),": ",(0,s.jsx)(n.code,{children:"''"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Содержимое HTML. Используется для установки и получения окончательного сгенерированного HTML-содержимого, при установке автоматически обрабатываются заполнители базового пути."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",meta:'title="entry.node.ts"',children:"// Базовое использование\nexport default async (rc: RenderContext) => {\n  // Установка содержимого HTML\n  rc.html = `\n    <!DOCTYPE html>\n    <html>\n      <head>\n        ${rc.preload()}\n        ${rc.css()}\n      </head>\n      <body>\n        <div id=\"app\">Hello World</div>\n        ${rc.importmap()}\n        ${rc.moduleEntry()}\n        ${rc.modulePreload()}\n      </body>\n    </html>\n  `;\n};\n\n// Динамический базовый путь\nconst rc = await gez.render({\n  base: '/app',  // Установка базового пути\n  params: { url: req.url }\n});\n\n// Заполнители в HTML будут автоматически заменены:\n// [[[___GEZ_DYNAMIC_BASE___]]]/your-app-name/css/style.css\n// Заменяется на:\n// /app/your-app-name/css/style.css\n"})}),"\n",(0,s.jsxs)(n.h3,{id:"base-1",children:["base",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#base-1",children:"#"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Тип"}),": ",(0,s.jsx)(n.code,{children:"string"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Только для чтения"}),": ",(0,s.jsx)(n.code,{children:"true"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Значение по умолчанию"}),": ",(0,s.jsx)(n.code,{children:"''"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Базовый путь для статических ресурсов. Все статические ресурсы (JS, CSS, изображения и т.д.) загружаются относительно этого пути, поддерживает динамическую конфигурацию во время выполнения."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"// Базовое использование\nconst rc = await gez.render({\n  base: '/gez',  // Установка базового пути\n  params: { url: req.url }\n});\n\n// Пример многоязычного сайта\nconst rc = await gez.render({\n  base: '/cn',  // Китайский сайт\n  params: { lang: 'zh-CN' }\n});\n\n// Пример микросервисного приложения\nconst rc = await gez.render({\n  base: '/app1',  // Подприложение 1\n  params: { appId: 1 }\n});\n"})}),"\n",(0,s.jsxs)(n.h3,{id:"entryname-1",children:["entryName",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#entryname-1",children:"#"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Тип"}),": ",(0,s.jsx)(n.code,{children:"string"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Только для чтения"}),": ",(0,s.jsx)(n.code,{children:"true"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Значение по умолчанию"}),": ",(0,s.jsx)(n.code,{children:"'default'"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Имя функции входа для серверного рендеринга. Используется для выбора функции рендеринга из entry.server.ts."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",meta:'title="entry.node.ts"',children:"// Функция входа по умолчанию\nexport default async (rc: RenderContext) => {\n  // Логика рендеринга по умолчанию\n};\n\n// Несколько функций входа\nexport const mobile = async (rc: RenderContext) => {\n  // Логика рендеринга для мобильных устройств\n};\n\nexport const desktop = async (rc: RenderContext) => {\n  // Логика рендеринга для настольных устройств\n};\n\n// Выбор функции входа в зависимости от типа устройства\nconst rc = await gez.render({\n  entryName: isMobile ? 'mobile' : 'desktop',\n  params: { url: req.url }\n});\n"})}),"\n",(0,s.jsxs)(n.h3,{id:"params-1",children:["params",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#params-1",children:"#"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Тип"}),": ",(0,s.jsx)(n.code,{children:"Record<string, any>"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Только для чтения"}),": ",(0,s.jsx)(n.code,{children:"true"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Значение по умолчанию"}),": ",(0,s.jsx)(n.code,{children:"{}"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Параметры рендеринга. Можно передавать и получать параметры в процессе серверного рендеринга, часто используется для передачи информации о запросе, конфигурации страницы и т.д."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"// Базовое использование - передача URL и настроек языка\nconst rc = await gez.render({\n  params: {\n    url: req.url,\n    lang: 'zh-CN'\n  }\n});\n\n// Конфигурация страницы - установка темы и макета\nconst rc = await gez.render({\n  params: {\n    theme: 'dark',\n    layout: 'sidebar'\n  }\n});\n\n// Конфигурация окружения - внедрение адреса API\nconst rc = await gez.render({\n  params: {\n    apiBaseUrl: process.env.API_BASE_URL,\n    version: '1.0.0'\n  }\n});\n"})}),"\n",(0,s.jsxs)(n.h3,{id:"importmetaset",children:["importMetaSet",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#importmetaset",children:"#"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Тип"}),": ",(0,s.jsx)(n.code,{children:"Set<ImportMeta>"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Коллекция зависимостей модулей. Автоматически отслеживает и записывает зависимости модулей в процессе рендеринга компонентов, собирает только те ресурсы, которые действительно используются при рендеринге текущей страницы."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"// Базовое использование\nconst renderToString = (app: any, context: { importMetaSet: Set<ImportMeta> }) => {\n  // Автоматический сбор зависимостей модулей в процессе рендеринга\n  // Фреймворк автоматически вызывает context.importMetaSet.add(import.meta) при рендеринге компонентов\n  // Разработчикам не нужно вручную обрабатывать сбор зависимостей\n  return '<div id=\"app\">Hello World</div>';\n};\n\n// Пример использования\nconst app = createApp();\nconst html = await renderToString(app, {\n  importMetaSet: rc.importMetaSet\n});\n"})}),"\n",(0,s.jsxs)(n.h3,{id:"files",children:["files",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#files",children:"#"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Тип"}),": ",(0,s.jsx)(n.code,{children:"RenderFiles"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Список файлов ресурсов:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"js: Список файлов JavaScript"}),"\n",(0,s.jsx)(n.li,{children:"css: Список файлов стилей"}),"\n",(0,s.jsx)(n.li,{children:"modulepreload: Список модулей ESM, которые необходимо предварительно загрузить"}),"\n",(0,s.jsx)(n.li,{children:"resources: Список других ресурсов (изображения, шрифты и т.д.)"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"// Сбор ресурсов\nawait rc.commit();\n\n// Внедрение ресурсов\nrc.html = `\n  <!DOCTYPE html>\n  <html>\n  <head>\n    \x3c!-- Предварительная загрузка ресурсов --\x3e\n    ${rc.preload()}\n    \x3c!-- Внедрение стилей --\x3e\n    ${rc.css()}\n  </head>\n  <body>\n    ${html}\n    ${rc.importmap()}\n    ${rc.moduleEntry()}\n    ${rc.modulePreload()}\n  </body>\n  </html>\n`;\n"})}),"\n",(0,s.jsxs)(n.h3,{id:"importmapmode-2",children:["importmapMode",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#importmapmode-2",children:"#"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Тип"}),": ",(0,s.jsx)(n.code,{children:"'inline' | 'js'"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Значение по умолчанию"}),": ",(0,s.jsx)(n.code,{children:"'inline'"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Режим генерации карты импорта:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"inline"}),": Встраивание содержимого importmap непосредственно в HTML"]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"js"}),": Генерация содержимого importmap в виде отдельного JS-файла"]}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.h2,{id:"методы-экземпляра",children:["Методы экземпляра",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#методы-экземпляра",children:"#"})]}),"\n",(0,s.jsxs)(n.h3,{id:"serialize",children:["serialize()",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#serialize",children:"#"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Параметры"}),":","\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"input: any"})," - Данные для сериализации"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"options?: serialize.SerializeJSOptions"})," - Параметры сериализации"]}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Возвращаемое значение"}),": ",(0,s.jsx)(n.code,{children:"string"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Сериализация объекта JavaScript в строку. Используется для сериализации данных состояния в процессе серверного рендеринга, чтобы данные можно было безопасно встроить в HTML."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const state = {\n  user: { id: 1, name: 'Alice' },\n  timestamp: new Date()\n};\n\nrc.html = `\n  <script>\n    window.__INITIAL_STATE__ = ${rc.serialize(state)};\n  <\/script>\n`;\n"})}),"\n",(0,s.jsxs)(n.h3,{id:"state",children:["state()",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#state",children:"#"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Параметры"}),":","\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"varName: string"})," - Имя переменной"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"data: Record<string, any>"})," - Данные состояния"]}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Возвращаемое значение"}),": ",(0,s.jsx)(n.code,{children:"string"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Сериализация данных состояния и их внедрение в HTML. Использует безопасные методы сериализации для обработки данных, поддерживает сложные структуры данных."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const userInfo = {\n  id: 1,\n  name: 'John',\n  roles: ['admin']\n};\n\nrc.html = `\n  <head>\n    ${rc.state('__USER__', userInfo)}\n  </head>\n`;\n"})}),"\n",(0,s.jsxs)(n.h3,{id:"commit",children:["commit()",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#commit",children:"#"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Возвращаемое значение"}),": ",(0,s.jsx)(n.code,{children:"Promise<void>"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Фиксация сбора зависимостей и обновление списка ресурсов. Собирает все используемые модули из importMetaSet, анализирует конкретные ресурсы каждого модуля на основе manifest-файла."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"// Рендеринг и фиксация зависимостей\nconst html = await renderToString(app, {\n  importMetaSet: rc.importMetaSet\n});\n\n// Фиксация сбора зависимостей\nawait rc.commit();\n"})}),"\n",(0,s.jsxs)(n.h3,{id:"preload",children:["preload()",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#preload",children:"#"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Возвращаемое значение"}),": ",(0,s.jsx)(n.code,{children:"string"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Генерация тегов предварительной загрузки ресурсов. Используется для предварительной загрузки ресурсов CSS и JavaScript, поддерживает настройку приоритетов, автоматически обрабатывает базовый путь."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"rc.html = `\n  <!DOCTYPE html>\n  <html>\n  <head>\n    ${rc.preload()}\n    ${rc.css()}  \x3c!-- Внедрение стилей --\x3e\n  </head>\n  <body\n"})})]})}function l(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,d.ah)(),e.components);return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(i,{...e})}):i(e)}let c=l;l.__RSPRESS_PAGE_META={},l.__RSPRESS_PAGE_META["ru%2Fapi%2Fcore%2Frender-context.md"]={toc:[{text:"Определения типов",id:"определения-типов",depth:2},{text:"ServerRenderHandle",id:"serverrenderhandle",depth:3},{text:"RenderFiles",id:"renderfiles",depth:3},{text:"ImportmapMode",id:"importmapmode",depth:3},{text:"Параметры экземпляра",id:"параметры-экземпляра",depth:2},{text:"base",id:"base",depth:4},{text:"entryName",id:"entryname",depth:4},{text:"params",id:"params",depth:4},{text:"importmapMode",id:"importmapmode-1",depth:4},{text:"Свойства экземпляра",id:"свойства-экземпляра",depth:2},{text:"gez",id:"gez",depth:3},{text:"redirect",id:"redirect",depth:3},{text:"status",id:"status",depth:3},{text:"html",id:"html",depth:3},{text:"base",id:"base-1",depth:3},{text:"entryName",id:"entryname-1",depth:3},{text:"params",id:"params-1",depth:3},{text:"importMetaSet",id:"importmetaset",depth:3},{text:"files",id:"files",depth:3},{text:"importmapMode",id:"importmapmode-2",depth:3},{text:"Методы экземпляра",id:"методы-экземпляра",depth:2},{text:"serialize()",id:"serialize",depth:3},{text:"state()",id:"state",depth:3},{text:"commit()",id:"commit",depth:3},{text:"preload()",id:"preload",depth:3}],title:"RenderContext",headingTitle:"RenderContext",frontmatter:{titleSuffix:"Справочник API контекста рендеринга Gez",description:"Подробное описание основного класса RenderContext в фреймворке Gez, включая управление рендерингом, управление ресурсами, синхронизацию состояния и управление маршрутизацией, чтобы помочь разработчикам реализовать эффективный серверный рендеринг.",head:[["meta",{property:"keywords",content:"Gez, RenderContext, SSR, серверный рендеринг, контекст рендеринга, синхронизация состояния, управление ресурсами, фреймворк для веб-приложений"}]]}}}}]);