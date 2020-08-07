import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  // State for the day and days
  const setDay = (day) => setState({ ...state, day });

  // Requesting to /api/days, /api/appointments and /api/interviewers and then updating the state of days using the data from the axios get request
  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers")),
    ]).then((all) => {
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

  // Function to cancel an interview
  const cancelInterview = (id, interview = null) => {
    return axios.delete(`/api/appointments/${id}`, { interview });
  };

  return { state, setDay, bookInterview, cancelInterview };
}
