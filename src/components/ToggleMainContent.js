import React, { Component } from 'react';
import MeetingList from "./MeetingList";
import PersonalList from "./PersonalList";
import MeetingsForm from "./MeetingsForm";
import PersonalForm from "./PersonalForm";
import ToggleRender from "./ToggleRender";
import TodoListSearch from "./TodoListSearch";

export default class ToggleMainContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      whatToRender: 'MeetingList',
      refreshMeetings: false,
      refreshPersonal: false,
      textToHighlight: ''
    }
  }

  handleSearch = e => {
    this.setState({
      textToHighlight: e.target.value
    });
  };

  toggleDelete = async (id, type) => {
    const data = {
      id: id
    }
    const response = await fetch(`https://meetings-backend-e2w62dz1v.now.sh/${type}/delete`, {
      method: 'post',
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    });
    let data2 = await response.json();
    this.toggleRefresh(type);
  };
  
  toggleRefresh = (whatToRefresh) => {
    if (whatToRefresh === 'personal') {
      this.setState({refreshPersonal: !this.state.refreshPersonal})
    } else if (whatToRefresh === 'meetings') {
      this.setState({refreshMeetings: !this.state.refreshMeetings})
    }
  }

  toggleRender = (componentName) => {
    this.setState({
      whatToRender: componentName
    })
  }

  render() {
    switch(this.state.whatToRender) {
      case 'MeetingList':
        return (
            <React.Fragment>
              <ToggleRender toggleRender={this.toggleRender} whatToRender={this.state.whatToRender} />
              <MeetingList
                refresh={this.state.refreshMeetings}
                toggleDelete={this.toggleDelete}
                toggleRefresh={this.toggleRefresh}  
                textToHighlight={this.state.textToHighlight}                
              />
              <aside className="sidebar">
                <MeetingsForm toggleRefresh={this.toggleRefresh} id="myForm" />
                <TodoListSearch handleSearch={this.handleSearch} filterText={this.state.textToHighlight}/>
              </aside>
            </React.Fragment>
          )
      case 'PersonalList':
        return (
          <React.Fragment>
            <ToggleRender toggleRender={this.toggleRender} whatToRender={this.state.whatToRender} />
            <PersonalList
              toggleDelete={this.toggleDelete}
              refresh={this.state.refreshPersonal}
              textToHighlight={this.state.textToHighlight}
            />
            <aside className="sidebar">
              <PersonalForm toggleRefresh={this.toggleRefresh} id="PersonalForm" /> 
              <TodoListSearch handleSearch={this.handleSearch} filterText={this.state.textToHighlight}/>
            </aside>
          </React.Fragment>
        )
      case 'DepartmentsList':
        return <h4>Departments page will be in future.</h4>
      case 'Settings':
        return <h4>Settings page will be in future.</h4>
      default: 
        return <h4>404 not found</h4>
    }
  }
}
