const time: HTMLTimeElement | null = document.querySelector('time')
if (time) {
  setInterval(() => {
    time.innerText = new Date().toISOString()
  }, 1000)
}
