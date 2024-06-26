import PropTypes from 'prop-types';
import { useEffect } from 'react';

function Settings({
  setDisplayModeBar,
  handleScaleSliderChange,
  scale,
  displayModeBar,
  displayAllOnPlot,
  setDisplayAllOnPlot,
  displayLog,
  setDisplayLog,
  displayAllFanResults,
  setDisplayAllFanResults,
}) {

  // Функция для обновления localStorage при изменении настроек
  useEffect(() => {
    localStorage.setItem('displayModeBar', JSON.stringify(displayModeBar));
    localStorage.setItem('displayAllOnPlot', JSON.stringify(displayAllOnPlot));
    localStorage.setItem('displayLog', JSON.stringify(displayLog));
    localStorage.setItem('displayAllFanResults', JSON.stringify(displayAllFanResults));
    localStorage.setItem('scale', JSON.stringify(scale));
  }, [displayModeBar, displayAllOnPlot, displayLog, displayAllFanResults, scale]);

  return (
    <div className="settings">
      <label htmlFor="scaleSlider" className="settings__label">
        Масштаб:
      </label>
      <input
        type="range"
        id="scaleSlider"
        className="styled-slider slider-progress"
        min="0.1"
        max="2"
        step="0.1"
        value={scale}
        onChange={handleScaleSliderChange}
      />
      <label htmlFor="displayModeBarInput" className="settings__label">
        Показать контроллеры графика:
      </label>
      <input
        type="checkbox"
        id="displayModeBarInput"
        className="settings__checkbox"
        checked={displayModeBar}
        onChange={() => setDisplayModeBar(!displayModeBar)}
      />
      <label htmlFor="displayAllOnPlot" className="settings__label">
        Отрисовать графики для всех вентиляторов:
      </label>
      <input
        type="checkbox"
        id="displayAllOnPlot"
        className="settings__checkbox"
        checked={displayAllOnPlot}
        onChange={() => setDisplayAllOnPlot(!displayAllOnPlot)}
      />
      <label htmlFor="displayAllFanResults" className="settings__label">
        Показывать результаты расчёта для всех вентиляторов:
      </label>
      <input
        type="checkbox"
        id="displayAllFanResults"
        className="settings__checkbox"
        checked={displayAllFanResults}
        onChange={() => setDisplayAllFanResults(!displayAllFanResults)}
      />
      <label htmlFor="displayLog" className="settings__label">
        Показать/скрыть лог расчёта:
      </label>
      <input
        type="checkbox"
        id="displayLog"
        className="settings__checkbox"
        checked={displayLog}
        onChange={() => setDisplayLog(!displayLog)}
      />
    </div>
  );
}

Settings.propTypes = {
  handleScaleSliderChange: PropTypes.func,
  scale: PropTypes.number,
  setDisplayModeBar: PropTypes.func,
  displayModeBar: PropTypes.bool,
  displayAllOnPlot: PropTypes.bool,
  setDisplayAllOnPlot: PropTypes.func,
  displayLog: PropTypes.bool,
  setDisplayLog: PropTypes.func,
  displayAllFanResults: PropTypes.bool,
  setDisplayAllFanResults: PropTypes.func,
};

export default Settings;
