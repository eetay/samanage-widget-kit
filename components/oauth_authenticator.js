import React, {Component} from 'react'

function createTeamViewerSession(token) {
  var xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      console.log('DONE', this.responseText, this.status)
      alert(JSON.stringify({response: this.responseText, status:this.status}))
    }
    console.log('state change: ', this.readyState)
  }
  xhttp.open('POST',
    'https://l6tw4zzxz1.execute-api.us-east-1.amazonaws.com/prod/api/v1/sessions',
    //'https://webapi.teamviewer.com/api/v1/ping',
     true)
  xhttp.setRequestHeader('Authorization', 'Bearer ' + token)
  xhttp.setRequestHeader('Content-Type', 'application/json')
  xhttp.send(JSON.stringify({
    "groupname" : "Samanage",
    "description" : "Hello, I have an issue with my printer, can you please assist?",
    "end_customer" : { "name" : "Peter Niedhelp" },
    "waiting_message" : "xxxxA",
    "custom_api" : JSON.stringify({ "ticket_id" : "535824" })
  }))
}

/*
  This component manages oauth authentication process
  it renders a button which opens the 3rd party login window
  and recieves the result of authentication - a oauth token
*/

export default class OAuthAuthenticator extends React.PureComponent {
  constructor(props) {
    super(props)
    this.credentials = null
    this.externalWindow = null
    this.state = {state: OAuthAuthenticator.NOT_AUTHENTICATED, externalWindow: false}
  }

  componentDidMount() {
    window.addEventListener('message', this.dispatchWidgetMessage, false)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.dispatchWidgetMessage, false)
  }

  dispatchWidgetMessage = (message) => {
    if (message.data.requestType == 'dispatchEventToWidgets') {
      this.onWidgetEvent(message.data.event)
    }
  }

  onWidgetEvent = (event) => {
    if (event.eventType == 'oauthRedirect') {
      this.getToken(event)
    }
  }

  getToken = (event) => {
    // Note: this whole function should be moved to server side (because of 'client_secret')
    try {
      var component = this
      var code = event.query_params.code
      var xhttp = new XMLHttpRequest()
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          alert(`getToken completed:(${this.status}): ${this.responseText}`)
          if (this.status == 200) {
            component.credentials = JSON.parse(this.responseText)
            createTeamViewerSession(component.credentials.access_token)
            component.setState({state: OAuthAuthenticator.AUTHENTICATED})
          }
          else {
            component.credentials = null
            component.setState({state: OAuthAuthenticator.AUTH_ERROR})
          }
        }
      }
      xhttp.open('POST',  this.props.token_url, true)
      var post_data = platformWidgetHelper.toQueryString({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://app.samanagestage.com' + platformWidgetHelper.oauth.buildRedirectUrl(),
        client_id: this.props.client_id,
        client_secret: this.props.client_secret
      }).replace(/%20/g, '+')
      xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
      xhttp.send(post_data)
    }
    catch(e) {
      console.error(e)
    }
  }

  closeExternalWindow = () => {
    if (this.externalWindow) this.externalWindow.close()
    this.externalWindow = null
    this.setState({ externalWindow: false })
  }

  focusExternalWindow = () => {
    if (this.externalWindow) {
      this.externalWindow.focus()
    } else {
      this.closeExternalWindow()
    }
  }

  openOAuthAuthenticator = ()  => {
    this.setState({state: OAuthAuthenticator.AUTH_IN_PROGRESS})
    var redirect_uri = 'https://app.samanagestage.com' + platformWidgetHelper.oauth.buildRedirectUrl()
    var OAuthAuthenticator_url = this.props.authorization_url + platformWidgetHelper.toQueryString({
      response_type: 'code',
      client_id: this.props.client_id,
      redirect_uri: redirect_uri,
      state: platformWidgetHelper.toQueryString({closeWindow: true}),
      display: 'popup'
    })
    console.log({OAuthAuthenticator_url: OAuthAuthenticator_url})
    this.externalWindow = window.open(OAuthAuthenticator_url, '_blank', 'height=600,width=800,status=yes,toolbar=no,menubar=no,location=no')
    var self = this
    this.externalWindow.onbeforeunload = function () {
      self.setState({ externalWindow: false })
      self.externalWindow = null
    }
    this.setState({ externalWindow: true })
  }
  render() {
    return <button onClick={this.state.externalWindow ? this.focusExternalWindow : this.openOAuthAuthenticator}>Login</button>
  }
}

OAuthAuthenticator.AUTH_IN_PROGRESS = 'in-progress'
OAuthAuthenticator.AUTHENTICATED = 'authenticated'
OAuthAuthenticator.AUTH_ERROR = 'error'
OAuthAuthenticator.NOT_AUTHENTICATED = 'not-authenticated'

