import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import contextTypes from 'shared/constants/contextTypes'
import TeamViewer from './TeamViewer'

export default class SamangeWidget extends Component {
  constructor (props) {
    super(props)
    this.state = {
      contextId: ''
    }
  }

  onWidgetContextObject = (object) => {
    if (object.context_type !== contextTypes.INCIDENT) {
      platformWidgetHelper.hide()
    } else { this.setState({ contextId: object.context_id }) }
  }

  componentDidUpdate () {
    platformWidgetHelper.updateHeight(3500)
  }

  componentDidMount () {
    console.log('componentDidMount')
    platformWidgetHelper.getContextObject(this.onWidgetContextObject)
    // platformWidgetHelper.getStorage(STORAGE_KEY, this.getTokenFromStorage)
  }

  // getTokenFromStorage = (response) => {
  //   if (response) {
  //     response = JSON.parse(response)
  //     this.setState({ code: response.code ? response.code : '' })
  //   } else {
  //     this.setState({ code: '' })
  //   }
  // }

  render () {
    const { contextId } = this.state
    return (
      <div className='slds slds-samanage samanage-media-query'>
        <TeamViewer contextId={contextId} />
      </div>
    )
  }
}

ReactDOM.render(<SamangeWidget />, document.getElementById('widgetRoot'))
