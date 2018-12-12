import { Component } from 'react-subx'

export class App extends Component {
  render () {
    const store = this.props.store
    if (store.token) {
      return 'logout'
    } else {
      return 'login'
    }
  }
}
