import React from "react";

function TodoSearch(props) {
  return (
    <div className="card">
      <div className="form form-search">
        <div className="icon-container"><i className="fas fa-search" /></div>  
        <input
          name="search"
          type="text"
          className="search"
          placeholder="Type to search..."
          onChange={props.handleSearch}
          value={props.filterText}
        />
      </div>
    </div>
  );
}

export default TodoSearch;
