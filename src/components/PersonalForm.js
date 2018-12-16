import React, { Component } from "react";
import uuidv4 from "uuid/v4";

class TodoInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      surname: "",
      department: "Sales",
      position: ""
    }
  }

  buildSelectOptions = (selectName, e) => {
    let renderlist = [];
    if (selectName === "department") {
      for (const department of this.state.buildDepartments) {
        renderlist.push(<option value={department.name} key={department.name}>{department.name}</option>)
      }
      return renderlist;
    } else if (selectName === "position") {
      for (const department of this.state.buildDepartments) {
        if (department.name === this.state.department) {
          renderlist = department.positions.map(position => <option value={position} key={position}>{position}</option>);
        }
      }
      /* 
        Initial select value is undefined, beacause it changes only when user change select option.
        To prevent passing undefined, I added a placeholder value. 
      */
      renderlist.unshift(<option value="" key="placeholder" disabled selected>Select position</option>)
      return renderlist;
    }
  }

  getDepartments = async (e) => {
    const response =  await fetch(`https://meetings-backend-e2w62dz1v.now.sh/departments/`);
    let data = await response.json();
    return data;
  }

  handleAddPersonal = async (name, surname, department, position) => {
    const newKey = uuidv4();
    const data = {
      id: newKey,
      name: name,
      surname: surname,
      department: department,
      position: position
    }

    const response = await fetch('https://meetings-backend-e2w62dz1v.now.sh/personal/add', {
      method: 'POST', // or 'PUT'
      mode: "cors",
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    })

    this.props.toggleRefresh('personal');
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSelect = (personal) => {
    this.setState({ personal });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.handleAddPersonal(this.state.name, this.state.surname, this.state.department, this.state.position);
  };

  componentDidMount() {
    this.getDepartments()
      .then(data => this.setState({
          buildDepartments: data
        }))
      .catch(reason => console.log(reason.message))
  }
  
  render() {
    return (
      <div className="card">
        <h4 className="card-title">Add new worker</h4>
        <form className="form-styled" onSubmit={this.handleSubmit} id={this.props.id}>
          <div className="form-group">
            <input name="name" type="text" placeholder="Name" value={this.state.name} onChange={this.handleChange} required/>
            <input name="surname" type="text" placeholder="Surname" value={this.state.surname} onChange={this.handleChange} required/>
            <select name="department" onChange={this.handleChange}>
              {/* at the moment of calling .buildSelectOptions()
                   promise from getDepartments() is unresolved and
                   state.buildDepartments is undefined, so select show
                   loading untill promise will resolve 
                */
              this.state.buildDepartments
                ? this.buildSelectOptions("department")
                : "loading..."}
            </select>
            <select name="position" onChange={this.handleChange} required>
              {this.state.buildDepartments
                ? this.buildSelectOptions("position")
                : "loading..."}
            </select>
            <button className="btn-outline">Add</button>
          </div>
        </form>
      </div>
    )
  }
}

export default TodoInput;
