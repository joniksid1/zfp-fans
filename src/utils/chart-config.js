import { chartColors } from "./constants";

const storedFanDataPointsStr = localStorage.getItem('fanDataPoints');
const storedFanModelsStr = localStorage.getItem('fanModels');

if (!storedFanDataPointsStr || !storedFanModelsStr) {
  console.error('Не найдены данные о точках графика и / или моделях вентиляторов в local storage');
}

const storedFanDataPoints = JSON.parse(storedFanDataPointsStr) || {};
const storedFanModels = JSON.parse(storedFanModelsStr) || [];

const getChartData = (modelName, color) => {
  const fanDataPoints = storedFanDataPoints[modelName];

  if (!fanDataPoints) {
    console.error(`Не найдены данные о точках графика для ${modelName}`);
    return null;
  }

  return {
    name: modelName,
    x: fanDataPoints.map(point => point.x),
    y: fanDataPoints.map(point => point.y),
    type: 'scatter',
    mode: 'lines',
    line: {
      color: color,
      width: 2,
    },
  };
};

const chartDataSets = storedFanModels.map((modelName, index) => getChartData(modelName, chartColors[index]));

export default chartDataSets;
