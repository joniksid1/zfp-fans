import { useState, useRef, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Info from './info';
import Calculator from './calculator';
import CalculationResults from './calculation-results';
import PropTypes from 'prop-types';
import { FLOW_INPUT_REGEXP, PRESSURE_INPUT_REGEXP } from '../utils/constants';
import { getFanModels, getFanDataPoints } from '../utils/api';

function Main({
  view,
  switchToForm,
  switchToResults,
}) {
  const [projectNameValue, setProjectNameValue] = useState('');
  const [flowRateValue, setFlowRateValue] = useState('');
  const [staticPressureValue, setStaticPressureValue] = useState('');
  const [scale, setScale] = useState(1);
  const [correctFanResults, setCorrectFanResults] = useState([]);
  const [allFanResults, setAllFanResults] = useState([]);
  const [resultsHistory, setResultsHistory] = useState([]);
  const [logMessages, setLogMessages] = useState([]);
  const [newPoint, setNewPoint] = useState(null);
  const [perpendicularLines, setPerpendicularLines] = useState([]);
  const [calculatedLine, setCalculatedLine] = useState(null);
  const [displayModeBar, setDisplayModeBar] = useState(false);
  const [displayLog, setDisplayLog] = useState(true);
  const [fanModels, setFanModels] = useState([]);
  const [fanDataPoints, setFanDataPoints] = useState({});
  const [dataSheetLoading, setDataSheetLoading] = useState(false);
  const [commercialLoading, setCommercialLoading] = useState(false);
  const [isProjectNameLocked, setIsProjectNameLocked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedFanModels = localStorage.getItem('fanModels');
        const storedFanDataPoints = localStorage.getItem('fanDataPoints');

        if (storedFanModels && storedFanDataPoints) {
          setFanModels(JSON.parse(storedFanModels));
          setFanDataPoints(JSON.parse(storedFanDataPoints));
        } else {
          // Если данные отсутствуют в localStorage, загружаем их с сервера
          // Получаем список вентиляторов

          const modelsArray = await getFanModels();
          setFanModels(modelsArray);

          // Получаем точки графика для каждого вентилятора
          const fanDataResults = await getFanDataPoints();

          // Создаем объект с fanDataPoints, используя модель вентилятора в качестве ключа
          const dataPointsObject = {};
          fanDataResults.forEach((result, index) => {

            // Используем модель вентилятора из modelsArray
            const fanModel = modelsArray[index];
            dataPointsObject[fanModel] = result.data;
          });

          // Сохраняем полученные даные в стейт
          setFanDataPoints(dataPointsObject);

          // Сохраняем полученные данные в localStorage
          localStorage.setItem('fanModels', JSON.stringify(modelsArray));
          localStorage.setItem('fanDataPoints', JSON.stringify(dataPointsObject));
        }
      } catch (error) {
        console.error('Ошибка при запросе данных названия и точек графика вентилятора:', error.message);
      }
    };

    fetchData();
  }, []);  // Пустой массив зависимостей указывает на однократный вызов при монтировании компонента

  const plotRef = useRef(null);

  const addResultsToHistory = (newResult) => {
    setResultsHistory(prevHistory => [newResult, ...prevHistory]);
  };

  // Обработка инпута изменения названия проекта

  const projectNameValueChange = (e) => {
    setProjectNameValue(e.target.value);
  };

  // Обработка инпутов ввода расхода воздуха и давления

  const flowRateValueChange = (e) => {
    const inputValue = e.target.value;

    // Проверка, что введенное значение не является нулем и соответствует регулярному выражению
    if (FLOW_INPUT_REGEXP.test(inputValue) && parseFloat(inputValue) !== 0) {
      setFlowRateValue(inputValue);
    }
  };

  const staticPressureValueChange = (e) => {
    if (PRESSURE_INPUT_REGEXP.test(e.target.value)) {
      setStaticPressureValue(e.target.value);
    }
  };

  // Изменение масштаба графика с помощью "слайдера"

  const handleScaleSliderChange = (e) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
  };

  // Рассчёт промежуточных точек графиков вентилятора интерполяцией (не используется в отрисовке, только для расчёта)

  function interpolateY(x, points) {
    if (x <= points[0].x) {
      return points[0].y;
    }

    for (let i = 1; i < points.length; i++) {
      if (x < points[i].x) {
        const x0 = points[i - 1].x;
        const y0 = points[i - 1].y;
        const x1 = points[i].x;
        const y1 = points[i].y;

        const ratio = (x - x0) / (x1 - x0);
        return y0 + ratio * (y1 - y0);
      }
    }

    return points[points.length - 1].y;
  }

  // Обратная интерполяция для вычисления x (м3/ч) по заданному y (Па)

  function inverseInterpolateX(y, points) {
    if (y >= points[0].y) {
      return points[0].x;
    }

    for (let i = 1; i < points.length; i++) {
      if (y > points[i].y) {
        const x0 = points[i - 1].x;
        const y0 = points[i - 1].y;
        const x1 = points[i].x;
        const y1 = points[i].y;

        const ratio = (y - y0) / (y1 - y0);
        return x0 + ratio * (x1 - x0);
      }
    }

    return points[points.length - 1].x;
  }

  // Расчёт вентилятора с записью сообщений в стейты и логи

  const calculateFan = (dataPoints, fanName) => {
    const maxXValue = Math.max(...dataPoints.map(point => point.x));
    const xValue = parseFloat(flowRateValue);

    const yValue = parseFloat(staticPressureValue);

    const interpolatedY = interpolateY(xValue, dataPoints);
    const interpolatedX = inverseInterpolateX(yValue, dataPoints);

    let resultMessage;

    const flowDeviation = Math.round((interpolatedX - xValue) / xValue * 100);

    const staticPressureDeviation = Math.round((interpolatedY - yValue) / yValue * 100);

    if (xValue <= maxXValue && xValue > 0) {
      if (yValue <= interpolatedY) {
        if (yValue !== 0) {
          resultMessage = `попал в график с рабочей точкой ${xValue} м3/ч ${yValue} Па, отклонение по расходу + ${flowDeviation} %, отклонение по напору + ${staticPressureDeviation} %`;
        } else {
          resultMessage = `попал в график с рабочей точкой ${xValue} м3/ч ${yValue} Па, отклонение по расходу + ${flowDeviation} %`;
        }
        setCorrectFanResults((prevResults) => [
          ...prevResults,
          { fanName, result: resultMessage, flowDeviation },
        ]);
        setAllFanResults((prevResults) => [
          ...prevResults,
          { fanName, result: resultMessage, flowDeviation: `+${flowDeviation}` },
        ]);
      } else {
        setAllFanResults((prevResults) => [
          ...prevResults,
          { fanName, result: resultMessage, flowDeviation },
        ]);
        resultMessage = `не хватает ${Math.round(yValue - interpolatedY)} Па для заданного расхода воздуха ${xValue} м3/ч, отклонение по расходу ${flowDeviation} %`;
      }
    } else {
      setAllFanResults((prevResults) => [
        ...prevResults,
        { fanName, result: resultMessage, flowDeviation },
      ]);
      resultMessage = `расход воздуха ${xValue} м3/ч вне допустимого диапазона, максимальный расход для данного вентилятора ${maxXValue} м3/ч, отклонение по расходу ${flowDeviation} %`;
    }

    setLogMessages(prevResults => [
      ...prevResults,
      fanName, resultMessage,
    ]);
  };

  // Установка заданной точки, линии сопротивления сети и перпендикулярных линий на графике при расчёте

  const setPointWithLinesOnChart = () => {
    const xValue = parseFloat(flowRateValue);
    const yValue = parseFloat(staticPressureValue);

    if (!isNaN(xValue) && !isNaN(yValue)) {
      const newPoint = {
        x: xValue,
        y: yValue,
      };

      const perpendicularLines = [
        { type: 'line', x0: xValue, y0: 0, x1: xValue, y1: yValue, line: { dash: 'dash', color: 'grey' } },
        { type: 'line', x0: 0, y0: yValue, x1: xValue, y1: yValue, line: { dash: 'dash', color: 'grey' } },
      ];

      const maxXValue = Math.max(...fanModels.map(model => Math.max(...fanDataPoints[model].map(point => point.x))));

      const k = yValue / (xValue ** 2);

      const calculatedLinePoints = [];
      for (let v = 0; v <= maxXValue; v += 100) {
        const p = k * v ** 2;
        calculatedLinePoints.push({ x: v, y: p });
      }

      const networkResistanceLine = {
        name: 'Сопротивление сети',
        type: 'scatter',
        mode: 'lines',
        x: calculatedLinePoints.map(point => point.x),
        y: calculatedLinePoints.map(point => point.y),
        line: { dash: 'dash', color: 'red' },
      };

      setNewPoint(newPoint);
      setPerpendicularLines(perpendicularLines);
      setCalculatedLine(networkResistanceLine);
    }
  }

  // Вызывается в по нажатию на "Рассчитать"

  const handleSubmit = (e) => {
    e.preventDefault();

    setAllFanResults([]);
    setCorrectFanResults([]);

    // Используем пришедшие с бэка данные модели и по точкам графика вентиляторов

    fanModels.forEach(async (fanModel) => {
      const fanData = fanDataPoints[fanModel];
      if (fanData) {
        calculateFan(fanData, fanModel);
      } else {
        console.error(`Не найдено данных по точкам графика для: ${fanModel}`);
      }
    });

    setPointWithLinesOnChart();
  };

  // Очистка лога на кнопку "Очистить"

  const handleLogClear = () => {
    setLogMessages([]);
  }

  return (
    <main className="main">
      <Routes>
        <Route path="/info" element={<Info />} />
        <Route path="/" element={
          <Calculator
            plotRef={plotRef}
            displayModeBar={displayModeBar}
            newPoint={newPoint}
            calculatedLine={calculatedLine}
            perpendicularLines={perpendicularLines}
            scale={scale}
            handleSubmit={handleSubmit}
            handleScaleSliderChange={handleScaleSliderChange}
            flowRateValue={flowRateValue}
            flowRateValueChange={flowRateValueChange}
            staticPressureValue={staticPressureValue}
            staticPressureValueChange={staticPressureValueChange}
            view={view}
            setDisplayModeBar={setDisplayModeBar}
            correctFanResults={correctFanResults}
            displayLog={displayLog}
            setDisplayLog={setDisplayLog}
            allFanResults={allFanResults}
            addResultsToHistory={addResultsToHistory}
            switchToResults={switchToResults}
            loading={dataSheetLoading}
            setLoading={setDataSheetLoading}
            projectNameValue={projectNameValue}
            setProjectNameValue={setProjectNameValue}
            projectNameValueChange={projectNameValueChange}
            isProjectNameLocked={isProjectNameLocked}
            setIsProjectNameLocked={setIsProjectNameLocked}
          />
        } />
        <Route path="/results" element={
          <CalculationResults
            resultsHistory={resultsHistory}
            setResultsHistory={setResultsHistory}
            switchToForm={switchToForm}
            dataSheetLoading={dataSheetLoading}
            setDataSheetLoading={setDataSheetLoading}
            commercialLoading={commercialLoading}
            setCommercialLoading={setCommercialLoading}
            projectNameValue={projectNameValue}
            projectNameValueChange={projectNameValueChange}
            setProjectNameValue={setProjectNameValue}
            setIsProjectNameLocked={setIsProjectNameLocked}
          />
        } />
      </Routes>
      {view === 'form' && displayLog &&
        <section className='log'>
          <h2 className='log__title'>
            Лог расчёта:
          </h2>
          <div className='log__wrapper'>
            <button
              className='log__button calculator__button'
              onClick={handleLogClear}
              disabled={logMessages.length === 0}
            >
              Очистить лог
            </button>
            <p className="log__data">
              {logMessages.map((message, index) => (
                <span key={index}>{message}<br /></span>
              ))}
            </p>
          </div>
        </section>
      }
    </main >
  );
}

Main.propTypes = {
  view: PropTypes.string,
  switchToForm: PropTypes.func,
  switchToResults: PropTypes.func,
};

export default Main;
