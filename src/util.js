export const CURRENT_VERSION = "v2"
const oneDay = 1000 * 60 * 60 * 24;

export function getRelativeValues(arr) {
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const spread = max - min;
  return arr.map((val) => (val - min) / spread);
}

export function daysInMonth(month, year) {
  return new Date(year, month - 1, 0).getDate();
}

export function getDayOfYear(day, month, year) {
  const date = new Date(year, month, day);
  return Math.floor((date - new Date(year || date.getFullYear(), 0, 0)) / oneDay);
}

export function dayOfYearToDate(day, year) {
  const baseYearTime = new Date(year, 0, 0).getTime();
  return new Date(baseYearTime + day * oneDay);
}

export function saveData(data) {
  localStorage.setItem(CURRENT_VERSION, JSON.stringify(data));
}

export function resetAllData() {
  localStorage.removeItem(CURRENT_VERSION);
  window.location.reload();
}

export function shallowClone(obj) {
  return {...obj}
}

export function colorFromValues() {
  // const dayOfYear = weekIndex * 7 + dayIndex;
  // const styles = {};
  // if (Number(year) === Number(currentYear) && dayOfYear === currentDay) {
  //   styles.border = "1px solid var(--bg-color-today)";
  // }
  // return {
  //   ...styles,
  //   backgroundColor:
  //     value === 0 ? "lightgray" : `hsl(126, 100%, ${90 - 10 * value}%)`,
  // };
}
