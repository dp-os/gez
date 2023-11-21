import { test, assert } from 'vitest';
import { createFullPath } from './path';


test('base', () => {
    assert.equal(createFullPath('a'), 'a');
    assert.equal(createFullPath('a', { a: 'yes', b: 'no' }), 'a?a=yes&b=no');
    assert.equal(createFullPath('a', { b: 'no', a: 'yes' }), 'a?a=yes&b=no');
    assert.equal(createFullPath('a', 100), 'a?100');
    assert.equal(createFullPath('a', true), 'a?true');
});
