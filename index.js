import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import REPL from './components/repl.js'

export default class SamangeWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    platformWidgetHelper.updateHeight(1500)
    platformWidgetHelper.hide() // should be the default!
  }
  onWidgetEvent = (event) => {
    console.log('WIDGET_EVENT:', arguments)
  }
  onWidgetContextObject = (object) => {
    console.log('CONTEXT:', object)
    platformWidgetHelper.hide()
    this.setState(object)
  }
  componentDidUpdate() {
    console.log('DID UPDATE ' + this.state.context_id)
    if (this.state.context_type == 'Incident') {
      platformWidgetHelper.updateHeight(500)
      platformWidgetHelper.show()
    }
  }

  componentDidMount() {
    platformWidgetHelper.registerToEvents('*', this.onWidgetEvent)
    platformWidgetHelper.getContextObject(this.onWidgetContextObject)
  }
  render () {
    return <div>
      <p width='100%' align='center' style={{background:'black', color:'white'}}>{this.state.context_type} {this.state.context_id}</p>
      <REPL context={this.state}/>
    </div>
  }
}

ReactDOM.render(<SamangeWidget />, document.getElementById('widgetRoot'))
