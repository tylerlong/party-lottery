import React from 'react'
import ReactDOM from 'react-dom'

import store from './store'
import { App } from './components'

ReactDOM.render(<App store={store} />, document.getElementById('container'))
