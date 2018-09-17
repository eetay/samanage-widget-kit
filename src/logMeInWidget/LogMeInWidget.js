import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import LogMeInIcon from './LogMeInIcon'
import classes from './LogMeInWidget.scss'

const VIEW_MODE = {
  LOGIN: 'LOGIN',
  GENERATE_PIN: 'GENERATE_PIN',
  DISPLAY_PIN: 'DISPLAY_PIN'
}

const errors = {
  ERROR: 'An unspecified error occured',
  INVALID: 'Incorrect email or password, please try again',
  INVALIDPARAM_NODE: 'The node (id) provided is not the id of the existing user',
  NOTLOGGEDIN: 'Current user is not logged in',
  NOTTECHNICIAN: 'PIN was not requested by a technician',
  OUTOFPINCODES: 'Out of PIN codes - contact your administrator',
  POLLRATEEXCEEDED: 'You have concurrently requested too many PINs',
  INVALID_SECRETAUTHCODE: 'Authcode was invalid or expired, please re-authenticate',
  USER_IS_DELETED: 'The user whose authorization code was specified is deleted',
  USER_DELETED_OR_DISABLED: 'The user whose authorization code was specified is deleted or disabled',
  INVALIDPINFORMAT: 'The format of the PIN code is incorrect'
}

const URL_PREFIX = 'https://secure.logmeinrescue.com'
let comment = {}

export const STORAGE_KEY = 'LogMeIN'

export default class LogMeInWidget extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      view: VIEW_MODE.LOGIN,
      code: '',
      pin: '',
      error: ''
    }
  }

  static propTypes = {
    contextId: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired
  }

  componentDidMount () {
    const { code } = this.props
    if (code.length > 0) this.setState({ view: VIEW_MODE.GENERATE_PIN, code })
  }

  componentDidUpdate () {
    platformWidgetHelper.updateHeight()
  }

  onEmailChange = (event) => {
    this.setState({ email: event.target.value })
  }

  onPasswordChange = (event) => {
    this.setState({ password: event.target.value })
  }

  handleError = (e) => {
    const error = errors[e.trim()] || 'An unknown error occured'
    this.setState({ view: VIEW_MODE.LOGIN, error })
    return null
  }

  getValueFromResponse = (response, key) => {
    if (response.indexOf('OK') === -1) {
      return this.handleError(response)
    }
    const splitArr = response.split(key)
    if (splitArr.length > 0) return splitArr[1]
    return null
  }

  getResponse = (response) => {
    const code = this.getValueFromResponse(response, 'AUTHCODE:')
    if (!code) return
    const storageValue = { code }
    platformWidgetHelper.setStorage(STORAGE_KEY, JSON.stringify(storageValue), null) // () => console.log('Added to storage'))
    this.setState({ view: VIEW_MODE.GENERATE_PIN, code })
  }

  getPinResponse = (response) => {
    const pin = this.getValueFromResponse(response, 'PINCODE:')
    if (!pin) return
    const link = `${URL_PREFIX}/R?i=2&Code=${pin}`
    comment = {
      comment: {
        body: `<![CDATA[<p>Click the link below to launch your Rescue session.\n<a href="${link}">${link}</a></p>`,
        is_private: false
      }
    }
    this.setState({ view: VIEW_MODE.DISPLAY_PIN, pin })
  }

  onButtonClick = () => {
    const { email, password } = this.state
    if (email.length === 0 || password.length === 0) return
    const url = `${URL_PREFIX}/api/requestAuthCode.aspx?email=${email}&pwd=${password}`
    platformWidgetHelper.callExternalAPI('GET', url, null, this.getResponse)
  }

  generatePin = () => {
    const { code } = this.state
    const { contextId } = this.props
    const pinUrl = `${URL_PREFIX}/api/requestPINCode.aspx?notechconsole=1&authcode=${code}&tracking0=${contextId}`
    platformWidgetHelper.callExternalAPI('GET', pinUrl, null, this.getPinResponse)
  }

  sendLinkToComment = () => {
    const { contextId } = this.props
    platformWidgetHelper.callSamanageAPI('POST', `/incidents_moria/${contextId}/comments.json`, comment, (response) => {
      if (response.errorStatus) this.handleError('ERROR')
      // window.parent.location = document.referrer
    })
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter') this.onButtonClick()
  }

  renderSessionPin = () => (
    <div className={classes.topDiv}>
      <PlatformWidgetComponents.RegularText className={classes.topText}>
          Your Session Pin is:
      </PlatformWidgetComponents.RegularText>
      <PlatformWidgetComponents.LargeText className={classes.pinText}>
        {this.state.pin}
      </PlatformWidgetComponents.LargeText>
      <PlatformWidgetComponents.MainButton onClick={this.sendLinkToComment} className={classes.button}>
          Send Link via Comment
      </PlatformWidgetComponents.MainButton>
      <PlatformWidgetComponents.RegularButton onClick={this.generatePin} className={classes.button}>
        Generate New Code
      </PlatformWidgetComponents.RegularButton>
    </div>
  )

  renderGenerateSession = () => (
    <div className={classes.topDiv}>
      <PlatformWidgetComponents.RegularText className={classes.topText}>
          Click to generate your Session Code. It will be used to conduct a remote support session
      </PlatformWidgetComponents.RegularText>
      <PlatformWidgetComponents.MainButton onClick={this.generatePin} className={classes.button}>
          Generate Session Code
      </PlatformWidgetComponents.MainButton>
    </div>
  )

  renderErrorMessage = (error) => {
    if (!error || error.length === 0) return null
    return (
      <div className={classes.errorText}>
        {error}
      </div>
    )
  }

  renderLogin = () => {
    const { email, password, error } = this.state
    const shouldDisableButton = email.length === 0 || password.length === 0
    const Button = shouldDisableButton ? PlatformWidgetComponents.RegularButton : PlatformWidgetComponents.MainButton
    return (
      <div className={classes.topDiv}>
        { this.renderErrorMessage(error) }
        <PlatformWidgetComponents.TextField label='Email' onChange={this.onEmailChange} value={email} className={classes.input} onKeyPress={this.handleKeyPress} />
        <PlatformWidgetComponents.TextField label='Password' onChange={this.onPasswordChange} value={password} type='password' className={classes.input} onKeyPress={this.handleKeyPress} />
        <Button onClick={this.onButtonClick} className={classes.button} disabled={shouldDisableButton}>
          Sign In
        </Button>
        <LogMeInIcon />
      </div>
    )
  }

  render () {
    const { view } = this.state
    switch (view) {
      case VIEW_MODE.LOGIN: return this.renderLogin()
      case VIEW_MODE.GENERATE_PIN: return this.renderGenerateSession()
      case VIEW_MODE.DISPLAY_PIN: return this.renderSessionPin()
      default: return null
    }
  }
}
