import React, { useEffect, useState } from "react";
import {
  CURRENT_VERSION,
  daysInMonth,
  getDayOfYear,
  saveData,
  shallowClone,
} from "./util";

const monthInitials = "JFMAMJJASOND".split("");
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const currentDay = new Date().getDate();

const globalData = JSON.parse(localStorage.getItem(CURRENT_VERSION) || "{}");
const schema = {
  pushups: {
    name: "Pushups",
    increment: 5,
    suffix: "",
  },
  handstand: {
    name: "Handstand",
    increment: 10,
    suffix: "seconds",
  },
};

export default function App() {
  const [data, setData] = useState(globalData);
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [day, setDay] = useState(currentDay);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const months = [...Array(12).keys()].map((month) => [
    ...Array(daysInMonth(month, year)).keys(),
  ]);

  const changeYear = (newYear) => {
    setYear(newYear);
    return newYear;
  };
  const changeMonth = (newMonth) => {
    if (newMonth < 0) {
      changeYear(year-1);
      newMonth = 11; // December
    } else if (newMonth > 11) {
      changeYear(year+1);
      newMonth = 0;
    }
    setMonth(newMonth);
    return newMonth;
  };
  const changeDay = (newDay) => {
    if (newDay <= 0) {
      const newMonth = changeMonth(month-1);
      newDay = daysInMonth(newMonth, year);
    } else if (newDay > daysInMonth(month, year)) {
      changeMonth(month+1);
      newDay = 1;
    }
    setDay(newDay);
    return newDay;
  };

  const setValue = (key, newVal) => {
    const dayOfYear = getDayOfYear(day, month, year);
    if (!data[year]) {
      data[year] = {};
    }
    if (!data[year][dayOfYear]) {
      data[year][dayOfYear] = {};
    }
    data[year][dayOfYear][key] = newVal;
    setData(shallowClone(data));
  };
  const changeValue = (key, change) => {
    const newValue = getValue(key) + change;
    setValue(key, newValue < 0 ? 0 : newValue);
  };
  const getValue = (key) => {
    const y = data[year] || {};
    const v = y[getDayOfYear(day, month, year)] || {};
    return v[key] || 0;
  };

  return (
    <div className="App page">
      <div className="pagewrapper">
        <div className="time-select">
          <span className="day-select-arrow" onClick={() => changeYear(year-1)}>
            &lt;
          </span>
          <h2 className="time-select-title">
            {year}
          </h2>
          <span className="time-select-arrow" onClick={() => changeYear(year+1)}>
            &gt;
          </span>
        </div>
        <div className="year-wrapper">
          <div className="year">
            {months.map((days, m) => (
              <div key={`d-${m}`} className="flex">
                <span className="month-name">{monthInitials[m]}</span>
                <div className="month">
                  {days.map((d) => (
                    <div
                      key={`d-${m}-${d}`}
                      className={`day ${d === day - 1 && m === month ? "selected": ""} ${d === currentDay && m === currentMonth ? "today" : ""}`}
                      // style={getColor()}
                      onClick={() => {changeDay(d + 1); changeMonth(m)}}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="time-select">
          <span className="day-select-arrow" onClick={() => changeDay(day-1)}>
            &lt;
          </span>
          <h2 className="time-select-title">
            {day === currentDay ? "Today" : `${day}. ${monthNames[month]}`}
          </h2>
          <span className="time-select-arrow" onClick={() => changeDay(day+1)}>
            &gt;
          </span>
        </div>
        <div className="controls">
          {Object.entries(schema).map(([key, props]) => (
            <div key={key} className="control">
              <div className="control-name">{props.name}</div>
              <div>
                <button
                  className="control-button -decrement"
                  onClick={() => changeValue(key, -props.increment)}
                >
                  -
                </button>
                <span className="control-display">
                  {getValue(key)} {props.suffix}
                </span>
                <button
                  className="control-button -increment"
                  onClick={() => changeValue(key, props.increment)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* <button onClick={resetAllData}>Reset everything</button> */}
      </div>
    </div>
  );
}
