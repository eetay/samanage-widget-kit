import React, { PureComponent } from 'react'

export default class LogMeInWidget extends PureComponent {
  constructor (props) {
    super(props)
    this.state = { email: '', password: '' }
  }

  componentDidUpdate () {
  }


  componentDidMount () {
  }

  onEmailChange = (event) => {
    console.log('onEmailChange:', event.target.value) // eslint-disable-line
    this.setState({ email: event.target.value })
  }

  onPasswordChange = (event) => {
    console.log('onPasswordChange:', event.target.value) // eslint-disable-line
    this.setState({ password: event.target.value })
  }

  render () {
    console.log('LogMeInWidget RENDER') // eslint-disable-line
    const { email, password } = this.state
    return (
      <div className='slds slds-samanage samanage-media-query'>
        <PlatformWidgetComponents.TextField label='Email' onChange={this.onEmailChange} value={email} />
        <PlatformWidgetComponents.TextField label='Password' onChange={this.onPasswordChange} value={password} />
        <PlatformWidgetComponents.Button>
          Sign In
        </PlatformWidgetComponents.Button>
      </div>
    )
  }
}
