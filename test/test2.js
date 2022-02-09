let count = 0;
module.exports = function startCount () {
    count++;
    console.log(count);
}

console.log('>>>>>>', global);