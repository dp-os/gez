## Square
Based on the development of [Tms.js](https://www.npmjs.com/package/@fmfe/tms.js) micro module `Vue.js` State Management Library

## Installation
```bash
npm install @fmfe/square
```

### Usage
```ts
import Vue from 'vue';
import { Micro } from '@fmfe/square';
import Tms from '@fmfe/tms.js';

Vue.use(Micro);

class Count extends Tms {
    value = 0;
    $plus () {
        this.value++;
    }
}

const micro = new Micro();

const app = new Vue({
    micro,
    // The current component registers TMS,
    // which can be accessed by the current component and its sub components.
    // When the component is destroyed,
    // it will also be destroyed
    register: {
        count: (square) => new Count()
    }
});

app.$square.count.$plus();
app.$square.count.value // 1

```

## Server-Side Rendering
```ts
// Server
const micro = new Micro({
    commits: state.commits || []
});
state.commits = micro.createServerCommit();
// Client
const micro = new Micro({
    commits: state.commits || []
});
```