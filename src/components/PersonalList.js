import React, { Component } from "react";
import Highlighter from "react-highlight-words";

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buildPersonal: []
    }
  }
  
  findUnmatchedText = (name, surname, department, position) => {
    // if user typed something, but it's doesn't match with text 
    if (this.props.textToHighlight && !(name.indexOf(this.props.textToHighlight) > -1) && !(surname.indexOf(this.props.textToHighlight) > -1) && !(department.indexOf(this.props.textToHighlight) > -1) && !(position.indexOf(this.props.textToHighlight) > -1)) {
      return true;
    }
    return false;
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

  componentWillReceiveProps(props) {
    const { refresh } = this.props;
    if (props.refresh !== refresh) {
      this.getPersonal()
        .then(data => this.setState({
            buildPersonal: data
          }))
        .catch(reason => console.log(reason.message))
    }
  }

  render() {
    return (
      <React.Fragment>
        <main className="card-container personal">
        {this.state.buildPersonal.map((item, index) => {
          if (this.findUnmatchedText(item.name, item.surname, item.department, item.position)) {
            return null;
          } 
          return (
            <article key={item.id} className="card">
            <h4 className="card-title">
              {
                this.props.textToHighlight 
                ? <Highlighter
                    highlightClassName="YourHighlightClass"
                    searchWords={[this.props.textToHighlight]}
                    autoEscape={true}
                    textToHighlight={item.name}
                  /> 
                : item.name
              } 
              &nbsp;
              {
                this.props.textToHighlight 
                ? <Highlighter
                    highlightClassName="YourHighlightClass"
                    searchWords={[this.props.textToHighlight]}
                    autoEscape={true}
                    textToHighlight={item.surname}
                  /> 
                : item.surname
              }
            </h4>
            <p className="card-text">
              {
                this.props.textToHighlight 
                ? <Highlighter
                    highlightClassName="YourHighlightClass"
                    searchWords={[this.props.textToHighlight]}
                    autoEscape={true}
                    textToHighlight={item.department}
                  /> 
                : item.department
              } 
                &nbsp; | &nbsp; 
              {
                this.props.textToHighlight 
                ? <Highlighter
                    highlightClassName="YourHighlightClass"
                    searchWords={[this.props.textToHighlight]}
                    autoEscape={true}
                    textToHighlight={item.position}
                  /> 
                : item.position
              }
            </p>

            <div className="card-footer">
              <button
                className="btn-remove text-small"
                onClick={() => { this.props.toggleDelete(item.id, "personal"); }}
              >
                Remove
              </button>
            </div>
          </article>
          )
        })}
        </main>
      </React.Fragment>
    );
  }
}

export default TodoList;