import React, {Component} from 'react'
import ReactDOM from 'react-dom'

export default class SamangeWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    platformWidgetHelper.updateHeight(1000)
    platformWidgetHelper.hide() // should be the default!

    // Make 'static' functions per-instance (i.e. access to 'this')
    this.onWidgetContextObject = this.onWidgetContextObject.bind(this)
    this.onWidgetEvent = this.onWidgetEvent.bind(this)
  }
  onWidgetEvent(){
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
      platformWidgetHelper.show()
    }
  }

  componentDidMount() {
    platformWidgetHelper.registerToEvents('*', this.onWidgetEvent)
    platformWidgetHelper.getContextObject(this.onWidgetContextObject)
  }
  render () {
    console.log('RENDER ' + this.state.context_id)
    return <p>My context is {this.state.context_type} {this.state.context_id}</p>
  }
}

ReactDOM.render(<SamangeWidget />, document.getElementById('widgetRoot'))
