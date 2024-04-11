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
  intersectionPoints,
}) {
  const [revision, setRevision] = useState(0);

  const getLineColor = useCallback(
    (fanName) => {
      if (selectedFan && fanName === selectedFan) {
        return 'red';
      } else if (hoveredFan && fanName === hoveredFan) {
        return 'red';
      } else {
        const matchingDataset = chartDataSets.find((dataset) => dataset && dataset.name === fanName);
        return matchingDataset ? matchingDataset.line.color : 'rgb(152, 152, 152)';
      }
    },
    [selectedFan, hoveredFan, chartDataSets]
  );

  const updatedDataSets = useMemo(() => {
    return (chartDataSets || []).map((dataset) => {
      if (dataset && dataset.name) {
        const fanResult = correctFanResults.find((result) => result.fanName === dataset.name);
        const color = getLineColor(dataset.name);

        if ((displayAllOnPlot || fanResult) && (selectedFan === dataset.name || !selectedFan)) {
          return {
            ...dataset,
            line: { ...dataset.line, color },
          };
        }
      }
      return null;
    }).filter(Boolean);
  }, [correctFanResults, getLineColor, displayAllOnPlot, selectedFan, chartDataSets]);

  useEffect(() => {
    setRevision((r) => r + 1);
  }, [updatedDataSets, selectedFan, hoveredFan, intersectionPoints]);

  const plotData = useMemo(() => {
    let data = [];

    // Добавляем графики. Если selectedFan указан, добавляем только его график.
    if (selectedFan) {
      const datasetForSelectedFan = chartDataSets.find(dataset => dataset.name === selectedFan);
      if (datasetForSelectedFan) {
        const color = getLineColor(selectedFan);
        data.push({
          ...datasetForSelectedFan,
          line: { ...datasetForSelectedFan.line, color },
        });
      }
    } else if (displayAllOnPlot) {
      data = [...updatedDataSets];
    } else {
      // Если displayAllOnPlot выключен, но selectedFan не задан, добавляем графики, соответствующие correctFanResults
      data = updatedDataSets.filter(dataset =>
        correctFanResults.some(result => result.fanName === dataset.name)
      );
    }

    // Добавляем новую точку
    if (newPoint) {
      data.push({
        type: 'scatter',
        mode: 'markers',
        x: [newPoint.x],
        y: [newPoint.y],
        marker: { color: 'red', size: 8 },
        name: 'Рабочая точка',
      });
    }

    // Добавляем расчетные линии
    if (calculatedLine) {
      data.push(calculatedLine);
    }

    // Добавляем точки пересечения
    let filteredIntersectionPoints = intersectionPoints;
    if (selectedFan) {
      // Если selectedFan задан, отображаем только его точку пересечения
      filteredIntersectionPoints = intersectionPoints.filter(point => point.fanModel === selectedFan);
    } else if (!displayAllOnPlot) {
      // Если displayAllOnPlot выключен, отображаем точки, соответствующие correctFanResults
      filteredIntersectionPoints = intersectionPoints.filter(point =>
        correctFanResults.some(result => result.fanName === point.fanModel)
      );
    }

    // Добавляем отфильтрованные точки пересечения
    filteredIntersectionPoints.forEach(point => {
      data.push({
        type: 'scatter',
        mode: 'markers',
        x: [point.x],
        y: [point.y],
        marker: { color: 'blue', size: 8 },
        name: `Фактическая рабочая точка для ${point.fanModel}`,
      });
    });

    return data;
  }, [updatedDataSets, newPoint, calculatedLine, intersectionPoints, correctFanResults, displayAllOnPlot, selectedFan, chartDataSets, getLineColor]);

  return (
    <Plot
      className="chart"
      data={plotData}
      config={{
        displayModeBar: displayModeBar,
        editable: false,
        staticPlot: false,
        responsive: true,
        displaylogo: false,
      }}
      layout={{
        title: 'График рабочей точки',
        xaxis: { title: 'Поток воздуха (м³/ч)', range: [0, 16000 * scale] },
        yaxis: { title: 'Давление сети (Па)', range: [0, 1100 * scale] },
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
  intersectionPoints: PropTypes.arrayOf(PropTypes.object),
};

export default CustomPlot;
