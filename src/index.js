import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'director/build/director'

import store from './store'
import { App } from './components'

const router = new Router({
  '/1': () => { store.step = 1 },
  '/2': () => { store.step = 2 },
  '/3': () => { store.step = 3 }
})
router.init()

ReactDOM.render(<App store={store} />, document.getElementById('container'))
