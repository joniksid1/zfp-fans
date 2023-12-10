import { useState, useRef } from 'react';
import Plot from 'react-plotly.js';
import * as dataPoints from '../utils/chart-data-points';
import chartDataSets from '../utils/chart-config';

function Main() {
  const [flowRateValue, setFlowRateValue] = useState('');
  const [staticPressureValue, setStaticPressureValue] = useState('');
  const [scale, setScale] = useState(1);

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
        return console.log(
          `Вентилятор ${fanName} попал в график с рабочей точкой ${flowRateValue} м3/ч ${staticPressureValue} Па`
        );
      }
      return console.log(`Для заданного расхода ${fanName} не хватает ${staticPressureValue - interpolatedY} Па`);
    }
    return console.log(`Расход воздуха ${flowRateValue} вне допустимого диапазона для ${fanName}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const keys = Object.keys(dataPoints);

    for (let i = 0; i < keys.length; i++) {
      calculateFan(dataPoints[keys[i]], keys[i]);
    }

    console.log('Расчёт выполнен...');
  };

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
              data={chartDataSets}
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
    </main>
  );
}

export default Main;
