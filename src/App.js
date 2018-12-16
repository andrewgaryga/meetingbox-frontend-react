import React, { Component } from "react";
import ToggleMainContent from "./components/ToggleMainContent";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <ToggleMainContent />
        <footer>
          <div className="copyright">&copy; 2018</div>
        </footer>
      </React.Fragment>
    );
  }
}

export default App;
