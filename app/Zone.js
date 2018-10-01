import React, { Component } from 'react';
import { apiKey } from '../APIkey';

class Zone extends Component {
  constructor() {
    super();
    this.state = {
      showForm: false,
      duration: 0,
      selected: false
    };
    this.toggleForm = this.toggleForm.bind(this);
    this.startZone = this.startZone.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  toggleForm() {
    this.setState({ showForm: !this.state.showForm });
  }

  handleInput(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  startZone(event) {
    event.preventDefault();
    const body = {
      id: this.props.id,
      duration: parseInt(this.state.duration)
    };
    console.log(body)
    fetch('https://api.rach.io/1/public/zone/start', {
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
    .catch(error => console.log('error',error))
  }

  render() {
    return (
      <div className="zone" id={this.props.id}>
        <h3>{this.props.name}</h3>
        <img src={this.props.image} alt="picture of this particular zone" />
        <button onClick={this.toggleForm}>
          {this.state.showForm ? 'cancel' : 'start zone'}
        </button>
        <button onClick={() => this.props.selectZone(this.props.id)}>
          {this.state.selected ? 'unselect' : 'select zone'}
        </button>
       <form 
        className={this.state.showForm ? 'zone-form' : 'hidden-form'}
        onSubmit={this.startZone}
       >
        <h4>duration</h4>
        <input name="duration" type="text" onChange={this.handleInput}/>
        <button>start</button>
       </form>
      </div>
    )
  }
}

export default Zone;