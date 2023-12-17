import { useState, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import * as dataPoints from '../utils/chart-data-points';
import Info from './info';
import Calculator from './calculator';
import PropTypes from 'prop-types';
import { INPUT_REGEXP } from '../utils/constants';

function Main({ view }) {
  const [flowRateValue, setFlowRateValue] = useState('');
  const [staticPressureValue, setStaticPressureValue] = useState('');
  const [scale, setScale] = useState(1);
  const [logMessages, setLogMessages] = useState([]);
  const [newPoint, setNewPoint] = useState(null);
  const [perpendicularLines, setPerpendicularLines] = useState([]);
  const [calculatedLine, setCalculatedLine] = useState(null);
  const [displayModeBar, setDisplayModeBar] = useState(false);

  const plotRef = useRef(null);

  const flowRateValueChange = (e) => {
    if (INPUT_REGEXP.test(e.target.value)) {
      setFlowRateValue(e.target.value);
    }
  };

  const staticPressureValueChange = (e) => {
    if (INPUT_REGEXP.test(e.target.value)) {
      setStaticPressureValue(e.target.value);
    }
  };

  const handleScaleSliderChange = (e) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
  };

  function quadraticInterpolation(x, x0, y0, x1, y1, x2, y2) {
    const t = (x - x0) / (x1 - x0);
    const u = (x1 - x) / (x1 - x0);
    return y0 * u * u + y1 * 2 * t * u + y2 * t * t;
  }

  function interpolatePoints(xValue, dataPoints) {
    for (let i = 0; i < dataPoints.length - 2; i++) {
      const point0 = dataPoints[i];
      const point1 = dataPoints[i + 1];
      const point2 = dataPoints[i + 2];

      if (xValue >= point1.x && xValue <= point2.x) {
        const interpolatedY = quadraticInterpolation(
          xValue, point0.x, point0.y, point1.x, point1.y, point2.x, point2.y
        );
        return interpolatedY;
      }
    }
  }

  const calculateFan = (dataPoints, fanName) => {
    const maxXValue = Math.max(...dataPoints.map(point => point.x));
    if (flowRateValue <= maxXValue && flowRateValue > 0) {
      const interpolatedY = interpolatePoints(flowRateValue, dataPoints);
      if (interpolatedY >= staticPressureValue) {
        setLogMessages(prevMessages => [
          ...prevMessages,
          `Вентилятор ${fanName} попал в график с рабочей точкой ${flowRateValue} м3/ч ${staticPressureValue} Па`,
        ]);
        return;
      }
      setLogMessages(prevMessages => [
        ...prevMessages,
        `Для заданного расхода ${fanName} не хватает ${staticPressureValue - interpolatedY} Па`,
      ]);
    } else {
      setLogMessages(prevMessages => [
        ...prevMessages,
        `Расход воздуха ${flowRateValue} вне допустимого диапазона для ${fanName}`,
      ]);
    }
  };

  const setPointOnChart = () => {
    const xValue = parseFloat(flowRateValue);
    const yValue = parseFloat(staticPressureValue);

    if (!isNaN(xValue) && !isNaN(yValue)) {
      const newPoint = {
        x: xValue,
        y: yValue,
      };

      const perpendicularLines = [
        { type: 'line', x0: xValue, y0: 0, x1: xValue, y1: yValue, line: { dash: 'dash', color: 'grey' } },
        { type: 'line', x0: 0, y0: yValue, x1: xValue, y1: yValue, line: { dash: 'dash', color: 'grey' } },
      ];

      const k = yValue / (xValue ** 2);

      const calculatedLinePoints = [];
      for (let v = 0; v <= xValue; v += 100) {
        const p = k * v ** 2;
        calculatedLinePoints.push({ x: v, y: p });
      }

      const networkResistanceLine = {
        name: 'Сопротивление сети',
        type: 'scatter',
        mode: 'lines',
        x: calculatedLinePoints.map(point => point.x),
        y: calculatedLinePoints.map(point => point.y),
        line: { color: 'red' },
      };

      setNewPoint(newPoint);
      setPerpendicularLines(perpendicularLines);
      setCalculatedLine(networkResistanceLine);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const keys = Object.keys(dataPoints);

    for (let i = 0; i < keys.length; i++) {
      calculateFan(dataPoints[keys[i]], keys[i]);
    }

    setPointOnChart();
  };

  const handleLogClear = () => {
    setLogMessages([]);
  }

  return (
    <main className="main">
      <Routes>
        <Route path="/info" element={<Info />} />
        <Route path="/" element={
          <Calculator
            plotRef={plotRef}
            displayModeBar={displayModeBar}
            newPoint={newPoint}
            calculatedLine={calculatedLine}
            perpendicularLines={perpendicularLines}
            scale={scale}
            handleSubmit={handleSubmit}
            handleScaleSliderChange={handleScaleSliderChange}
            flowRateValue={flowRateValue}
            flowRateValueChange={flowRateValueChange}
            staticPressureValue={staticPressureValue}
            staticPressureValueChange={staticPressureValueChange}
            view={view}
            setDisplayModeBar={setDisplayModeBar}
          />
        } />
      </Routes>
      {view === 'form' &&
        <section className='log'>
          <h2 className='log__title'>
            Лог расчёта:
          </h2>
          <div className='log__wrapper'>
            <button
              className='log__button calculator__button'
              onClick={handleLogClear}
            >
              Очистить лог
            </button>
            <p className="log__data">
              {logMessages.map((message, index) => (
                <span key={index}>{message}<br /></span>
              ))}
            </p>
          </div>
        </section>
      }
    </main >
  );
}

Main.propTypes = {
  view: PropTypes.string,
};


export default Main;
