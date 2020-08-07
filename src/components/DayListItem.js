import React from "react";
import "components/DayListItem.scss";
import classNames from "classnames/bind";

export default function DayListItem(props) {
  const dayClass = classNames("day-list", {
    "day-list__item": props.name,
    "day-list__item--selected": props.selected === true,
    "day-list__item--full": props.spots === 0,
  });

  function formatSpots(spots) {
    if (spots < 1) {
      return "no spots remaining";
    } else if (spots === 1) {
      return "1 spot remaining";
    } else {
      return `${spots} spots remaining`;
    }
  }

  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2 className="day-list">{props.name}</h2>
      <h3 className="day-list">{formatSpots(props.spots)}</h3>
    </li>
  );
}
