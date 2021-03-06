import React, { Component } from 'react'
import { apiKey } from '../APIkey'
import PropTypes from 'prop-types'

class Zone extends Component {
  constructor () {
    super()
    this.state = {
      showForm: false,
      duration: '',
      selected: false,
      error: ''
    }
    this.toggleForm = this.toggleForm.bind(this)
    this.startZone = this.startZone.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.grabSortOrder = this.grabSortOrder.bind(this)
    this.handleDisabled = this.handleDisabled.bind(this)
  }

  toggleForm () {
    if (this.props.enabled) {
      this.setState({ showForm: !this.state.showForm })
    } else {
      this.handleDisabled()
    }
  }

  handleInput (event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSelect () {
    if (this.props.enabled) {
      this.setState({ selected: !this.state.selected })
      this.props.selectZone(this.props.id)
    } else {
      this.handleDisabled()
    }
  }

  handleDisabled () {
    this.setState({ error: 'this zone is not currently enabled' })
    setTimeout(() => {
      this.setState({ error: '' })
    }, 4000)
  }

  grabSortOrder (event) {
    const { value } = event.target || 0
    this.props.addSortOrder(this.props.id, value)
  }

  startZone (event) {
    event.preventDefault()
    const body = {
      id: this.props.id,
      duration: parseInt(this.state.duration)
    }
    return fetch('https://api.rach.io/1/public/zone/start', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(response => response.text())
      .then(result => console.log(result))
      .then(() => this.toggleForm())
      .catch(error => this.setState({ error: error.message }))
  }

  render () {
    return (
      <div className="zone" id={this.props.id}>
        <h3 className="zone-title">
          {`${this.props.name}${this.props.enabled ? ': enabled' : ': disabled'}`}
        </h3>
        <img
          className={this.state.selected ? 'selected' : ''}
          onClick={this.handleSelect}
          src={this.props.image}
          alt="picture of this particular zone"
        />
        <div className="zone-buttons">
          <button
            onClick={this.toggleForm}
            className="toggle-form"
          >
            {this.state.showForm ? 'cancel' : 'start zone'}
          </button>
          <button
            onClick={this.handleSelect}
            className="select-zone"
          >
            {this.state.selected ? 'unselect' : 'select zone'}
          </button>
        </div>
        <form
          className={this.state.showForm ? 'zone-form' : 'hidden-form'}
          onSubmit={this.startZone}
        >
          <h4>duration(in seconds):</h4>
          <input
            value={this.state.duration} 
            className="duration-input" 
            name="duration" type="text" 
            onChange={this.handleInput}
          />
          <button>start</button>
        </form>
        { this.state.error ? <p>{this.state.error}</p> : ''}
        {this.state.selected && this.props.enabled
          ? <div>
            <p>order(in seconds):</p>
            <input
              className="sort-order"
              name="sortOrder"
              type="text"
              onChange={this.grabSortOrder}
            />
          </div> : ''
        }
      </div>
    )
  }
}

export default Zone

Zone.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  image: PropTypes.string,
  selectZone: PropTypes.func
}
