import { defineServer } from 'genesis3'

export default defineServer({
  async render (context) {
    const time = new Date().toISOString()
    context.html = '<h1>Hello World</h1>' +
    '<time>' + time + '</time><br>' +
    '<button>Click to try</button>'
  }
})
