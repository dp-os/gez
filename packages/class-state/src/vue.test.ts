import { assert, test } from 'vitest';
import { nextTick, reactive, watch } from 'vue';

import { connectState } from './connect';
import { createState } from './create';

test('base', async () => {
    const state = createState(reactive({ value: {} }));
    const connectStore = connectState(state);
    class User {
        public name = '';
        public $setName(name: string) {
            this.name = name;
        }
    }
    const user = connectStore(User, 'user');
    let updateValue;
    watch(
        () => {
            return user.name;
        },
        (name) => {
            updateValue = name;
        }
    );
    user.$setName('test');
    await nextTick();
    assert.equal(updateValue, 'test');

    user.$setName('test2');
    await nextTick();
    assert.equal(updateValue, 'test2');
});

test('base2', async () => {
    const state = createState(reactive({ value: {} }));
    const connectStore = connectState(state);
    class User {
        public name = '';
        public $setName(name: string) {
            this.name = name;
        }
    }
    const user = connectStore(User, 'user');
    user.$setName('test');
    let updateValue;
    watch(
        () => {
            return user.name;
        },
        (name) => {
            updateValue = name;
        }
    );
    user.$setName('test2');
    await nextTick();
    assert.equal(updateValue, 'test2');
});

test('watch root', async () => {
    const state = createState(reactive({ value: {} }));
    const connectStore = connectState(state);
    class User {
        public name = '';
        public $setName(name: string) {
            this.name = name;
        }
    }
    const user = connectStore(User, 'user');
    let updateCount = 0;
    watch(
        () => {
            return connectStore(User, 'user');
        },
        () => {
            updateCount++;
        }
    );
    assert.equal(user.$.connecting, false);
    user.$setName('test2');
    await nextTick();
    assert.equal(updateCount, 1);
});
