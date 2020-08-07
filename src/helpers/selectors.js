export const getAppointmentsForDay = function (state, day) {
  const matchingDays = state.days.filter((element) => {
    return element.name === day;
  });

  if (matchingDays.length === 0) {
    return [];
  }

  const renderAppointments = matchingDays[0].appointments.map((appointment) => {
    return state.appointments[appointment];
  });

  return renderAppointments;
};

export const getInterview = (state, interview) => {
  if (interview) {
    const { interviewers } = state;

    return {
      student: interview.student,
      interviewer: interviewers[interview.interviewer],
    };
  } else {
    return null;
  }
};

export const getInterviewersForDay = function (state, day) {
  const matchingDays = state.days.filter((element) => {
    return element.name === day;
  });

  if (matchingDays.length === 0) {
    return [];
  }

  const renderInterviewList = matchingDays[0].interviewers.map((element) => {
    return state.interviewers[element];
  });

  return renderInterviewList;
};
