const time = document.querySelector('time');
setInterval(() => {
    time?.setHTMLUnsafe(new Date().toISOString());
}, 1000);
