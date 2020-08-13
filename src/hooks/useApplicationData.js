import { useEffect, useReducer } from "react";
import axios from "axios";

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const reducer = (state, action) => {
    switch (action.type) {
      case SET_DAY: {
        return { ...state, day: action.value };
      }
      case SET_APPLICATION_DATA: {
        return { ...state, ...action.value };
      }
      case SET_INTERVIEW: {
        return {
          ...state,
          appointments: {
            ...state.appointments,
            [action.id]: {
              ...state.appointments[action.id],
              interview: { ...action.interview },
            },
          },
          days: [...action.days],
        };
      }

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

  //Connecting to a websocket server
  useEffect(() => {
    let websocketURL = "ws://localhost:8001/";
    // let websocketURL = "wss://lhlscheduler.herokuapp.com/";
    // if (process.env.NODE_ENV === "test") {
    //   websocketURL = "ws://localhost:8001/";
    // }
    if (process.env.REACT_APP_WEBSOCKET_URL) {
      websocketURL = process.env.REACT_APP_WEBSOCKET_URL;
    }
    //console.log("===>", process.env.NODE_ENV);
    const webSocket = new WebSocket(websocketURL);
    console.log("===>", websocketURL);

    //Sending data to the server
    webSocket.onopen = (event) => {
      webSocket.send("ping");
    };

    //Receiving messages from the server
    webSocket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log("Message Received:", response);

      if (response.type === SET_INTERVIEW) {
        axios.get("/api/days").then((result) => {
          dispatch({
            type: SET_INTERVIEW,
            id: response.id,
            interview: response.interview,
            days: result.data,
          });
        });
      }
    };
  }, []);

  //Creating a fuunction for making a new interview
  const bookInterview = (id, interview, spotChange) => {
    return axios.put(`/api/appointments/${id}`, { interview }).then((res) => {
      let newDays = [...state.days];
      if (spotChange) {
        const today = state.days.find((day) => day.appointments.includes(id));
        newDays = state.days.map((day) => {
          if (day.id === today.id) {
            day.spots = day.spots - 1;
          }
          return day;
        });
      }

      dispatch({
        type: SET_INTERVIEW,
        id: id,
        interview: interview,
        days: newDays,
      });
    });
  };

  // Function to cancel an interview
  const cancelInterview = (id, interview = null) => {
    return axios
      .delete(`/api/appointments/${id}`, { interview })
      .then((response) => {
        const today = state.days.find((day) => day.appointments.includes(id));
        //const newDays = [...state.days];

        const newDays = state.days.map((day) => {
          if (day.id === today.id) {
            day.spots = day.spots + 1;
          }
          return day;
        });

        dispatch({
          type: SET_INTERVIEW,
          id: id,
          interview: interview,
          days: newDays,
        });
      });
  };
  return { state, setDay, bookInterview, cancelInterview };
}
