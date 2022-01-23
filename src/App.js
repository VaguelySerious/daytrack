import React, { useEffect, useState } from "react";

const dayNames = ["M", "T", "W", "T", "F", "S", "S"];
const currentYear = new Date().getYear() + 1900;
const currentDay = Math.floor(
  (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
);
const getDefaultData = () => ({ 2022: {}, 2021: {} });

function App() {
  const [data, setData] = useState(getDefaultData);

  useEffect(() => {
    const dataString = localStorage.getItem("v1");
    if (dataString) {
      const parsedData = JSON.parse(dataString)
      if (parsedData) {
        setData(parsedData);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("v1", JSON.stringify(data));
  }, [data]);

  // Chunk days into 7s
  // TODO Find out which weekday to start on to shift it by that amount
  const years = Object.keys(data).map((yearNumber) => {
    const days = [];
    if (!data[yearNumber]) {
      data[yearNumber] = {};
    }
    for (let i = 0; i <= 365; i++) {
      days.push(data[yearNumber][i] || 0);
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return { weeks, name: yearNumber };
  });

  // TODO Get the highest and lowest day count and turn them into bounds for the color gradient

  function getTileStyles(year, weekIndex, dayIndex, value) {
    const dayOfYear = weekIndex * 7 + dayIndex;
    const styles = {}
    if (Number(year) === Number(currentYear) && dayOfYear === currentDay) {
      styles.border = '1px solid var(--bg-color-today)';
    }
    return {
      ...styles,
      backgroundColor:
        value === 0 ? "lightgray" : `hsl(126, 100%, ${90 - 10 * value}%)`,
    };
  }

  return (
    <div className="App page">
      <div className="pagewrapper">
        {years.map((year) => (
          <div key={`y-${year.name}`} className="year">
            <div className="yearname">{year.name}</div>
            <div className="yearcontents">
              <div className="daywrapper">
                <div className="week">
                  {dayNames.map((dayName, i) => (
                    <div key={`day-n ${i}`} className="day dayname">
                      {dayName}
                    </div>
                  ))}
                </div>
                {year.weeks.map((week, i) => (
                  <div key={`${year.name}-${i}`} className="week">
                    {week.map((value, j) => (
                      <div
                        key={`${year.name}-${i}-${j}`}
                        className="day"
                        style={getTileStyles(year.name, i, j, value)}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div className="controls">
          <button
            onClick={() => {
              data[currentYear][currentDay] =
                (data[currentYear][currentDay] || 0) + 1;
              setData({ ...data });
            }}
          >
            +
          </button>
          <button
            onClick={() => {
              const currentValue = data[currentYear][currentDay];
              if (currentValue && currentValue > 0) {
                data[currentYear][currentDay] -= 1;
              } else {
                data[currentYear][currentDay] = 0;
              }
              setData({ ...data });
            }}
          >
            -
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("data");
              setData(getDefaultData())
            }}
          >
            Reset everything
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
