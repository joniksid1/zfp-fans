import { useEffect, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import chartDataSets from '../utils/chart-config';

const CustomPlot = ({ displayModeBar, newPoint, calculatedLine, perpendicularLines, scale, hoveredFan }) => {
  const [revision, setRevision] = useState(0);

  // Выбор цвета линии в зависимости от наведения на список вентиляторов в результате расчёта

  const getLineColor = useCallback(
    (fanName) => {
      if (hoveredFan && fanName === hoveredFan) {
        return 'red';
      } else {
        const matchingDataset = chartDataSets.find((dataset) => dataset.name === fanName);
        if (matchingDataset) {
          return matchingDataset.line.color;
        }
        return 'rgb(152, 150, 150)';
      }
    },
    [hoveredFan]
  );

  // Обновление цвета линий графиков вентиляторов

  const updatedDataSets = useMemo(() => {
    return chartDataSets.map((dataset) => {
      if (dataset.name === hoveredFan) {
        const newDataset = {
          ...dataset,
          line: {
            ...dataset.line,
            color: getLineColor(hoveredFan),
          },
        };
        return newDataset;
      } else {
        const newColor = getLineColor(dataset.name);
        return {
          ...dataset,
          line: {
            ...dataset.line,
            color: newColor,
          },
        };
      }
    });
  }, [hoveredFan, getLineColor]);

  useEffect(() => {
    // Обновляем график
    setRevision((r) => r + 1);
  }, [updatedDataSets]); // Инициализация перерисовки компонента графика при изменении updatedDataSets

  return (
    <Plot
      className="chart"
      data={[
        ...updatedDataSets,
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
        displayModeBar: displayModeBar,
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
      revision={revision} // Без этого пропса график не перерисовывается
    />

  );
};

CustomPlot.propTypes = {
  displayModeBar: PropTypes.bool.isRequired,
  newPoint: PropTypes.object,
  calculatedLine: PropTypes.object,
  perpendicularLines: PropTypes.arrayOf(PropTypes.object),
  scale: PropTypes.number.isRequired,
  hoveredFan: PropTypes.string,
};

export default CustomPlot;
