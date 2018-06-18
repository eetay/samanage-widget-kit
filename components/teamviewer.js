import React, {Component} from 'react'

/*
  This component renders a button
  which opens the TeamViewer authentication window
  The component recieves the result of authentication
*/

export default class TeamViewer extends React.PureComponent {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    window.addEventListener('message', this.onWidgetEvent)
  }
  onWidgetEvent = (message) => {
    if (message.data.requestType == 'dispatchEventToWidgets') {
      debugger
      event = message.data.event
      if (event.eventType == 'oauthRedirect') {
        this.getTeamViewerToken(event)
      }
    }
  }

  getTeamViewerToken = (event) => {
    // this whole function should be moved to server side
    try {
      var code = event.query_params.code
      var client_id = '163227-2trjZzUFzC6JXp96Wdi2'
      var client_secret = 'afFakDH8scyGwKZNZ72M'
      var xhttp = new XMLHttpRequest()
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          alert(`getTeamViewerToken completed(${this.status}): ${JSON.stringify(xhttp.responseText)}`)
          if (this.status == 200) {
            // do some stuff here
          }
        }
      }
      xhttp.open('POST', 'https://webapi.teamviewer.com/api/v1/oauth2/token', true)
      var post_data = platformWidgetHelper.toQueryString({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'http://localhost:3000' + platformWidgetHelper.oauth.buildRedirectUrl(),
        client_id: client_id,
        client_secret: client_secret
      }).replace(/%20/g, '+')
      xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
      xhttp.send(post_data)
    }
    catch(e) {
      console.error(e)
    }
  }
  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   if (this.props.oauth_event && (this.props.oauth_event != prevProps.oauth_event)) {
  //     debugger
  //     this.getTeamViewerToken(this.props.oauth_event)
  //   }
  // }
  openTeamViewer = ()  => {
    var client_id = '163227-2trjZzUFzC6JXp96Wdi2'
    var client_secret = 'afFakDH8scyGwKZNZ72M'
    var redirect_uri = 'http://localhost:3000' + platformWidgetHelper.oauth.buildRedirectUrl()
    var teamviewer_url = 'https://webapi.teamviewer.com/api/v1/oauth2/authorize?' + platformWidgetHelper.toQueryString({
      response_type: 'code',
      client_id: client_id,
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

