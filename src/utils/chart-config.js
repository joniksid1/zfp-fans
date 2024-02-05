import { chartColors } from "./constants";

const getChartDataSets = () => {
  const storedFanDataPointsStr = sessionStorage.getItem('fanDataPoints');
  const storedFanModelsStr = sessionStorage.getItem('fanModels');

  if (!storedFanDataPointsStr || !storedFanModelsStr) {
    console.error('Не найдены данные о точках графика и / или моделях вентиляторов в session storage');
  }

  const storedFanDataPoints = JSON.parse(storedFanDataPointsStr) || {};
  const storedFanModels = JSON.parse(storedFanModelsStr) || [];

  const getChartData = (modelName) => {
    const fanDataPoints = storedFanDataPoints[modelName];

    // Добавляем проверку на null и undefined перед обращением к данным точек графика, но она убирает нули
    const xValues = fanDataPoints.map(point => (point && point.x !== undefined) ? point.x : null);
    const yValues = fanDataPoints.map(point => (point && point.y !== undefined) ? point.y : null);

    // Добавляем недостающие значения 0
    if (xValues.length > 0 && xValues[0] !== 0) {
      xValues.unshift(0);
      yValues.unshift(0);
    }

    return {
      name: modelName,
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines',
      line: {
        color: chartColors[modelName] || 'rgb(132, 132, 132)', // Задаем цвет по умолчанию, если цвет не найден
        width: 2,
      },
    };
  };

  const chartDataSets = storedFanModels.map((modelName) => {
    return getChartData(modelName)
  });

  return chartDataSets;
}

export default getChartDataSets;
