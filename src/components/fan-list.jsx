import PropTypes from 'prop-types';
import CustomModal from './custom-modal';

function FanList({
  correctFanResults,
  allFanResults,
  selectedFan,
  setSelectedFan,
  setHoveredFan,
  displayAllFanResults,
  flowRateValue,
  staticPressureValue,
  addResultsToHistory,
  switchToResults,
  generatePlotImage,
}) {

  const handleFanClick = (fanName) => {
    setSelectedFan(fanName);
  };

  const closeModalWindow = () => {
    setSelectedFan(null);
  };

  const handleFanHover = (fanName) => {
    setHoveredFan(fanName);
  };

  return (
    <div className="fan-list">
      <ul className="fan-list__items">
        {displayAllFanResults ?
          allFanResults.map((result, index) => (
            <li
              key={index}
              className={`fan-list__item ${selectedFan === result.fanName ? 'selected' : ''}`}
              onClick={() => handleFanClick(result.fanName)}
              onMouseEnter={() => handleFanHover(result.fanName)}
              onMouseLeave={() => handleFanHover(null)}
            >
              <img src='../images/zfr.png' alt="Изображение крышного вентилятора" className="fan-list__image" />
              <div className="fan-list__wrapper">
                <span className="fan-list__fan-name">{result.fanName}</span>
                <span className="fan-list__result">{`${result.flowDeviation}%`}</span>
              </div>
            </li>
          ))
          :
          correctFanResults.map((result, index) => (
            <li
              key={index}
              className={`fan-list__item ${selectedFan === result.fanName ? 'selected' : ''}`}
              onClick={() => handleFanClick(result.fanName)}
              onMouseEnter={() => handleFanHover(result.fanName)}
              onMouseLeave={() => handleFanHover(null)}
            >
              <img src='../images/zfr.png' alt="Изображение крышного вентилятора" className="fan-list__image" />
              <div className="fan-list__wrapper">
                <span className="fan-list__fan-name">{result.fanName}</span>
                <span className="fan-list__result">{`+ ${result.flowDeviation}%`}</span>
              </div>
            </li>
          ))
        }
      </ul>
      <CustomModal
        isOpen={selectedFan !== null || undefined}
        closeModalWindow={closeModalWindow}
        fanName={selectedFan}
        flowRateValue={flowRateValue}
        staticPressureValue={staticPressureValue}
        addResultsToHistory={addResultsToHistory}
        switchToResults={switchToResults}
        generatePlotImage={generatePlotImage}
      />
    </div>
  );
}

FanList.propTypes = {
  correctFanResults: PropTypes.arrayOf(
    PropTypes.shape({
      fanName: PropTypes.string.isRequired,
      result: PropTypes.string.isRequired,
    })
  ),
  allFanResults: PropTypes.arrayOf(
    PropTypes.shape({
      fanName: PropTypes.string.isRequired,
      result: PropTypes.string.isRequired,
    })
  ),
  setSelectedFan: PropTypes.func,
  selectedFan: PropTypes.string,
  setHoveredFan: PropTypes.func,
  displayAllFanResults: PropTypes.bool,
  flowRateValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  staticPressureValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  addResultsToHistory: PropTypes.func,
  switchToResults: PropTypes.func,
  generatePlotImage: PropTypes.func,
};

export default FanList;
