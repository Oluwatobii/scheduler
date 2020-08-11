import React, { useEffect } from "react";
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
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";
const ERROR_INTERVIEWER = "ERROR_INTERVIEWER";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  useEffect(() => {
    if (mode === EMPTY && props.interview && props.interview.interviewer) {
      transition(SHOW);
    }
    if (mode === SHOW && (!props.interview || !props.interview.interviewer)) {
      transition(EMPTY);
    }
  }, [props.interview, transition, mode]);

  //Function to save apppoiintments
  const save = (name, interviewer, spotChange) => {
    if (interviewer) {
      const interview = {
        student: name,
        interviewer,
      };
      transition(SAVING);
      props
        .bookInterview(props.id, interview, spotChange)
        //transition(SHOW);
        .then((response) => transition(SHOW))
        .catch((error) => {
          transition(ERROR_SAVE, true);
        });
    } else {
      transition(ERROR_INTERVIEWER);
    }
  };

  //Function to delete appointments
  const deleteAppointment = () => {
    transition(DELETING, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch((err) => transition(ERROR_DELETE, true));
  };

  // const defaultStudentName = props.interview
  //   ? props.interview.student
  //     ? props.interview.student
  //     : ""
  //   : "";
  // const [studentName, setStudentName] = useState(defaultStudentName);

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />

      {mode === EMPTY && (
        <Empty
          onAdd={(e) => {
            transition(CREATE);
          }}
        />
      )}
      {mode === SHOW && props.interview && props.interview.interviewer && (
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
        <Form
          onSave={save}
          onCancel={back}
          interviewers={props.interviewers}
          // studentName={studentName}
          // setStudentName={setStudentName}
          spotChange={true}
        />
      )}
      {mode === SAVING && <Status message={"Saving"} />}
      {mode === DELETING && <Status message={"Deleting"} />}
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
          interviewer={props.interview.interviewer.id}
          student={props.interview.student}
          interviewers={props.interviewers}
          // studentName={studentName}
          // setStudentName={setStudentName}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error message="Please try again" onClose={back} />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message="There was an error deleting your appointment. Please try again"
          onClose={back}
        />
      )}
      {mode === ERROR_INTERVIEWER && (
        <Error message={"Please pick an Interviewer"} onClose={back} />
      )}
    </article>
  );
}
