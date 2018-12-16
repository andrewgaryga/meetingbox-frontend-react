import React, { Component } from 'react';
import MeetingsForm from "./MeetingsForm";
import PersonalForm from "./PersonalForm";

export default class ToggleMainForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      whatToRender: 'MeetingForm'
    }
  }

  toggleRender = (componentName) => {
    this.setState({
      whatToRender: componentName
    })
  }

  render() {
    switch(this.state.whatToRender) {
      case 'MeetingForm':
        return (
          <React.Fragment>
            <div className="button-toggle form">
              <button onClick={() => this.toggleRender('PersonalForm')}>PersonalForm</button>
            </div>
            <MeetingsForm handleAddMeeting={this.props.handleAddMeeting} personal={this.props.personal} id="myForm" /> 
          </React.Fragment>

        )
      case 'PersonalForm':
        return (
            <React.Fragment>
              <div className="button-toggle form">
                <button onClick={() => this.toggleRender('MeetingForm')}>MeetingForm</button>
              </div>
              <PersonalForm handleAddPersonal={this.props.handleAddPersonal} personal={this.props.personal} departments={this.props.departments} id="PersonalForm" /> 
            </React.Fragment>

          )
      case 'Settings':
        return // Will be in future
      default: 
        return <p>404</p>
    }
  }
}
