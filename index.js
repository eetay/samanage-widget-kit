import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import REPL from './components/repl.js'
import ReactJson from 'react-json-view'
import DetachableWidgetWindow from './components/detachable_widget_window.js'

export default class SamangeWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {events:[{a:1},{b:2}], context:{}, showWindowPortal: true}
  }
  onWidgetEvent = (event) => {
    console.log('NEW EVENT:', event)
    this.setState({events: [...this.state.events, event]})
  }
  onWidgetContextObject = (object) => {
    console.log('NEW CONTEXT:', object)
    platformWidgetHelper.hide()
    this.setState({context: object})
  }
  componentDidUpdate() {
    if (this.state.context.context_type == 'Incident') {
      platformWidgetHelper.updateHeight(1500)
      platformWidgetHelper.show()
    }
  }

  componentDidMount() {
    platformWidgetHelper.registerToEvents('*', this.onWidgetEvent)
    platformWidgetHelper.getContextObject(this.onWidgetContextObject)
  }
  renderEvent(event) {
    console.log('EVENT RENDER',event)
    let name = event.eventType||'JSON event'
    return <div style={{'padding':'3px'}}>{React.createElement(ReactJson,{theme: 'monokai', src: event, name: name, collapsed: '0'})}</div>
  }
  render () {
    return <div>
      EETAY IS HERE
      <p width='100%' align='center' style={{background:'black', color:'white'}}>{this.state.context_type} {this.state.context_id}</p>
      <DetachableWidgetWindow windowOptions={{width:800,height:600}}>
        <REPL id='repl' context={this.state.context}/>
      </DetachableWidgetWindow>
      <div style={{'border':'1px solid black;'}}>
        {this.state.events.map(this.renderEvent)}
      </div>
    </div>
  }
}

ReactDOM.render(<SamangeWidget />, document.getElementById('widgetRoot'))
