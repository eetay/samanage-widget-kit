import React, { Component } from 'react'
import ReactJson from 'react-json-view'


const isFunction = obj => (!!(obj && obj.constructor && obj.call && obj.apply))
const functionProto = (name, func) => (name + func.toString().match(/\(.*\)/)[0])

function sharedStart (array) {
  const A = array.concat().sort()


  const a1 = A[0]; const a2 = A[A.length - 1]; const L = a1.length; let i = 0
  while (i < L && a1.charAt(i) === a2.charAt(i)) i++
  return a1.substring(0, i)
}

const evalWithinContext = function(context, code) {
  (function(code) { return eval(code) }).apply(context, [code])
}

function typeInTextarea (el, newText) {
  if (document.queryCommandSupported('insertText')) {
    el.focus()
    document.execCommand('insertText', true, newText)
  } else {
    const start = el.selectionStart
    const end = el.selectionEnd
    const text = el.value
    const before = text.substring(0, start)
    const after = text.substring(end, text.length)
    el.value = (before + newText + after)
    el.selectionStart = el.selectionEnd = start + newText.length
    el.focus()
  }
}

export default class REPL extends Component {
  constructor (props) {
    console.log('REPL props', props)
    super(props)
    this.state = {
      code: 'platformWidgetHelper.callSamanageAPI(\n\t"get",\n\t"/incidents/"+context.context_id+".json",\n\t{}\n)',
      result: [{ TODO: 'Press "Evaluate!"' }],
      completions: []
    }
    this.createEvalContext = this.createEvalContext.bind(this)
    this.evalContext = this.createEvalContext()
  }

  evaluate = (event) => {
    this.setState({ code: this.refs.code.value, result: [] }, function() {
      this.evalContext(this.refs.code.value)
    })
  }

  printResult = (data) => {
    console.log('last_result:', data)
    this.setState({ result: [...this.state.result, data] })
    return data
  }

  completionsOf (value) {
    const matches_array = value.match(/[A-Za-z.]+\(?$/)
    if (!matches_array) return null
    const parts = matches_array[0].split('.')
    const incomplete_term = parts.slice(-1)[0]
    const expression = parts.length > 1 ? parts.slice(0, -1).join('.') : 'this'
    console.log('exp+term=', expression, incomplete_term)
    let object
    try {
      object = eval(expression) // this.evalContext(expression)
    } catch (e) {
      object = window
    }
    // if (incomplete_term && (typeof object != 'object')) object = this
    if (incomplete_term && isFunction(object[incomplete_term])) {
      return [incomplete_term, functionProto(incomplete_term, object[incomplete_term])]
    }
    return [incomplete_term, ...Object.keys(object).filter(attr => attr.startsWith(incomplete_term))]
  }

  onKeyPress = (event) => {
    if (event.key.match(/[A-Za-z.]/)) {
      const completions = this.completionsOf(event.target.value.substring(0, event.target.selectionStart) + event.key)
      if (!completions) return
      console.log('COMPLETIONS', completions)
      this.setState({ completions: completions.slice(1) })
    } else if (event.key == '~') {
      event.preventDefault()
      let completions = this.completionsOf(event.target.value.substring(0, event.target.selectionStart))
      console.log('COMPLETING', completions)
      if (!completions) return
      typeInTextarea(event.target, sharedStart(completions.slice(1)).substring(completions[0].length))
      // let new_code = event.target.value.substring(0, event.target.selectionStart) + completions[0] + event.target.value.substring(event.target.selectionStart)
      console.log('####', event.target.value.substring(0, event.target.selectionStart))
      completions = this.completionsOf(event.target.value.substring(0, event.target.selectionStart))
      if (!completions) {
        this.setState({ completions: [] })
        return
      }
      console.log('COMPLETIONS', completions)
      this.setState({ completions: completions.slice(1) })
    } else {
      this.setState({ completions: [] })
    }
  }

  createEvalContext = () => {
    const self = this
    return function(code) {
      const context = self.props.context
      const printResult = self.printResult
      // var platformWidgetHelper = function () {return 3}
      let result
      try {
        result = eval(code)
      } catch (e) {
        result = e.toString()
      }
      if (result && typeof result.then === 'function') {
        printResult('Waiting for result...')
        result.then(printResult)
      } else {
        printResult(result)
      }
    }
  }

  componentDidCatch (error, info) {
    this.setState({ result: { error: error.toString(), info } })
  }

  render () {
    console.log('REPL render', this.props)
    return (
      <div>
        <ReactJson src={this.props.context} name='context' />
        <p>
          <textarea style={{ width: '100%' }} rows='7' ref='code' defaultValue={this.state.code} onKeyPress={this.onKeyPress} />
          <button onClick={this.evaluate}>
Evaluate!
          </button>
        </p>
        <textarea style={{ width: '100%' }} rows='3' value={this.state.completions.join('\n')} />
        <ReactJson src={this.state.result} name='result' collapsed='2' />
      </div>
    )
  }
}
