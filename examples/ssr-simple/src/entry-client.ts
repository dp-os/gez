import './style.css'

const button: HTMLButtonElement | null = document.querySelector('button')

if (button) {
  button.addEventListener('click', () => {
    button.innerText = 'Program execution succeeded'
  })
}
export {}
