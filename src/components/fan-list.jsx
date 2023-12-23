import PropTypes from 'prop-types';
import CustomModal from './custom-modal';

function FanList({ fanResults, selectedFan, setSelectedFan, setHoveredFan }) {

  const handleFanClick = (fanName) => {
    setSelectedFan(fanName);
  };

  const handleCloseModal = () => {
    setSelectedFan(null);
  };

  const handleFanHover = (fanName) => {
    setHoveredFan(fanName);
  };

  return (
    <div className="fan-list">
      <ul className="fan-list__items">
        {fanResults.map((result, index) => (
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
              <span className="fan-list__result">{` + ${result.flowDeviation}%`}</span>
            </div>
          </li>
        ))}
      </ul>
      <CustomModal isOpen={selectedFan !== null || undefined} onRequestClose={handleCloseModal} fanName={selectedFan} />
    </div>
  );
}

FanList.propTypes = {
  fanResults: PropTypes.arrayOf(
    PropTypes.shape({
      fanName: PropTypes.string.isRequired,
      result: PropTypes.string.isRequired,
    })
  ),
  setSelectedFan: PropTypes.func,
  selectedFan: PropTypes.string,
  setHoveredFan: PropTypes.func,
};

export default FanList;
