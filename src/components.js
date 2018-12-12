import { Component } from 'react-subx'

export class App extends Component {
  render () {
    const store = this.props.store
    return `Step #${store.step}`
  }
}
