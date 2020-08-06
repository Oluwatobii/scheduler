import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAppointmentsForDay } from "helpers/selectors";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment";

export default function Application(props) {
  // Give it a default day
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
  });

  // Setting the state for the day and days
  const setDay = (day) => setState({ ...state, day });

  // Requesting to /api/days, /api/appointments and /api/interviewers and then updating the state of days using the data from the axios get request
  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
    ]).then((all) => {
      console.log("THIS IS THE ALL==>", all);
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
      }));
    });
  }, []); //Note: Passing an empty array as a dependancy is neccesary in order to avoid an infinite loop of the request beign made since there are no real dependancy

  const renderAppointments = getAppointmentsForDay(state, state.day).map(
    (appointment) => {
      return <Appointment key={appointment.id} {...appointment} />;
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
        {renderAppointments} <Appointment key="final" time={"12am"} />
      </section>
    </main>
  );
}
