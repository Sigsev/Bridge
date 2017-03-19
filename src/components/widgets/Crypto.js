import React, { Component } from 'react'
import { connect } from 'react-redux'

import { toggleLock } from 'actions/mode'
import { fetchWidget } from 'actions/widgets'
import TextInput from 'components/TextInput'

@connect(null, { toggleLock, fetchWidget })
class Crypto extends Component {

  state = { now: new Date() }

  componentWillMount () {
    this.start()
  }

  componentWillUpdate (nextProps) {
    const { fetchWidget, id } = this.props

    if (this._int && this.getDiff() > 30) {
      clearInterval(this._int)
      this._int = null
      fetchWidget(id)
    }

    if (!this._int && nextProps.loaded) {
      this.start()
    }
  }

  componentWillUnmount () {
    clearInterval(this._int)
  }

  start = () => {
    this.setState({ now: new Date() })
    this._int = setInterval(() => this.setState({ now: new Date() }), 1E3)
  }

  getDiff = () => {
    const { now } = this.state
    const { values: { timestamp } } = this.props.data
    const date = new Date(timestamp)

    const diff = Math.abs(now.getTime() - date.getTime())
    const secs = Math.ceil(diff / 1000)
    return secs
  }

  savePair = e => {
    const { toggleLock, onSave, data: { config } } = this.props
    const pair = this.refs.text.getWrappedInstance().getText()

    e.preventDefault()
    toggleLock(false)
    onSave({ ...config, pair }, true)
  }

  render () {
    const { edit } = this.props
    const { config: { pair }, values } = this.props.data

    return (
      <div className='w-crypto'>

        {edit ? (
          <form onSubmit={this.savePair}>
            <h3>{'Edit pair'}</h3>
            <TextInput ref='text' defaultValue={pair} placeholder='Pair name' />
          </form>
        ) : (
          <div className='z'>
            <div className='crypto--title'>
              <span>{values.last}</span>
              <span>{pair}</span>
            </div>
            <div className='crypto--update'>
              {`updated ${this.getDiff() === 1 ? '1 sec' : `${this.getDiff()} secs`} ago`}
            </div>
            <div className='crypto--values'>
              <span>
                <i className='ion-arrow-graph-up-right'/>
                {values.high}
              </span>
              <span>
                <i className='ion-arrow-graph-down-right'/>
                {values.low}
              </span>
            </div>
            <div className='crypto--values'>
              <span>
                <i className='ion-stats-bars'/>
                {values.volume}
              </span>
            </div>
          </div>
        )}

      </div>
    )
  }

}

export default Crypto
