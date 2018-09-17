import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import LogMeInWidget from './LogMeInWidget'

export default class SamangeWidget extends Component {
  constructor (props) {
    super(props)
    this.state = { context: {} }
  }

  onWidgetContextObject = (object) => {
    this.setState({ context: object })
  }

  componentDidUpdate () {
    const { context } = this.state
    if (context.context_type !== 'Incident') {
      platformWidgetHelper.hide()
    }
  }

  componentDidMount () {
    platformWidgetHelper.getContextObject(this.onWidgetContextObject)
  }

  render () {
    const { context } = this.state
    if (!context.context_id) return null
    return (
      <div className='slds slds-samanage samanage-media-query'>
        <LogMeInWidget contextId={context.context_id} />
      </div>
    )
  }
}

ReactDOM.render(<SamangeWidget />, document.getElementById('widgetRoot'))
