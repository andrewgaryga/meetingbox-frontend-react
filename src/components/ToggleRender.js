import React from "react";

function ToggleRender(props) {
  return (
    <nav id="single-line-menu" className="single-nav menu render-toggle" role="navigation">
      <ul>
        <li><button className={props.whatToRender === "MeetingList" ? "active" : ""} onClick={() => props.toggleRender('MeetingList')}>Meetings</button></li>
        <li><button className={props.whatToRender === "PersonalList" ? "active" : ""} onClick={() => props.toggleRender('PersonalList')}>Personal</button></li>
      </ul>
    </nav>
  );
}

export default ToggleRender;
