
export async  function test ()  {
  const App = await import('./app.vue')
  return App
}

console.log(await test())