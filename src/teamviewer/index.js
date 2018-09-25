import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ReactJson from 'react-json-view'
import REPL from 'shared/components/repl.js'
import ReactDetachableWindow from 'react-detachable-window'
import OAuthAuthenticator from 'shared/components/oauth_authenticator.js'
import classes from './index.scss'

const VIEW_MODE = {
  LOGIN: 'LOGIN',
  DISPLAY_PIN: 'DISPLAY_PIN'
}

const EventBus = {
  refs: {},
  setState (id, state) {
    const bus = EventBus
    return bus.call(id, 'setState', state)
  },
  call (id, funcName, ...params) {
    const bus = EventBus
    const instance = bus.refs[id].current
    return instance[funcName].apply(instance, ...params)
  },
  getRef (id, component) {
    const bus = EventBus
    if ((component == null) && bus.refs[id]) {
      delete bus.refs[id]
    }
    let ref = bus.refs[id]
    if (!ref) {
      ref = React.createRef()
      bus.refs[id] = ref
    }
    return ref
  }
}

window.bus = EventBus


export default class SamangeWidget extends Component {
  constructor (props) {
    super(props)
    this.state = {
      view: VIEW_MODE.LOGIN,
      events: [],
      context: {},
      showWindowPortal: true,
      clientId: '',
      clientSecret: '',
      sessionDetails: {}
    }
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
    platformWidgetHelper.updateHeight()
  }


  componentDidMount () {
    platformWidgetHelper.registerToEvents('*', this.onWidgetEvent)
    platformWidgetHelper.getContextObject(this.onWidgetContextObject)
  }

  updateState = (response) => {
    this.setState({ sessionDetails: JSON.parse(response), view: VIEW_MODE.DISPLAY_PIN })
  }

   createTeamViewerSession = (token, cb) => {
     const xhttp = new XMLHttpRequest()
     xhttp.onreadystatechange = function() {
       if (this.readyState === 4) {
        debugger// eslint-disable-line
         console.log('DONE', this.responseText, this.status)

         cb(this.responseText)
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
     }))
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

  onClientSecretChange = (event) => {
    this.setState({ clientSecret: event.target.value })
  }

  onClientIDChange = (event) => {
    this.setState({ clientId: event.target.value })
  }

  renderSessionPin = () => (
    <div className='slds slds-samanage samanage-media-query'>
      <PlatformWidgetComponents.RegularText className={classes.topText}>
          Your Session Code is:
      </PlatformWidgetComponents.RegularText>
      <PlatformWidgetComponents.LargeText className={classes.pinText}>
        {this.state.sessionDetails.code}
      </PlatformWidgetComponents.LargeText>
      <PlatformWidgetComponents.RegularText className={classes.topText}>
          Your Link Code is:
      </PlatformWidgetComponents.RegularText>
      <PlatformWidgetComponents.LargeText className={classes.topText}>
        {this.state.sessionDetails.end_customer_link}
      </PlatformWidgetComponents.LargeText>
      <PlatformWidgetComponents.RegularText className={classes.topText}>
          For Help :
      </PlatformWidgetComponents.RegularText>
      <PlatformWidgetComponents.LargeText className={classes.topText}>
        {this.state.sessionDetails.supporter_link}
      </PlatformWidgetComponents.LargeText>
    </div>
  )

  renderLogin = () => {
    const { clientId, clientSecret } = this.state
    return (
      <div className='slds slds-samanage samanage-media-query'>
        <PlatformWidgetComponents.TextField label='Client Secret' onChange={this.onClientSecretChange} value={clientSecret} />
        <PlatformWidgetComponents.TextField label='Client ID' onChange={this.onClientIDChange} value={clientId} />
        <OAuthAuthenticator
          on_state_change={({ state, credentials }) => {
            console.log(`TeamViewer auth state: ${state}`)
            if (state === OAuthAuthenticator.AUTHENTICATED) this.createTeamViewerSession(credentials.access_token, this.updateState)
          }}
          client_id={clientId}
          client_secret={clientSecret}
          token_url='https://webapi.teamviewer.com/api/v1/oauth2/token'
          authorization_url='https://webapi.teamviewer.com/api/v1/oauth2/authorize?'
        />
      </div>
    )
  }

  render () {
    console.log('RENDER')
    const { view } = this.state
    switch (view) {
      case VIEW_MODE.LOGIN: return this.renderLogin()
      // case VIEW_MODE.GENERATE_PIN: return this.renderGenerateSession()
      case VIEW_MODE.DISPLAY_PIN: return this.renderSessionPin()
      default: return null
    }
  }
}

ReactDOM.render(<SamangeWidget />, document.getElementById('widgetRoot'))
