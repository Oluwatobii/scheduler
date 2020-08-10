import React, { useState } from "react";
import InterviewerList from "components/InterviewerList";
import Button from "components/Button";

export default function Form(props) {
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [studentName, setStudentName] = useState(props.student || "");
  const [error, setError] = useState("");

  const reset = () => {
    setInterviewer(null);
    setStudentName("");
  };

  const cancel = () => {
    props.onCancel();
    reset();
  };

  function validate() {
    if (studentName === "") {
      setError("Student name cannot be blank");
      return;
    }

    props.onSave(studentName, interviewer, props.spotChange);
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={(event) => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            data-testid="student-name-input"
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList
          interviewers={props.interviewers}
          interviewer={interviewer}
          setInterviewer={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button onClick={cancel} danger>
            Cancel
          </Button>
          <Button onClick={validate}>Save</Button>
        </section>
      </section>
    </main>
  );
}
