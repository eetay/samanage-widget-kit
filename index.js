import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import REPL from './components/repl.js'
import ReactJson from 'react-json-view'

export default class SamangeWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {events:[], context:{}}
  }
  onWidgetEvent = (event) => {
    console.log('WIDGET_EVENT:', arguments)
    this.setState({events: [...this.state.events, event]})
  }
  onWidgetContextObject = (object) => {
    console.log('CONTEXT:', object)
    platformWidgetHelper.hide()
    this.setState({context: object})
  }
  componentDidUpdate() {
    console.log('DID UPDATE')
    if (this.state.context.context_type == 'Incident') {
      platformWidgetHelper.updateHeight(1500)
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
      <REPL context={this.state.context}/>
      <ReactJson src={this.state.events} name="events" collapsed="2"/>
    </div>
  }
}

ReactDOM.render(<SamangeWidget />, document.getElementById('widgetRoot'))
