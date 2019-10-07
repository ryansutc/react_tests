import moment from 'moment';

export function formatDateForLabel(dateString) {
  let d = new Date(0);
  d.setUTCSeconds(dateString);
  return d.toLocaleDateString();
}

export function formatDateRange(startDate, endDate) {
  return moment(startDate).diff(endDate, "days");
}