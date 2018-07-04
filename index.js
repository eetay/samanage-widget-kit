import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ReactJson from 'react-json-view'
import REPL from './components/repl.js'
import DetachableWidgetWindow from './components/detachable_widget_window.js'
import OAuthAuthenticator from './components/oauth_authenticator.js'


function createTeamViewerSession (token) {
  const xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      console.log('DONE', this.responseText, this.status)
      alert(JSON.stringify({ response: this.responseText, status: this.status }))
    }
    console.log('state change: ', this.readyState)
  }
  xhttp.open('POST',
    'https://l6tw4zzxz1.execute-api.us-east-1.amazonaws.com/prod/api/v1/sessions',
    // 'https://webapi.teamviewer.com/api/v1/ping',
    true)
  xhttp.setRequestHeader('Authorization', `Bearer ${token}`)
  xhttp.setRequestHeader('Content-Type', 'application/json')
  xhttp.send(JSON.stringify({
    groupname: 'Samanage',
    description: 'Hello, I have an issue with my printer, can you please assist?',
    end_customer: { name: 'Peter Niedhelp' },
    waiting_message: 'xxxxA',
    custom_api: JSON.stringify({ ticket_id: '535824' })
  }))
}


export default class SamangeWidget extends Component {
  constructor (props) {
    super(props)
    this.state = { events: [], context: {}, showWindowPortal: true }
  }

  onWidgetEvent = (event) => {
    console.log('NEW EVENT:', event)
    this.setState({ events: [...this.state.events, event] })
  }

  onWidgetContextObject (object) {
    console.log('NEW CONTEXT:', object)
    platformWidgetHelper.show()
    this.setState({ context: object })
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    console.log('DID UPDATE1', this.state.context, this.state.context.context_type)
    if (this.state.context.context_type == 'Incident') {
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
      <div>
        <p width='100%' align='center' style={{ background: 'black', color: 'white' }}>
          {this.state.context_type}
          {' '}
          {this.state.context_id}
        </p>
        <DetachableWidgetWindow windowOptions={{ width: 800, height: 600 }}>
          <REPL id='repl' context={this.state.context} />
        </DetachableWidgetWindow>
        <OAuthAuthenticator
          on_state_change={({ state, credentials }) => {
            console.log(`TeamViewer auth state: ${state}`)
            if (state == OAuthAuthenticator.AUTHENTICATED) createTeamViewerSession(credentials.access_token)
          }}
          client_id='163336-hrZ8NicCJrPjtyDyoMkl'
          client_secret='mtb9f665VxDC6HvduidM'
          token_url='https://webapi.teamviewer.com/api/v1/oauth2/token'
          authorization_url='https://webapi.teamviewer.com/api/v1/oauth2/authorize?'
        />
        <div style={{ border: '1px solid black' }}>
          {this.state.events.map(this.renderEvent)}
        </div>
      </div>
    )
  }
}

ReactDOM.render(<SamangeWidget />, document.getElementById('widgetRoot'))
