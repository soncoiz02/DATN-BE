// eslint-disable-next-line import/prefer-default-export
export const dateToHourNumber = (date) => {
  const newDate = new Date(date);
  const hour = newDate.getHours();
  const minute = newDate.getMinutes() / 60;

  return hour + minute;
};
