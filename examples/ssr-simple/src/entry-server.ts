import { defineServer } from 'genesis3'

export default defineServer({
  async render (context) {
    context.html = '<h1>Hello World!</h1>' +
    '<p>This url is ' + context.params.url + '</p>' +
    '<button>Click to try</button>'
  }
})
