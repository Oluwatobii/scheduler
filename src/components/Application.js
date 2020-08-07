import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay,
} from "helpers/selectors";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment";

export default function Application(props) {
  // Give it a default day
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  // Setting the state for the day and days
  const setDay = (day) => setState({ ...state, day });

  // Requesting to /api/days, /api/appointments and /api/interviewers and then updating the state of days using the data from the axios get request
  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers")),
    ]).then((all) => {
      //console.log("THIS IS THE ALL==>", all);
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []); //Note: Passing an empty array as a dependancy is neccesary in order to avoid an infinite loop of the request being made since we have no real dependancy

  //Creating a fuunction for making a new interview
  const bookInterview = (id, interview) => {
    //console.log("THIS IS THE BOOKINTERVIEW", id, interview);
    //Appointment object
    // const appointment = {
    //   ...state.appointments[id],
    //   interview: { ...interview },
    // };
    // console.log("This is the appointment objects", appointment);

    // Adding the aformentioned appointment to the Appointments objects
    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment,
    // };
    // console.log("This is the appointments objects", appointments);

    return axios.put(`/api/appointments/${id}`, { interview }).then((res) => {
      setState((prev) => ({
        ...prev,
        appointments: {
          ...prev.appointments,
          [id]: {
            ...prev.appointments[id],
            interview: { ...interview },
          },
        },
      }));
    });
  };

  const cancelInterview = (id, interview = null) => {
    return axios.delete(`/api/appointments/${id}`, { interview });
  };

  const renderAppointments = getAppointmentsForDay(state, state.day).map(
    (appointment) => {
      const interview = getInterview(state, appointment.interview);
      const interviewersForDay = getInterviewersForDay(state, state.day);
      return (
        <Appointment
          key={appointment.id}
          id={appointment.id}
          {...appointment}
          interview={interview}
          interviewers={interviewersForDay}
          bookInterview={bookInterview}
          cancelInterview={cancelInterview}
        />
      );
    }
  );

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {renderAppointments} <Appointment key="final" time={"5pm"} />
      </section>
    </main>
  );
}
