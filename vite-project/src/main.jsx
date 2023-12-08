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

function Main() {
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
        position: 'top',
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
          max: 1000,
        },
        y: {
          type: 'linear',
          min: 0,
          max: 1000,
        },
    },
  };

  const dataPoints = [
    { x: 0, y: 247 },
    { x: 36, y: 238 },
    { x: 68, y: 230 },
    { x: 100, y: 223 },
    { x: 132, y: 215 },
    { x: 161, y: 209 },
    { x: 200, y: 200 },
    { x: 238, y: 191 },
    { x: 266, y: 184 },
    { x: 294, y: 176 },
    { x: 314, y: 171 },
    { x: 343, y: 162 },
    { x: 375, y: 151 },
    { x: 401, y: 140 },
    { x: 420, y: 129 },
    { x: 438, y: 116 },
    { x: 454, y: 102 },
    { x: 466, y: 86 },
    { x: 476, y: 70 },
    { x: 484, y: 54 },
    { x: 494, y: 34 },
    { x: 505, y: 15 },
    { x: 516, y: 0 },
  ];

  const data = {
    datasets: [
      {
        label: 'ZFR-1.9',
        data: dataPoints,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        fill: false, // чтобы не закрашивать область под линией
      },
    ],
  };

  return (
    <main className="main">
      <section className="calculator">
        <div className="calculator__wrapper">
          <h1 className="calculator__title" aria-label="Расчёт вентилятора">
            Расчёт вентилятора
          </h1>
          <div style={{ width: '400px', height: '400px' }}> {/* Перенести в css */}
            <Line options={options} data={data} />
          </div>
          <button className="calculator__button" />
        </div>
      </section>
    </main>
  );
}

export default Main;
