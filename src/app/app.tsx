import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import CreateRoom from './routes/CreateRoom'
import Room from './routes/Room'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={CreateRoom} />
        <Route path="/room/:roomId" component={Room} />
      </Switch>
    </BrowserRouter>
  )
}

export default App