import { app } from './app'

import ReactDOM from 'react-dom/client'

ReactDOM.hydrateRoot(
  document.getElementById('app'),
  app
)
console.log('hydrated')
