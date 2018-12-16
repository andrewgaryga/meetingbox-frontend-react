import React, { Component } from "react";
import Highlighter from "react-highlight-words";

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemId: null,
      textToHighlight: "",
      buildMeetings: []
    };
  }

  findUnmatchedText = (name, info) => {
    // if user typed something, but it's doesn't match with text
    if (
      this.props.textToHighlight &&
      !(name.indexOf(this.props.textToHighlight) > -1) &&
      !(info.indexOf(this.props.textToHighlight) > -1)
    ) {
      return true;
    }

    return false;
  };

  // if itemId === true, react will render full view for this item instead of list
  passId = id => {
    this.setState({
      itemId: id
    });
  };

  getItemById = () => {
    this.getMeetings()
    .then(data =>
      this.setState({
        buildMeetings: data
      })
    )
    .catch(reason => console.log(reason.message));
    return this.state.buildMeetings.filter(
      item => item.id === this.state.itemId
    );
  };

  isPassed = date => {
    return Date.parse(date) < new Date() ? true : false;
  };

  getMeetings = async e => {
    const response = await fetch(`https://meetings-backend-e2w62dz1v.now.sh/meetings/`);
    let data = await response.json();
    return data;
  };

  toggleCancel = async (id, type) => {
    const data = {
      id: id
    }
    const response = await fetch(`https://meetings-backend-e2w62dz1v.now.sh/${type}/toggleComplete`, {
      method: 'post',
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    });

    this.props.toggleRefresh('meetings');
  };

  // Init meetings list
  componentDidMount() {
    this.getMeetings()
      .then(data =>
        this.setState({
          buildMeetings: data
        })
      )
      .catch(reason => console.log(reason.message));
  }

  // Togggle items re-render on form submit
  componentWillReceiveProps(props) {
    const { refresh } = this.props;
    if (props.refresh !== refresh) {
      this.getMeetings()
        .then(data =>
          this.setState({
            buildMeetings: data
          })
        )
        .catch(reason => console.log(reason.message));
    }
  }
  render() {
    if (!this.state.itemId) {
      return (
        <React.Fragment>
          <main className="card-container">
            {this.state.buildMeetings.map((item, index) => {
              // Hide items with NO matches from search queue
              if (!item.display || this.findUnmatchedText(item.name, item.information)) {
                return null;
              }

              return (
                
                <article key={item.id} className="card" >
                  <h4 className="card-title">
                    {this.props.textToHighlight 
                      ? <Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[this.props.textToHighlight]}
                          autoEscape={true}
                          textToHighlight={item.name}
                        />
                      : item.name
                    }
                  </h4>
                  <p className="card-text">
                    {this.props.textToHighlight 
                      ? <Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[this.props.textToHighlight]}
                          autoEscape={true}
                          textToHighlight={item.information}
                        />
                      : item.information
                    }
                  </p>
                  <small className="card-text date">
                    {this.isPassed(item.date.toString()) 
                        ? <span className="badge badge-passed">Passed</span>
                        : ''
                    }
                    {item.isCancel
                        ? <span className="badge badge-cancel">Canceled</span>
                        : ''
                    }
                    {item.date}
                  </small>
                  <div className="card-footer">
                    <button
                      className={item.isCancel ? "text-small btn-uncancel" : "text-small btn-cancel"}
                      onClick={() => {
                        this.toggleCancel(item.id, "meetings");
                      }}
                    >
                      {item.isCancel ? "Uncancel" : "Cancel"}
                    </button>
                    <button
                      className="btn-remove text-small"
                      onClick={() => {
                        this.props.toggleDelete(item.id, "meetings");
                      }}
                    >
                      Delete
                    </button>
                    <button 
                      className="btn-outline text-small"
                      onClick={() => { this.passId(item.id); }}
                    >
                      Details
                    </button>
                  </div>
                </article>             
            );
          })}
          </main>
        </React.Fragment>
      );
    }

    // One item view
    let item = this.getItemById()[0];
    return (
      <main className="card-container">
        <article key={item.id} className="card details">
          <button 
            className="link-back" 
            onClick={() => { this.passId(null); }}
          >
            <i className="fas fa-arrow-left"></i>Go back
          </button>
          <h4 className="card-title">
            {this.props.textToHighlight 
              ? <Highlighter
                  highlightClassName="YourHighlightClass"
                  searchWords={[this.props.textToHighlight]}
                  autoEscape={true}
                  textToHighlight={item.name}
                />
              : item.name
            }
          </h4>
          <p className="card-text">
            {this.props.textToHighlight 
              ? <Highlighter
                  highlightClassName="YourHighlightClass"
                  searchWords={[this.props.textToHighlight]}
                  autoEscape={true}
                  textToHighlight={item.information}
                />
              : item.information
            }
          </p>
          <small className="card-text date">
            {this.isPassed(item.date.toString()) 
                ? <span className="badge badge-passed">Passed</span>
                : ''
            }
            {item.isCancel 
                ? <span className="badge badge-cancel">Canceled</span>
                : ''
            }
            {item.date}
          </small>
          <ul className="personal-group">
            <li className="personal-group-item">Included personal:</li>
            {item.personal.map(
            persona => <li className="personal-group-item" key={persona}>{persona}</li>)}
          </ul>
          <div className="card-footer">
              <p className="card-text">Location: {item.location}</p>
              <button
                className={item.isCancel ? "text-small btn-uncancel" : "text-small btn-cancel"}
                onClick={() => {
                  this.toggleCancel(item.id, "meetings");
                }}
              >
                {item.isCancel ? "Uncancel" : "Cancel"}
              </button>
              <button
                className="btn-remove text-small"
                onClick={() => {
                  this.props.toggleDelete(item.id, "meetings");
                }}
              >
                Delete
              </button>
          </div>
        </article>
      </main>
    );
  }
}

export default TodoList;
