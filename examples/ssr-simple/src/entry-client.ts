const button: HTMLButtonElement | null = document.querySelector('button')
const time: HTMLTimeElement | null = document.querySelector('time')

if (button) {
  button.addEventListener('click', () => {
    button.innerText = 'Program execution succeeded'
  })
}
if (time) {
  setInterval(() => {
    time.innerText = new Date().toISOString()
  }, 1000)
}
export {}
