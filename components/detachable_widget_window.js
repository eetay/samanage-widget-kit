import React from 'react'

export default class DetachableWidgetWindow extends React.PureComponent {
  constructor(props) {
    super(props)
    this.containerEl = document.createElement('div');
    this.externalWindow = null;
    this.state = { portal: false }
  }

  windowOptionsReducer = (accumulated_options, option) => {
    accumulated_options = (accumulated_options == '') ? '' : accumulated_options + ','
    return accumulated_options + (option + '=' + this.props.windowOptions[option])
  }

  closeWindow = () => {
    this.setState({ portal: false })
    this.externalWindow && this.externalWindow.close();
    this.externalWindow = null
  }

  openWindow = () => {
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
    return this.state.portal ? ReactDOM.createPortal(<div>{this.props.children}<button onClick={this.closeWindow}>Close me!</button></div>, this.containerEl) : <div>{this.props.children}<button onClick={this.openWindow}>Open me!</button></div>
  }

  componentDidMount() {
    console.log('componentDidMount')
    this.closeWindow() // initial state of window when widget is launched
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    this.closeWindow() // close window when unmounting
  }
}

