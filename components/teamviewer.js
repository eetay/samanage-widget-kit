import React, {Component} from 'react'

export default class TeamViewer extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  openTeamViewer = ()  => {
    var client_id = '163227-2trjZzUFzC6JXp96Wdi2'
    var client_secret = 'afFakDH8scyGwKZNZ72M'
    var redirect_uri = 'http://localhost:3000' + platformWidgetHelper.oauth.buildRedirectUrl()
    var teamviewer_url = 'https://webapi.teamviewer.com/api/v1/oauth2/authorize?' + platformWidgetHelper.toQueryString({
      response_type: 'code',
      client_id: client_id,
      redirect_uri: redirect_uri,
      state: '1234',
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

TeamViewer.getTeamViewerToken = function(event) {
  try {
    var code = event.query_params.code
    var client_id = '163227-2trjZzUFzC6JXp96Wdi2'
    var client_secret = 'afFakDH8scyGwKZNZ72M'
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
      console.log('AJAX STATE', this.status, this.readyState)
      if (this.readyState == 4) {
        if (this.status == 200) {
        }
        console.log('AJAX DONE', xhttp.responseText)
        debugger
      }
    }
    xhttp.open('POST', 'https://webapi.teamviewer.com/api/v1/oauth2/token', true)
    console.log('AJAX SEND')
    var post_data = platformWidgetHelper.toQueryString({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'http://localhost:3000' + platformWidgetHelper.oauth.buildRedirectUrl(),
      client_id: client_id,
      client_secret: client_secret
    }).replace(/%20/g, '+')
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    debugger
    xhttp.send(post_data)
  }
  catch(e) {
    console.error(e)
  }
}
