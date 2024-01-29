import PropTypes from 'prop-types';
import { getDataSheet } from '../utils/api';

function CalculationResults({
  resultsHistory,
  setResultsHistory,
  switchToForm,
  loading,
  setLoading,
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

  const downloadDataSheet = async () => {
    try {
      setLoading(true);

      const promises = resultsHistory.map(async (historyItem) => {
        try {
          const response = await getDataSheet(historyItem);

          const contentType = response.headers?.get('content-type');

          if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
            // Преобразовываем ответ в Blob
            const blob = await response.blob();

            // Создаем ссылку и автоматически запускаем скачивание
            const fileURL = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = fileURL;
            a.download = `${historyItem.systemNameValue}.xlsx`;
            document.body.appendChild(a);
            a.click();

            // Очищаем ссылку после скачивания
            URL.revokeObjectURL(fileURL);
          } else {
            // Если тип контента не xlsx, обрабатываем его как текст
            const text = await response.text();
            console.log('Текстовые данные', text);
          }
        } catch (error) {
          console.error('Ошибка при создании файла', error);
        }
      });

      // Ждем завершения всех запросов
      await Promise.all(promises);
      console.log('Все файлы успешно созданы');
    } catch (error) {
      console.error('Ошибка при создании файлов', error);
    } finally {
      setLoading(false);
    }
  };


  const clearHistory = () => {
    setResultsHistory([]);
  };

  return (
    <div className="calculation-results">
      <h2 className="calculation-results__header">История подбора</h2>
      <div className="calculation-results__wrapper">
        <button
          className="calculation-results__button"
          onClick={clearHistory}
          disabled={resultsHistory.length === 0}
        >
          Очистить историю
        </button>
        <button className="calculation-results__button" onClick={switchToForm}>
          Вернуться
          <br />
          к расчёту
        </button>
        <button
          className="calculation-results__button"
          disabled={resultsHistory.length === 0}
          onClick={() => downloadDataSheet()}
        >
          {loading ? 'Загрузка...' : 'Скачать тех. данные'}
        </button>
      </div>
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
  setResultsHistory: PropTypes.func,
  switchToForm: PropTypes.func,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
};

export default CalculationResults;
