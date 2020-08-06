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
