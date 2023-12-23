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
  const [fanResults, setFanResults] = useState([]);
  const [logMessages, setLogMessages] = useState([]);
  const [newPoint, setNewPoint] = useState(null);
  const [perpendicularLines, setPerpendicularLines] = useState([]);
  const [calculatedLine, setCalculatedLine] = useState(null);
  const [displayModeBar, setDisplayModeBar] = useState(false);

  const plotRef = useRef(null);

  // Обработка инпутов ввода расхода воздуа и давления

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

  // Изменение масштаба графика с помощью "слайдера"

  const handleScaleSliderChange = (e) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
  };

  // Рассчёт промежуточных точек графиков вентилятора интерполяцией (не используется в отрисовке, только для расчёта)

  function interpolateY(x, points) {
    if (x <= points[0].x) {
      return points[0].y;
    }

    for (let i = 1; i < points.length; i++) {
      if (x < points[i].x) {
        const x0 = points[i - 1].x;
        const y0 = points[i - 1].y;
        const x1 = points[i].x;
        const y1 = points[i].y;

        const ratio = (x - x0) / (x1 - x0);
        return y0 + ratio * (y1 - y0);
      }
    }

    return points[points.length - 1].y;
  }

  // Обратная интерполяция для вычисления x (м3/ч) по заданному y (Па)

  function inverseInterpolateX(y, points) {
    if (y >= points[0].y) {
      return points[0].x;
    }

    for (let i = 1; i < points.length; i++) {
      if (y > points[i].y) {
        const x0 = points[i - 1].x;
        const y0 = points[i - 1].y;
        const x1 = points[i].x;
        const y1 = points[i].y;

        const ratio = (y - y0) / (y1 - y0);
        return x0 + ratio * (x1 - x0);
      }
    }

    return points[points.length - 1].x;
  }

  const calculateFan = (dataPoints, fanName) => {
    const maxXValue = Math.max(...dataPoints.map(point => point.x));
    const xValue = parseFloat(flowRateValue);
    const yValue = parseFloat(staticPressureValue);

    const interpolatedY = interpolateY(xValue, dataPoints);
    const interpolatedX = inverseInterpolateX(yValue, dataPoints);

    let resultMessage;
    const flowDeviation = Math.round((interpolatedX - xValue) / xValue * 100);

    if (xValue <= maxXValue && xValue > 0) {
      if (yValue <= interpolatedY ) {
        resultMessage = `попал в график с рабочей точкой ${xValue} м3/ч ${yValue} Па, отклонение по расходу +${flowDeviation}%`;
        setFanResults((prevResults) => [
          ...prevResults,
          { fanName, result: resultMessage, flowDeviation },
        ]);
      } else {
        resultMessage = `не хватает ${Math.round(yValue - interpolatedY)} Па для заданного расхода воздуха ${xValue} м3/ч, отклонение по расходу ${flowDeviation}%`;
      }
    } else {
      resultMessage = `расход воздуха ${xValue} м3/ч вне допустимого диапазона, максимальный расход для данного вентилятора ${maxXValue} м3/ч, отклонение по расходу ${flowDeviation}%`;
    }

    setLogMessages(prevResults => [
      ...prevResults,
      fanName, resultMessage,
    ]);
  };

  // Установка заданной точки, линии сопротивления сети и перпендикулярных линий на графике при расчёте

  const setPointWithLinesOnChart = () => {
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

  // Вызывается в по нажатию на "Рассчитать"

  const handleSubmit = (e) => {
    e.preventDefault();
    const keys = Object.keys(dataPoints);
    setFanResults([]);

    for (let i = 0; i < keys.length; i++) {
      calculateFan(dataPoints[keys[i]], keys[i]);
    }

    setPointWithLinesOnChart();
  };

  // Очистка лога на кнопку "Очистить"

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
            fanResults={fanResults}
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
