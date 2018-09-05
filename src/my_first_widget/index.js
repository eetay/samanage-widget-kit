import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ReactJson from 'react-json-view'
import LogMeInWidget from 'shared/components/LogMeInWidget'

export default class SamangeWidget extends Component {
  constructor (props) {
    super(props)
    this.state = { events: [], context: {} }
  }

  onWidgetEvent = (event) => {
    const { events } = this.state
    console.log('NEW EVENT:', event)
    this.setState({ events: [...events, event] })
  }

  onWidgetContextObject = (object) => {
    console.log('NEW CONTEXT:', object)
    platformWidgetHelper.show()
    this.setState({ context: object })
  }

  componentDidUpdate () {
    const { context } = this.state
    console.log('DID UPDATE1', context, context.context_type)
    if (context.context_type === 'Incident') {
      platformWidgetHelper.updateHeight(1500)
      platformWidgetHelper.show()
    }
  }


  componentDidMount () {
    platformWidgetHelper.registerToEvents('*', this.onWidgetEvent)
    platformWidgetHelper.getContextObject(this.onWidgetContextObject)
  }

  renderEvent (event) {
    console.log('EVENT RENDER', event)
    const name = event.eventType || 'JSON event'
    return (
      <div style={{ padding: '3px' }}>
        {React.createElement(ReactJson, { theme: 'monokai', src: event, name, collapsed: '0' })}
      </div>
    )
  }

  render () {
    console.log('RENDER')
    return (
      <div className='slds slds-samanage samanage-media-query'>
        <LogMeInWidget />
      </div>
    )
  }
}

ReactDOM.render(<SamangeWidget />, document.getElementById('widgetRoot'))
