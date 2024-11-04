export * from './images';
const time = document.querySelector('time');
setInterval(() => {
    if (time) {
        time.innerText = new Date().toISOString();
    }
}, 1000);
