import React from 'react'
import ReactDOM from 'react-dom'

import store from './store'
import App from './components'
import './style.styl'
import './animate.css'

ReactDOM.render(<App store={store} />, document.getElementById('container'))
