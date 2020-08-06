import React from "react";
import useVisualMode from "hooks/useVisualMode";

import "components/Appointment/styles.scss";

import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Form from "components/Appointment/Form";
// import Status from "components/Appointment/Status";
// import Confirm from "components/Appointment/Confirm";
// import Error from "components/Appointment/Error";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  //console.log("THIS IS THE MODE BEING PASSED", mode);

  return (
    <article className="appointment">
      <Header time={props.time} />

      {mode === EMPTY && (
        <Empty
          onAdd={(e) => {
            transition(CREATE);
          }}
        />
      )}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer.name}
        />
      )}
      {mode === CREATE && <Form onCancel={back} interviewers={[]} />}
    </article>
  );
}
