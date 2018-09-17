import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import LogMeInWidget, { STORAGE_KEY } from './LogMeInWidget'

export default class SamangeWidget extends Component {
  constructor (props) {
    super(props)
    this.state = { context: {}, code: null }
  }

  onWidgetContextObject = (object) => {
    this.setState({ context: object })
  }

  componentDidUpdate () {
    const { context } = this.state
    if (context.context_type !== 'Incident') {
      platformWidgetHelper.hide()
    } else {
      platformWidgetHelper.updateHeight()
    }
  }

  componentDidMount () {
    platformWidgetHelper.getContextObject(this.onWidgetContextObject)
    platformWidgetHelper.getStorage(STORAGE_KEY, this.getTokenFromStorage)
  }

  getTokenFromStorage = (response) => {
    console.log(`\nlogmein >>> getting local storage: ${response}`)
    if (response) {
      response = JSON.parse(response)
      this.setState({ code: response.code ? response.code : '' })
    } else {
      this.setState({ code: '' })
    }
  }

  render () {
    const { context, code } = this.state
    if (!context.context_id || code === null) return null
    return (
      <div className='slds slds-samanage samanage-media-query'>
        <LogMeInWidget contextId={context.context_id} code={code} />
      </div>
    )
  }
}

ReactDOM.render(<SamangeWidget />, document.getElementById('widgetRoot'))
