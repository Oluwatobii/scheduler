import React from "react";
//import "components/Appointment/styles.scss";
//import classNames from "classnames/bind";

export default function Empty(props) {
  return (
    <main className="appointment__add">
      <img
        className="appointment__add-button"
        src="images/add.png"
        onClick={props.onAdd}
        alt="Add"
      />
    </main>
  );
}
