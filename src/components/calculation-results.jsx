import PropTypes from 'prop-types';

function CalculationResults({
  resultSystemName,
  resultFanName,
  resultAirFlow,
  resultPressureValue,
  selectedOptions
}) {
  return (
    <div className="calculation-results">
      <h2 className="calculation-results__header">Результаты расчета</h2>
      {
        resultFanName && (
          <p className="calculation-results__text">
            Вентилятор: {resultFanName}
          </p>
        )
      }
      {
        resultSystemName && (
          <p className="calculation-results__text">
            Название системы: {resultSystemName}
          </p>
        )
      }
      {
        resultAirFlow.length > 0 && (
          <p className="calculation-results__text">
            Поток воздуха, м3/ч: {resultAirFlow}
          </p>
        )
      }
      {
        resultPressureValue.length > 0 && (
          <p className="calculation-results__text">
            Давление сети, Па: {resultPressureValue}
          </p>
        )
      }
      {selectedOptions && Object.keys(selectedOptions).length > 0 && (
        <div className="calculation-results__options">
          <p className="calculation-results__text">
            Выбранные опции:
          </p>
          <ul>
            {Object.entries(selectedOptions).map(([option, value]) => (
              <li key={option}>
                {option}: {value.toString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

CalculationResults.propTypes = {
  resultSystemName: PropTypes.string,
  resultFanName: PropTypes.string,
  resultAirFlow: PropTypes.string,
  resultPressureValue: PropTypes.string,
  selectedOptions: PropTypes.object,
};

export default CalculationResults;
