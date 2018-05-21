import React, {Component} from 'react'
import ReactDOM from 'react-dom'

export default class SamangeWidget extends Component {
  constructor(props) {
    super(props);
    platformWidgetHelper.updateHeight(1000)
    // Make 'static' functions non-static
    this.onContextObject = this.onContextObject.bind(this)
    this.onWidgetEvent = this.onWidgetEvent.bind(this)
    this.state = {}
  }
  onWidgetEvent(){
    console.log('WIDGET_EVENT:', arguments)
  }
  onContextObject(object) {
    this.setState(object)
  }
  componentDidUpdate() {
    console.log('DID UPDATE ' + this.state.context_id)
    if (this.state.context_type == 'Incident') {
      platformWidgetHelper.show()
    }
    else {
      platformWidgetHelper.hide()
    }
  }

  componentDidMount() {
    platformWidgetHelper.registerToEvents('*', this.onWidgetEvent)
    platformWidgetHelper.getContextObject(this.onContextObject)
  }
  render () {
    console.log('RENDER ' + this.state.context_id)
    return <p>My context is {this.state.context_type} {this.state.context_id}</p>
  }
}

ReactDOM.render(<SamangeWidget />, document.getElementById('widgetRoot'))
