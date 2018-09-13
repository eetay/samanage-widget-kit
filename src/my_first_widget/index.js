import React, { Component } from 'react'
import ReactDOM from 'react-dom'
// import ReactJson from 'react-json-view'
import LogMeInWidget from 'shared/components/LogMeInWidget'

export default class SamangeWidget extends Component {
  constructor (props) {
    super(props)
    this.state = { events: [], context: {} }
  }

  // onWidgetEvent = (event) => {
  //   const { events } = this.state
  //   console.log('NEW EVENT:', event)
  //   this.setState({ events: [...events, event] })
  // }

  onWidgetContextObject = (object) => {
    platformWidgetHelper.show()
    this.setState({ context: object })
  }

  componentDidUpdate () {
    // const { context } = this.state
    platformWidgetHelper.updateHeight()
    // console.log('DID UPDATE1', context, context.context_type)
    // if (context.context_type === 'Incident') {
    //   platformWidgetHelper.updateHeight(1500)
    //   platformWidgetHelper.updateHeight()
    // }
  }

  componentDidMount () {
    // platformWidgetHelper.registerToEvents('*', this.onWidgetEvent)
    platformWidgetHelper.getContextObject(this.onWidgetContextObject)
  }
  //
  // renderEvent (event) {
  //   console.log('EVENT RENDER', event)
  //   const name = event.eventType || 'JSON event'
  //   return (
  //     <div style={{ padding: '3px' }}>
  //       {React.createElement(ReactJson, { theme: 'monokai', src: event, name, collapsed: '0' })}
  //     </div>
  //   )
  // }

  render () {
    const { context } = this.state
    // console.log('index context=', context)
    return (
      <div className='slds slds-samanage samanage-media-query'>
        <LogMeInWidget context={context} />
      </div>
    )
  }
}

ReactDOM.render(<SamangeWidget />, document.getElementById('widgetRoot'))
