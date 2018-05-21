import React, {Component} from 'react'
import ReactJson from 'react-json-view'


export default class REPL extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      code: 'platformWidgetHelper.callSamanageAPI(\n\t"get",\n\t"/incidents/"+context.context_id+".json",\n\t{},\n\tprintResult\n)',
      result: [{ 'TODO': 'Press "Evaluate!"'}]
    }
    this.createEvalContext = this.createEvalContext.bind(this)
    this.evalContext = this.createEvalContext()
  }

  evaluate = (event) => {
    console.log('evaluate():', arguments[0], this.refs.code.value, event.target)
    this.setState({code: this.refs.code.value, result: []}, function (){
      this.evalContext(this.refs.code.value)
    })
  }

  printResult = (data) => {
    this.setState({result: [...this.state.result, data]})
    return data
  }

  createEvalContext = () => {
    var self = this
    return function(code) {
      var context = self.props.context
      var printResult = self.printResult
      try {
         result = eval(code) || { 'TODO': 'Wait for async result!'}
      }
      catch (e) {
        result = e.toString()
      }
      this.printResult(result)
    }
  }

  componentDidCatch(error, info) {
    this.setState({result: {error: error.toString(), info}})
  }

  render() {
    console.log('RENDER',this.state)
    return <div>
      <ReactJson src={this.props.context} name="context"/>
      <p>
        <textarea style={{'width': '100%', 'max-width':'100%'}} id="code" rows="7" ref="code" defaultValue={this.state.code}/>
        <button onClick={this.evaluate}>Evaluate!</button>
      </p>
      <ReactJson src={this.state.result} name="result" collapsed="2"/>
    </div>
  }
}
