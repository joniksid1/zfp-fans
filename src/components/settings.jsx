import PropTypes from 'prop-types';

function Settings({ setDisplayModeBar, handleScaleSliderChange, scale, displayModeBar }) {
  return (
    <div className="settings">
      <label htmlFor="scaleInput" className="calculator__label">
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
      <label htmlFor="scaleInput" className="calculator__label">
        Показать настройки графика:
      </label>
      <input
        type="checkbox"
        id="displayModeBarInput"
        className="calculator__checkbox"
        checked={displayModeBar}
        onChange={() => setDisplayModeBar(!displayModeBar)}
      />
    </div>
  );
}

Settings.propTypes = {
  handleScaleSliderChange: PropTypes.func,
  scale: PropTypes.number,
  setDisplayModeBar: PropTypes.func,
  displayModeBar: PropTypes.bool,
};

export default Settings;
