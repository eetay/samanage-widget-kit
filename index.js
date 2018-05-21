import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import REPL from './components/repl.js'

export default class SamangeWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    platformWidgetHelper.updateHeight(1500)
    platformWidgetHelper.hide() // should be the default!

    // Make 'static' functions per-instance (i.e. access to 'this')
    this.onWidgetContextObject = this.onWidgetContextObject.bind(this)
    this.onWidgetEvent = this.onWidgetEvent.bind(this)
  }
  onWidgetEvent() {
    console.log('WIDGET_EVENT:', arguments)
  }
  onWidgetContextObject(object) {
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
    console.log('RENDER ' + this.state.context_id)
    return <div>
      <REPL context={this.state}/>
    </div>
  }
}

ReactDOM.render(<SamangeWidget />, document.getElementById('widgetRoot'))
