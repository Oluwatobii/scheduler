import { useEffect, useReducer } from "react";
import axios from "axios";

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  // const SET_SPOT = "SET_SPOT";

  const reducer = (state, action) => {
    switch (action.type) {
      case SET_DAY: {
        return { ...state, day: action.value };
      }
      case SET_APPLICATION_DATA: {
        return { ...state, ...action.value };
      }
      case SET_INTERVIEW: {
        return { ...state, ...action.value };
      }
      // case SET_SPOT: {
      //   return { ...state, ...action.value };
      // }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
  });

  // State for the day and days
  const setDay = (day) => dispatch({ type: SET_DAY, value: day });

  // Requesting to /api/days, /api/appointments and /api/interviewers and then updating the state of days using the data from the axios get request
  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers")),
    ]).then((all) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        value: {
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data,
        },
      });
    });
  }, []); //Note: Passing an empty array as a dependancy is neccesary in order to avoid an infinite loop of the request being made since we have no real dependancy

  //Creating a fuunction for making a new interview
  const bookInterview = (id, interview, spotChange) => {
    let newDays = [...state.days];
    return axios.put(`/api/appointments/${id}`, { interview }).then((res) => {
      if (spotChange) {
        const today = state.days.find((day) => day.appointments.includes(id));
        const dayToChangeSpotsFor = newDays.find(
          (newDay) => newDay.id === today.id
        );
        dayToChangeSpotsFor.spots = dayToChangeSpotsFor.spots - 1;
      }

      // dispatch({
      //   value: {
      //     ...state,
      //     days: newDays,
      //   },
      //   type: SET_SPOT,
      // });

      dispatch({
        value: {
          ...state,
          appointments: {
            ...state.appointments,
            [id]: {
              ...state.appointments[id],
              interview: { ...interview },
            },
          },
          days: newDays,
        },
        type: SET_INTERVIEW,
      });
    });
  };

  // Function to cancel an interview
  const cancelInterview = (id, interview = null) => {
    return axios
      .delete(`/api/appointments/${id}`, { interview })
      .then((response) => {
        const today = state.days.find((day) => day.appointments.includes(id));
        const newDays = [...state.days];

        // get the number of spots for that day using day.spots
        // increment
        const dayToChangeSpotsFor = newDays.find(
          (newDay) => newDay.id === today.id
        );
        dayToChangeSpotsFor.spots = dayToChangeSpotsFor.spots + 1;

        // dispatch({
        //   value: {
        //     ...state,
        //     days: newDays,
        //   },
        //   type: SET_SPOT,
        // });

        dispatch({
          value: {
            ...state,
            days: newDays,
          },
          type: SET_INTERVIEW,
        });
      });
  };
  return { state, setDay, bookInterview, cancelInterview };
}

/* 

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
  const bookInterview = (id, interview, spotChange) => {
    let newDays = [...state.days];
    return axios.put(`/api/appointments/${id}`, { interview }).then((res) => {
      if (spotChange) {
        const today = state.days.find((day) => day.appointments.includes(id));
        const dayToChangeSpotsFor = newDays.find(
          (newDay) => newDay.id === today.id
        );
        dayToChangeSpotsFor.spots = dayToChangeSpotsFor.spots - 1;
      }
      setState((prev) => ({
        ...prev,
        appointments: {
          ...prev.appointments,
          [id]: {
            ...prev.appointments[id],
            interview: { ...interview },
          },
        },
        days: newDays,
      }));
    });
  };

  // Function to cancel an interview
  const cancelInterview = (id, interview = null) => {
    return axios
      .delete(`/api/appointments/${id}`, { interview })
      .then((response) => {
        const today = state.days.find((day) => day.appointments.includes(id));
        const newDays = [...state.days];

        // get the number of spots for that day using day.spots
        // increment
        const dayToChangeSpotsFor = newDays.find(
          (newDay) => newDay.id === today.id
        );
        dayToChangeSpotsFor.spots = dayToChangeSpotsFor.spots + 1;

        setState((prev) => ({
          ...prev,
          days: newDays,
        }));
      });
  };

  return { state, setDay, bookInterview, cancelInterview };
}

*/
