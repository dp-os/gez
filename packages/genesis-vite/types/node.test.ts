import { test, assert } from 'vitest';
import { runTargetName } from '../src/node';


test('null', () => {
    assert.isUndefined(runTargetName(null, ''));
})

test('undefined', () => {
    assert.isUndefined(runTargetName(undefined, ''));
})

test('object', () => {
    assert.isUndefined(runTargetName({ name: '' }, 'name'));
})

test('object', () => {
    assert.equal(runTargetName({ getName: () => 'ok' }, 'getName'), 'ok');
})