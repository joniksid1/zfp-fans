import { useState, useRef } from 'react';
import Plot from 'react-plotly.js';
import * as dataPoints from '../utils/chart-data-points';
import chartDataSets from '../utils/chart-config';

function Main() {
  const [flowRateValue, setFlowRateValue] = useState('');
  const [staticPressureValue, setStaticPressureValue] = useState('');
  const [scale, setScale] = useState(1);
  const [logMessages, setLogMessages] = useState([]);
  const [newPoint, setNewPoint] = useState(null);
  const [perpendicularLines, setPerpendicularLines] = useState([]);
  const [calculatedLine, setCalculatedLine] = useState(null);

  const plotRef = useRef(null);

  const flowRateValueChange = (e) => {
    setFlowRateValue(e.target.value);
  };

  const staticPressureValueChange = (e) => {
    setStaticPressureValue(e.target.value);
  };

  const handleScaleSliderChange = (e) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
  };

  function linearInterpolation(x, x1, y1, x2, y2) {
    return y1 + (x - x1) * ((y2 - y1) / (x2 - x1));
  }

  function interpolatePoints(xValue, dataPoints) {
    for (let i = 0; i < dataPoints.length - 1; i++) {
      const point1 = dataPoints[i];
      const point2 = dataPoints[i + 1];

      if (xValue >= point1.x && xValue <= point2.x) {
        const interpolatedY = linearInterpolation(xValue, point1.x, point1.y, point2.x, point2.y);
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
      <section className="calculator">
        <h1 className="calculator__title" aria-label="Расчёт вентилятора">
          Расчёт крышного вентилятора
        </h1>
        <div className="calculator__wrapper">
          <div className='calculator__chart' ref={plotRef}>
            <Plot
              className='chart'
              data={[
                ...chartDataSets,
                newPoint && {
                  type: 'scatter',
                  mode: 'markers',
                  x: [newPoint.x],
                  y: [newPoint.y],
                  marker: { color: 'red', size: 8 },
                  name: 'Рабочая точка',
                },
                calculatedLine,
              ].filter(Boolean)}
              config={{
                displayModeBar: false,
                editable: false,
                staticPlot: false,
                responsive: true,
                displaylogo: false,
              }}
              layout={{
                title: 'График рабочей точки',
                xaxis: {
                  title: 'Поток воздуха (м³/ч)',
                  range: [0, 16000 * scale],
                },
                yaxis: {
                  title: 'Давление сети (Па)',
                  range: [0, 1100 * scale],
                },
                shapes: perpendicularLines,
              }}
            />
          </div>
          <form
            name='calculator'
            className="calculator__form"
            noValidate
            onSubmit={handleSubmit}
          >
            <label htmlFor="scaleInput" className="calculator__label">
              Масштаб:
            </label>
            <input
              type="range"
              id="scaleSlider"
              className="styled-slider slider-progress"
              min="0.1"
              max="2"
              step="0.1"
              value={scale}
              onChange={handleScaleSliderChange}
            />
            <label htmlFor="flowRateInput" className="calculator__label">
              Поток воздуха (м³/ч):
            </label>
            <input
              name="flowRate"
              minLength={1}
              maxLength={5}
              type="number"
              id="flowRateInput"
              className="calculator__input calculator__input_type_flow-rate"
              required=""
              value={flowRateValue ?? ''}
              onChange={flowRateValueChange}
            />
            <label htmlFor="staticPressureInput" className="calculator__label">
              Давление сети (Па):
            </label>
            <input
              name="staticPressure"
              type="number"
              id="staticPressureInput"
              className="calculator__input calculator__input_type_static-pressure"
              required=""
              value={staticPressureValue ?? ''}
              onChange={staticPressureValueChange}
            />
            <button
              className='calculator__button'
              type="submit"
            >
              Рассчитать
            </button>
          </form>
        </div>
      </section>
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
    </main>
  );
}

export default Main;
