import React from "react";
import "components/InterviewerListItem.scss";
import classNames from "classnames/bind";

export default function InterviewerListItem(props) {
  const interviewersClass = classNames("interviewers__item", {
    "interviewers__item--selected": props.selected === true,
  });

  return (
    <li
      className={interviewersClass}
      id={props.id}
      onClick={props.setInterviewer}
    >
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
}
