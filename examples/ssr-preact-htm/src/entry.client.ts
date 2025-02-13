import { html } from 'htm/preact';
import { hydrate } from 'preact';
import { App } from './app';

// 初始化应用
const app = document.getElementById('app')!;
hydrate(html`<${App} />`, app);
