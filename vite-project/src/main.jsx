import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  ZFR_1_9_2E_dataPoints,
  ZFR_2_25_2E_dataPoints,
  ZFR_2_5_2E_dataPoints,
  ZFR_2_8_2E_dataPoints,
  ZFR_3_1_4E_3_1_4D_dataPoints,
  ZFR_3_5_4E_dataPoints,
  ZFR_3_5_4D_dataPoints,
  ZFR_4_4E_dataPoints,
  ZFR_4_4D_dataPoints,
  ZFR_4_5_4E_dataPoints,
  ZFR_4_5_4D_dataPoints,
  ZFR_5_4D_dataPoints,
  ZFR_5_6_4D_dataPoints,
  ZFR_6_3_4D_dataPoints,
} from '../constants/constants'

function Main() {
  const [flowRateValue, setFlowRateValue] = useState('');
  const [staticPressureValue, setStaticPressureValue] = useState('');
  const [scale, setScale] = useState(1);

  const flowRateValueChange = (e) => {
    setFlowRateValue(e.target.value);
  }

  const staticPressureValueChange = (e) => {
    setStaticPressureValue(e.target.value);
  }

  const handleScaleSliderChange = (e) => {
    setScale(parseFloat(e.target.value));
  }

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'График рабочей точки',
      },
    },
    scales: {
      x: {
        type: 'linear',
        min: 0,
        max: 16000,
        ticks: {
          stepSize: 100 * scale,
        },
      },
      y: {
        type: 'linear',
        min: 0,
        max: 1100,
        ticks: {
          stepSize: 100 * scale,
        },
      },
    },
  };

  const data = {
    datasets: [
      {
        label: 'ZFR-1.9',
        data: ZFR_1_9_2E_dataPoints,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'ZFR-2.25-2E',
        data: ZFR_2_25_2E_dataPoints,
        borderColor: 'rgb(173, 255, 47)',
        backgroundColor: 'rgba(173, 255, 47, 0.8)',
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'ZFR-2.5-2E',
        data: ZFR_2_5_2E_dataPoints,
        borderColor: 'rgb(255, 105, 180)',
        backgroundColor: 'rgba(255, 105, 180, 0.8)',
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'ZFR-2.8-2E',
        data: ZFR_2_8_2E_dataPoints,
        borderColor: 'rgb(127, 255, 212)',
        backgroundColor: 'rgba(127, 255, 212, 0.8)',
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'ZFR-3.1-4E/3.1-4D',
        data: ZFR_3_1_4E_3_1_4D_dataPoints,
        borderColor: 'rgb(0, 0, 255)',
        backgroundColor: 'rgba(0, 0, 255, 0.8)',
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'ZFR-3.5-4E',
        data: ZFR_3_5_4E_dataPoints,
        borderColor: 'rgb(139, 0, 139)',
        backgroundColor: 'rgba(139, 0, 139, 0.8)',
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'ZFR-3.5-4D',
        data: ZFR_3_5_4D_dataPoints,
        borderColor: 'rgb(245, 255, 250)',
        backgroundColor: 'rgba(245, 255, 250, 0.8)',
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'ZFR-4-4E',
        data: ZFR_4_4E_dataPoints,
        borderColor: 'rgb(255, 0, 255)',
        backgroundColor: 'rgba(255, 0, 255, 0.8)',
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'ZFR-4-4D',
        data: ZFR_4_4D_dataPoints,
        borderColor: 'rgb(105, 105, 105)',
        backgroundColor: 'rgba(105, 105, 105, 0.8)',
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'ZFR-4.5-4E',
        data: ZFR_4_5_4E_dataPoints,
        borderColor: 'rgb(0, 255, 0)',
        backgroundColor: 'rgba(0, 255, 0, 0.8)',
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'ZFR-4.5-4D',
        data: ZFR_4_5_4D_dataPoints,
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'ZFR-5-4D',
        data: ZFR_5_4D_dataPoints,
        borderColor: 'rgb(0, 128, 0)',
        backgroundColor: 'rgba(0, 128, 0, 0.8)',
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'ZFR-5.6-4D',
        data: ZFR_5_6_4D_dataPoints,
        borderColor: 'rgb(189, 183, 107)',
        backgroundColor: 'rgba(189, 183, 107, 0.8)',
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'ZFR-6.3-4D',
        data: ZFR_6_3_4D_dataPoints,
        borderColor: 'rgb(139, 69, 19)',
        backgroundColor: 'rgba(139, 69, 19, 0.8)',
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
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

  const calculateFan = (dataPoints) => {
    const maxXValue = Math.max(...dataPoints.map(point => point.x));
    if (flowRateValue <= maxXValue && flowRateValue > 0) {
      const interpolatedY = interpolatePoints(flowRateValue, dataPoints);
      if (interpolatedY >= staticPressureValue) {
        return console.log(`Вентилятор попал в график с рабочей точкой ${flowRateValue} м3/ч ${staticPressureValue} Па`);
      }
      return console.log(`Для заданного расхода не хватает ${staticPressureValue - interpolatedY} Па`)
    }
    return console.log(`Расход воздуха ${flowRateValue} вне допустимого диапазона`);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateFan(ZFR_1_9_2E_dataPoints);
    console.log('Расчёт выполнен...')
  }

  return (
    <main className="main">
      <section className="calculator">
        <h1 className="calculator__title" aria-label="Расчёт вентилятора">
          Расчёт крышного вентилятора
        </h1>
        <div className="calculator__wrapper">
          <div className='calculator__chart'>
            <Line options={options} data={data} />
          </div>
          <form
            name='calculator'
            className="calculator__form"
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="scale-control">
              <label htmlFor="scaleInput" className="calculator__label">
                Масштаб:
              </label>
              <input
                type="range"
                id="scaleSlider"
                className="calculator__input calculator__input_type_scale"
                min="0.1"
                max="2"
                step="0.1"
                value={scale}
                onChange={handleScaleSliderChange}
              />
            </div>
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
