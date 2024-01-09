import PropTypes from 'prop-types';

function CalculationResults({
  resultsHistory,
}) {
  const getComponentName = (option) => {
    const componentNames = {
      selectFlatRoofSocket: 'Монтажный стакан для плоской кровли',
      selectFlatRoofSocketSilencer: 'Монтажный стакан для плоской кровли с шумоглушением',
      selectSlantRoofSocketSilencer: 'Монтажный стакан для скатной кровли с шумоглушением',
      selectBackDraftDamper: 'Обратный клапан',
      selectFlexibleConnector: 'Гибкая вставка',
      selectFlange: 'Фланец',
      selectRegulator: 'Регулятор скорости',
    };

    return componentNames[option] || option;
  };

  return (
    <div className="calculation-results">
      <h2 className="calculation-results__header">История подбора</h2>
      {resultsHistory.length > 0 ? (
        <div className="calculation-results__history">
          <table className="calculation-results__table">
            <thead>
              <tr>
                <th className="calculation-results__table-header">Система</th>
                <th className="calculation-results__table-header">Вентилятор</th>
                <th className="calculation-results__table-header">Поток воздуха, м³/ч</th>
                <th className="calculation-results__table-header">Давление сети, Па</th>
                <th className="calculation-results__table-header">Выбранные опции</th>
              </tr>
            </thead>
            <tbody>
              {resultsHistory.map((historyItem, index) => (
                <tr className="calculation-results__table-row" key={index}>
                  <td className="calculation-results__table-data">{historyItem.systemNameValue}</td>
                  <td className="calculation-results__table-data">{historyItem.fanName}</td>
                  <td className="calculation-results__table-data">{historyItem.flowRateValue}</td>
                  <td className="calculation-results__table-data">{historyItem.staticPressureValue}</td>
                  <td className="calculation-results__table-data">
                    <ul className="calculation-results__options-list">
                      {Object.entries(historyItem.selectedOptions).map(([option, value]) => (
                        value && (
                          <li key={option} className="calculation-results__options-item">
                            {getComponentName(option)}
                          </li>
                        )
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="calculation-results__text">Рассчитанных вентиляторов нет, начните расчёт</p>
      )}
    </div>
  );
}

CalculationResults.propTypes = {
  resultsHistory: PropTypes.arrayOf(
    PropTypes.shape({
      systemNameValue: PropTypes.string,
      fanName: PropTypes.string,
      flowRateValue: PropTypes.string,
      staticPressureValue: PropTypes.string,
      selectedOptions: PropTypes.object,
    })
  ),
};

export default CalculationResults;
