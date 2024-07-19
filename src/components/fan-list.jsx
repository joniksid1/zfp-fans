import { useState } from 'react';
import PropTypes from 'prop-types';
import FanDataModal from './fan-data-modal';
import zfrImage from '../images/zfr.png';

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
  loading,
  setLoading,
  projectNameValue,
  setProjectNameValue,
  projectNameValueChange,
  isProjectNameLocked,
  setIsProjectNameLocked,
  currentHistoryIndex,
}) {
  const [workingFlowRate, setWorkingFlowRate] = useState(null);
  const [workingStaticPressure, setWorkingStaticPressure] = useState(null);

  const handleFanClick = (fanName, flowRate, staticPressure) => {
    setSelectedFan(fanName);
    setWorkingFlowRate(flowRate);
    setWorkingStaticPressure(staticPressure);
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
              onClick={() => handleFanClick(result.fanName, result.workingFlowRate, result.workingStaticPressure)}
              onMouseEnter={() => handleFanHover(result.fanName)}
              onMouseLeave={() => handleFanHover(null)}
            >
              <img src={zfrImage} alt="Изображение крышного вентилятора" className="fan-list__image" />
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
              onClick={() => handleFanClick(result.fanName,  result.workingFlowRate, result.workingStaticPressure)}
              onMouseEnter={() => handleFanHover(result.fanName)}
              onMouseLeave={() => handleFanHover(null)}
            >
              <img src={zfrImage} alt="Изображение крышного вентилятора" className="fan-list__image" />
              <div className="fan-list__wrapper">
                <span className="fan-list__fan-name">{result.fanName}</span>
                <span className="fan-list__result">{`+ ${result.flowDeviation}%`}</span>
              </div>
            </li>
          ))
        }
      </ul>
      <FanDataModal
        isOpen={selectedFan !== null || undefined}
        closeModalWindow={closeModalWindow}
        fanName={selectedFan}
        flowRateValue={flowRateValue}
        staticPressureValue={staticPressureValue}
        addResultsToHistory={addResultsToHistory}
        switchToResults={switchToResults}
        generatePlotImage={generatePlotImage}
        loading={loading}
        setLoading={setLoading}
        projectNameValue={projectNameValue}
        setProjectNameValue={setProjectNameValue}
        projectNameValueChange={projectNameValueChange}
        isProjectNameLocked={isProjectNameLocked}
        setIsProjectNameLocked={setIsProjectNameLocked}
        workingFlowRate={workingFlowRate}
        workingStaticPressure={workingStaticPressure}
        currentHistoryIndex={currentHistoryIndex}
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
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  projectNameValue: PropTypes.string,
  setProjectNameValue: PropTypes.func,
  projectNameValueChange: PropTypes.func,
  isProjectNameLocked: PropTypes.bool,
  setIsProjectNameLocked: PropTypes.func,
  currentHistoryIndex: PropTypes.number,
};

export default FanList;
