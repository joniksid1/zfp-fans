import * as dataPoints from '../utils/chart-data-points';

const chartDataSets = [
  {
    name: 'ZFR-1.9',
    x: dataPoints.ZFR_1_9_2E.map(point => point.x),
    y: dataPoints.ZFR_1_9_2E.map(point => point.y),
    type: 'scatter',
    mode: 'lines',
    line: {
      color: 'rgb(255, 99, 132)',
      width: 2,
    },
  },
  {
    name: 'ZFR-2.25-2E',
    x: dataPoints.ZFR_2_25_2E.map(point => point.x),
    y: dataPoints.ZFR_2_25_2E.map(point => point.y),
    type: 'scatter',
    mode: 'lines',
    line: {
      color: 'rgb(173, 255, 47)',
      width: 2,
    },
  },
  {
    name: 'ZFR-2.5-2E',
    x: dataPoints.ZFR_2_5_2E.map(point => point.x),
    y: dataPoints.ZFR_2_5_2E.map(point => point.y),
    type: 'scatter',
    mode: 'lines',
    line: {
      color: 'rgb(255, 105, 180)',
      width: 2,
    },
  },
  {
    name: 'ZFR-2.8-2E',
    x: dataPoints.ZFR_2_8_2E.map(point => point.x),
    y: dataPoints.ZFR_2_8_2E.map(point => point.y),
    type: 'scatter',
    mode: 'lines',
    line: {
      color: 'rgb(127, 255, 212)',
      width: 2,
    },
  },
  {
    name: 'ZFR-3.1-4E/3.1-4D',
    x: dataPoints.ZFR_3_1_4E_3_1_4D.map(point => point.x),
    y: dataPoints.ZFR_3_1_4E_3_1_4D.map(point => point.y),
    type: 'scatter',
    mode: 'lines',
    line: {
      color: 'rgb(0, 0, 255)',
      width: 2,
    },
  },
  {
    name: 'ZFR-3.5-4E',
    x: dataPoints.ZFR_3_5_4E.map(point => point.x),
    y: dataPoints.ZFR_3_5_4E.map(point => point.y),
    type: 'scatter',
    mode: 'lines',
    line: {
      color: 'rgb(139, 0, 139)',
      width: 2,
    },
  },
  {
    name: 'ZFR-3.5-4D',
    x: dataPoints.ZFR_3_5_4D.map(point => point.x),
    y: dataPoints.ZFR_3_5_4D.map(point => point.y),
    type: 'scatter',
    mode: 'lines',
    line: {
      color: 'rgb(255, 165, 0)',
      width: 2,
    },
  },
  {
    name: 'ZFR-4-4E',
    x: dataPoints.ZFR_4_4E.map(point => point.x),
    y: dataPoints.ZFR_4_4E.map(point => point.y),
    type: 'scatter',
    mode: 'lines',
    line: {
      color: 'rgb(255, 0, 255)',
      width: 2,
    },
  },
  {
    name: 'ZFR-4-4D',
    x: dataPoints.ZFR_4_4D.map(point => point.x),
    y: dataPoints.ZFR_4_4D.map(point => point.y),
    type: 'scatter',
    mode: 'lines',
    line: {
      color: 'rgb(105, 105, 105)',
      width: 2,
    },
  },
  {
    name: 'ZFR-4.5-4E',
    x: dataPoints.ZFR_4_5_4E.map(point => point.x),
    y: dataPoints.ZFR_4_5_4E.map(point => point.y),
    type: 'scatter',
    mode: 'lines',
    line: {
      color: 'rgb(0, 255, 0)',
      width: 2,
    },
  },
  {
    name: 'ZFR-4.5-4D',
    x: dataPoints.ZFR_4_5_4D.map(point => point.x),
    y: dataPoints.ZFR_4_5_4D.map(point => point.y),
    type: 'scatter',
    mode: 'lines',
    line: {
      color: 'rgb(0, 0, 0)',
      width: 2,
    },
  },
  {
    name: 'ZFR-5-4D',
    x: dataPoints.ZFR_5_4D.map(point => point.x),
    y: dataPoints.ZFR_5_4D.map(point => point.y),
    type: 'scatter',
    mode: 'lines',
    line: {
      color: 'rgb(0, 128, 0)',
      width: 2,
    },
  },
  {
    name: 'ZFR-5.6-4D',
    x: dataPoints.ZFR_5_6_4D.map(point => point.x),
    y: dataPoints.ZFR_5_6_4D.map(point => point.y),
    type: 'scatter',
    mode: 'lines',
    line: {
      color: 'rgb(189, 183, 107)',
      width: 2,
    },
  },
  {
    name: 'ZFR-6.3-4D',
    x: dataPoints.ZFR_6_3_4D.map(point => point.x),
    y: dataPoints.ZFR_6_3_4D.map(point => point.y),
    type: 'scatter',
    mode: 'lines',
    line: {
      color: 'rgb(139, 69, 19)',
      width: 2,
    },
  },
];

export default chartDataSets;
