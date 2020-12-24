
import React from 'react'
import ReactDOM from 'react-dom'
import 'app/styles/app.css'
import Theme from 'app/styles/theme'
import App from './app'

ReactDOM.render(
  <Theme>
    <App />
  </Theme>,
  document.getElementById('app')
)