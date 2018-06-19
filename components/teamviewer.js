import React, {Component} from 'react'

/*
  This component manages oauth authentication for teamviewer
  it renders a button which opens the TeamViewer authentication window
  and recieves the result of authentication
*/

export default class TeamViewer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.credentials = null
    this.state = {state: TeamViewer.NOT_AUTHENTICATED}
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
      this.getTeamViewerToken(event)
    }
  }

  getTeamViewerToken = (event) => {
    // Note: this whole function should be moved to server side (because of 'client_secret')
    try {
      var component = this
      var code = event.query_params.code
      var client_secret = 'mtb9f665VxDC6HvduidM'
      var xhttp = new XMLHttpRequest()
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          alert(`getTeamViewerToken completed(${this.status}): ${JSON.stringify(xhttp.responseText)}`)
          if (this.status == 200) {
            component.credentials = xhttp.responseText
            component.setState({state: TeamViewer.AUTHENTICATED})
          }
          else {
            component.credentials = null
            component.setState({state: TeamViewer.AUTH_ERROR})
          }
        }
      }
      xhttp.open('POST', 'https://webapi.teamviewer.com/api/v1/oauth2/token', true)
      var post_data = platformWidgetHelper.toQueryString({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://app.samanagestage.com' + platformWidgetHelper.oauth.buildRedirectUrl(),
        client_id: this.props.client_id,
        client_secret: client_secret
      }).replace(/%20/g, '+')
      xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
      xhttp.send(post_data)
    }
    catch(e) {
      console.error(e)
    }
  }

  openTeamViewer = ()  => {
    this.setState({state: TeamViewer.AUTH_IN_PROGRESS})
    var redirect_uri = 'https://app.samanagestage.com' + platformWidgetHelper.oauth.buildRedirectUrl()
    var teamviewer_url = 'https://webapi.teamviewer.com/api/v1/oauth2/authorize?' + platformWidgetHelper.toQueryString({
      response_type: 'code',
      client_id: this.props.client_id,
      redirect_uri: redirect_uri,
      state: platformWidgetHelper.toQueryString({closeWindow: true}),
      display: 'popup'
    })
    console.log({teamviewer_url: teamviewer_url})
    this.setState({
      teamviewer_window: window.open(teamviewer_url, '_blank', 'height=600,width=800,status=yes,toolbar=no,menubar=no,location=no')
    })
  }
  render() {
    return <button onClick={this.openTeamViewer}>TeamViewer</button>
  }
}

TeamViewer.AUTH_IN_PROGRESS = 'in-progress'
TeamViewer.AUTHENTICATED = 'authenticated'
TeamViewer.AUTH_ERROR = 'error'
TeamViewer.NOT_AUTHENTICATED = 'not-authenticated'

