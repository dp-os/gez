const test2 = require('./test2');

console.log(test2);

const timer = setInterval(() => {
    test2();
}, 1000);

module.exports = timer;