import { useEffect, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';

function CustomPlot({
  displayModeBar,
  newPoint,
  calculatedLine,
  perpendicularLines,
  scale,
  selectedFan,
  hoveredFan,
  correctFanResults,
  displayAllOnPlot,
  chartDataSets,
}) {
  const [revision, setRevision] = useState(0);

  // Выбор цвета линии в зависимости от наведения на список вентиляторов в результате расчёта
  const getLineColor = useCallback(
    (fanName) => {
      if (selectedFan && fanName === selectedFan) {
        return 'red'; // Если вентилятор выбран, цвет - красный
      } else if (hoveredFan && fanName === hoveredFan) {
        return 'red'; // Если вентилятор наведен, цвет - красный
      } else {
        const matchingDataset = chartDataSets.find((dataset) => dataset.name === fanName);
        if (matchingDataset) {
          return matchingDataset.line.color;
        }
        return 'rgb(152, 152, 152)';
      }
    },
    [selectedFan, hoveredFan, chartDataSets]
  );

  // Обновление линий графиков вентиляторов в зависимости от результата расчётов и выбранного вентилятора
  const updatedDataSets = useMemo(() => {
    return (chartDataSets || []).map((dataset) => {
      const fanResult = correctFanResults.find((result) => result.fanName === dataset.name);
      const color = getLineColor(dataset.name);

      if ((displayAllOnPlot || fanResult) && (selectedFan === dataset.name || !selectedFan)) {
        return {
          ...dataset,
          line: {
            ...dataset.line,
            color: color,
          },
        };
      }
    });
  }, [correctFanResults, getLineColor, displayAllOnPlot, selectedFan, chartDataSets]);

  useEffect(() => {
    // Обновляем график
    setRevision((r) => r + 1);
  }, [updatedDataSets, selectedFan, hoveredFan]); // Инициализация перерисовки компонента графика при изменении updatedDataSets, selectedFan или hoveredFan

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
      revision={revision}
    />
  );
}

CustomPlot.propTypes = {
  displayModeBar: PropTypes.bool.isRequired,
  newPoint: PropTypes.object,
  calculatedLine: PropTypes.object,
  perpendicularLines: PropTypes.arrayOf(PropTypes.object),
  scale: PropTypes.number.isRequired,
  selectedFan: PropTypes.string,
  hoveredFan: PropTypes.string,
  correctFanResults: PropTypes.arrayOf(
    PropTypes.shape({
      fanName: PropTypes.string.isRequired,
      result: PropTypes.string.isRequired,
    })
  ),
  displayAllOnPlot: PropTypes.bool,
  chartDataSets: PropTypes.array,
};

export default CustomPlot;
