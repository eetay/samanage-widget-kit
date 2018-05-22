import React from 'react'
import ReactDOM from 'react-dom'

export default class DetachableWidgetWindow extends React.PureComponent {
  constructor(props) {
    super(props);
    // STEP 1: create a container <div>
    this.containerEl = document.createElement('div');
    this.externalWindow = null;
    this.state = { portal: false }
  }

  hideWindow = () => {
    this.setState({ portal: false })
    this.externalWindow && this.externalWindow.close();
    this.externalWindow = null
  }

  windowOptionsReducer = (accumulated_options, option) => {
    accumulated_options = (accumulated_options == '') ? '' : accumulated_options + ','
    return accumulated_options + (option + '=' + this.props.windowOptions[option])
  }

  showWindow = () => {
    let window_options = Object.keys(this.props.windowOptions).reduce(this.windowOptionsReducer,'')
    console.log(window_options)
    this.externalWindow = window.open('', '', window_options);
    var self=this
    this.externalWindow.onbeforeunload = function () {
      self.setState({ portal: false })
      self.externalWindow = null
    }
    this.externalWindow.document.body.appendChild(this.containerEl);
    this.setState({ portal: true })
  }

  render() {
    console.log('RENDER', this.portal, this.state.showWindowPortal )
    return this.state.portal ? ReactDOM.createPortal(<div>{this.props.children}<button onClick={this.hideWindow}>Close me!</button></div>, this.containerEl) : <div>{this.props.children}<button onClick={this.showWindow}>Open me!</button></div>
  }

  componentDidMount() {
    console.log('componentDidMount')
    this.showWindow()
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    this.hideWindow()
  }
}

