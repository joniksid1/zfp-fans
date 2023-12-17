import CustomPlot from './custom-plot';
import Settings from './settings';
import PropTypes from 'prop-types';

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
}) {

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
          />
        </div>
        {view === 'settings' ? (
          <Settings
            setDisplayModeBar={setDisplayModeBar}
            handleScaleSliderChange={handleScaleSliderChange}
            scale={scale}
            displayModeBar={displayModeBar}
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
            >
              Рассчитать
            </button>
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
};

export default Calculator;
