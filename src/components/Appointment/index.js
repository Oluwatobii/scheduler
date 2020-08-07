import React from "react";
import useVisualMode from "hooks/useVisualMode";

import "components/Appointment/styles.scss";

import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const ERROR = "ERROR";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  //console.log("THIS IS THE MODE BEING PASSED", mode);

  //Function to save apppoiintments
  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      //transition(SHOW);
      .then((response) => transition(SHOW))
      .catch((error) => {
        transition(ERROR);
      });
  };

  //Function to delete appointments
  const deleteAppointment = () => {
    transition(DELETE);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch((err) => transition(ERROR));
  };

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
          onDelete={() => {
            transition(CONFIRM);
          }}
          onEdit={() => {
            transition(EDIT);
          }}
        />
      )}
      {mode === CREATE && (
        <Form onSave={save} onCancel={back} interviewers={props.interviewers} />
      )}
      {mode === SAVING && <Status message={"Saving"} />}
      {mode === DELETE && <Status message={"Deleting"} />}
      {mode === CONFIRM && (
        <Confirm
          onConfirm={deleteAppointment}
          onCancel={back}
          message={"Are you sure you want to delete?"}
        />
      )}

      {mode === EDIT && (
        <Form
          onSave={save}
          onCancel={back}
          value={props.interview.interviewer.id}
          student={props.interview.student}
          interviewers={props.interviewers}
        />
      )}
    </article>
  );
}
