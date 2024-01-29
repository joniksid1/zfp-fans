import CustomPlot from './custom-plot';
import Settings from './settings';
import PropTypes from 'prop-types';
import FanList from './fan-list';
import { useState } from 'react';
import html2canvas from 'html2canvas';

function Calculator({
  plotRef,
  displayModeBar,
  newPoint,
  calculatedLine,
  perpendicularLines,
  scale,
  handleSubmit,
  handleScaleSliderChange,
  flowRateValue,
  flowRateValueChange,
  staticPressureValue,
  staticPressureValueChange,
  view,
  setDisplayModeBar,
  correctFanResults,
  displayLog,
  setDisplayLog,
  allFanResults,
  addResultsToHistory,
  switchToResults,
  loading,
  setLoading,
}) {

  // Выбор вентилятора при наведении и по клику. Наведение setHoveredFan используется для изменение цвета линии графика соответствующего вентилятора.
  // Клик на элемент списка FanList использует setSelectedFany

  const [selectedFan, setSelectedFan] = useState(null);
  const [hoveredFan, setHoveredFan] = useState(null);
  const [displayAllOnPlot, setDisplayAllOnPlot] = useState(false);
  const [displayAllFanResults, setDisplayAllFanResults] = useState(false);

  // Создаем изображение из компонента
  const generatePlotImage = async () => {
    const plotElement = document.querySelector('.chart');
    const canvas = await html2canvas(plotElement);
    return canvas.toDataURL('image/png');
  };

  return (
    <section className="calculator">
      <div className="calculator__wrapper">
        <div className='calculator__chart' ref={plotRef}>
          <CustomPlot
            displayModeBar={displayModeBar}
            newPoint={newPoint}
            calculatedLine={calculatedLine}
            perpendicularLines={perpendicularLines}
            scale={scale}
            selectedFan={selectedFan}
            hoveredFan={hoveredFan}
            correctFanResults={correctFanResults}
            displayAllOnPlot={displayAllOnPlot}
          />
        </div>
        {/* view переключается по нажатию на опции контекстного меню "бургера" */}
        {view === 'settings' ? (
          <Settings
            setDisplayModeBar={setDisplayModeBar}
            handleScaleSliderChange={handleScaleSliderChange}
            scale={scale}
            displayModeBar={displayModeBar}
            displayAllOnPlot={displayAllOnPlot}
            setDisplayAllOnPlot={setDisplayAllOnPlot}
            displayLog={displayLog}
            setDisplayLog={setDisplayLog}
            displayAllFanResults={displayAllFanResults}
            setDisplayAllFanResults={setDisplayAllFanResults}
          />
        ) : (
          <form
            name='calculator'
            className="calculator__form"
            noValidate
            onSubmit={handleSubmit}
          >
            <label htmlFor="flowRateInput" className="calculator__label">
              Поток воздуха (м³/ч):
            </label>
            <input
              name="flowRate"
              type="text"
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
              type="text"
              id="staticPressureInput"
              className="calculator__input calculator__input_type_static-pressure"
              required=""
              value={staticPressureValue ?? ''}
              onChange={staticPressureValueChange}
            />
            <button
              className='calculator__button'
              type="submit"
              disabled={flowRateValue.length === 0 || staticPressureValue.length === 0}
            >
              Рассчитать
            </button>
            {allFanResults.length > 0 && (
              <FanList
                correctFanResults={correctFanResults}
                allFanResults={allFanResults}
                selectedFan={selectedFan}
                setSelectedFan={setSelectedFan}
                setHoveredFan={setHoveredFan}
                displayAllFanResults={displayAllFanResults}
                flowRateValue={flowRateValue}
                staticPressureValue={staticPressureValue}
                addResultsToHistory={addResultsToHistory}
                switchToResults={switchToResults}
                generatePlotImage={generatePlotImage}
                loading={loading}
                setLoading={setLoading}
              />
            )}
          </form>
        )}
      </div>
    </section>
  )
}

Calculator.propTypes = {
  plotRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  displayModeBar: PropTypes.bool,
  newPoint: PropTypes.object,
  calculatedLine: PropTypes.object,
  perpendicularLines: PropTypes.array,
  scale: PropTypes.number,
  handleSubmit: PropTypes.func,
  handleScaleSliderChange: PropTypes.func,
  flowRateValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  flowRateValueChange: PropTypes.func,
  staticPressureValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  staticPressureValueChange: PropTypes.func,
  view: PropTypes.string,
  setDisplayModeBar: PropTypes.func,
  correctFanResults: PropTypes.array,
  allFanResults: PropTypes.array,
  displayLog: PropTypes.bool,
  setDisplayLog: PropTypes.func,
  addResultsToHistory: PropTypes.func,
  switchToResults: PropTypes.func,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
};

export default Calculator;
