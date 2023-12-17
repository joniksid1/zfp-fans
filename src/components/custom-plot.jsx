import Plot from 'react-plotly.js';
import chartDataSets from '../utils/chart-config';
import PropTypes from 'prop-types';

const CustomPlot = ({ displayModeBar, newPoint, calculatedLine, perpendicularLines, scale }) => {
  return (
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
    />
  );
};

CustomPlot.propTypes = {
  displayModeBar: PropTypes.bool.isRequired,
  newPoint: PropTypes.object,
  calculatedLine: PropTypes.object,
  perpendicularLines: PropTypes.arrayOf(PropTypes.object),
  scale: PropTypes.number.isRequired,
};

export default CustomPlot;
