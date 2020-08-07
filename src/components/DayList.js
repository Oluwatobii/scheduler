import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {
  const { days } = props;

  const lists = days.map((lists, index) => {
    return (
      <DayListItem
        key={index}
        name={lists.name}
        spots={lists.spots}
        selected={lists.name === props.day}
        setDay={props.setDay}
      />
    );
  });
  return <ul>{lists}</ul>;
}
