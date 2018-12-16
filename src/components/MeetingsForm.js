import React, { Component } from "react";
import DatePicker from "react-datepicker";
import Select from 'react-select';
import uuidv4 from "uuid/v4";

import "react-datepicker/dist/react-datepicker.css";

class TodoInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      information: "",
      personal: null,
      date: new Date(),
      location: "",
      selectOptions: null
    }
  }

  handleAddMeeting = async (name, information, personal, date, location) => {
    const newKey = uuidv4();
    const data = {
      id: newKey,
      name: name,
      information: information,
      personal: personal,
      date: date,
      location: location,
    };

    const response = await fetch('https://meetings-backend-e2w62dz1v.now.sh/meetings/add', {
      method: 'POST', // or 'PUT'
      mode: "cors",
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    })

    this.props.toggleRefresh('meetings');
  }

  handleSelect = (personal) => {
    this.setState({ personal });
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleDate = (date) => {
    this.setState({ date });
  }

  handleSubmit = e => {
    e.preventDefault();
    let personalArray = [];
    this.state.personal.forEach(persona => {
      personalArray.push(persona.value);
    });
    this.handleAddMeeting(this.state.name, this.state.information, personalArray, this.state.date.toString(), this.state.location);
  };

  selectOptionsInit = () => {
    let renderlist = [];
    for (const element of this.state.buildPersonal) {
      renderlist.push({ value: element.name + ' ' + element.surname, label: element.name + ' ' + element.surname })
    }
    return renderlist;
  }

  getPersonal = async (e) => {
    const response =  await fetch(`https://meetings-backend-e2w62dz1v.now.sh/personal/`);
    let data = await response.json();
    return data;
  }

  componentDidMount() {
    this.getPersonal()
      .then(data => this.setState({
          buildPersonal: data
        }))
      .catch(reason => console.log(reason.message))
  }
  
  render() {
    
    return (
      <div className="card">
        <h4 className="card-title">Add new meeting</h4>
        <form className="form-styled" onSubmit={this.handleSubmit} id={this.props.id}>
          <div className="form-group">
            <input name="name" type="text" placeholder="Name" value={this.state.name} onChange={this.handleChange} required/>
            {  
              this.state.buildPersonal
              ?  <Select
                    value={this.state.personal}
                    onChange={this.handleSelect}
                    options={this.selectOptionsInit()}
                    isMulti
                  />
              : 'loading...'
            }         
            <DatePicker
              selected={this.state.date}
              onChange={this.handleDate}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              timeCaption="time"
            />
            <select name="location" onChange={this.handleChange}>
              <option value="Meeting room">Meeting room</option> 
              <option value="Projector room">Projector room</option>
              <option value="Negotiation room">Negotiation room</option>
            </select>
            <textarea name="information" cols="30" rows="3" placeholder="Information" value={this.state.message} onChange={this.handleChange} required></textarea>
            <button className="btn-outline">Add</button>
          </div>
        </form>
      </div>
    )
  }
}

export default TodoInput;
