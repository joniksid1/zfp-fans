import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { getDataSheet, getCommercial } from '../utils/api';
import ProjectNameModal from './project-name-modal';
import ConfirmModal from './confirm-modal';
import Preloader from './preloader';
import ErrorModal from './error-modal';
import JSZip from 'jszip';
import { v4 as uuid } from 'uuid';

function CalculationResults({
  resultsHistory,
  setResultsHistory,
  switchToForm,
  dataSheetLoading,
  setDataSheetLoading,
  commercialLoading,
  setCommercialLoading,
  projectNameValue,
  projectNameValueChange,
}) {
  const [isProjectNameModalOpen, setIsProjectNameModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Array(resultsHistory.length).fill(false));
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    // Обновляем selectedItems каждый раз, когда изменяется resultsHistory
    // Нужно для правильной простановки значений в checkbox
    setSelectedItems(new Array(resultsHistory.length).fill(false));
  }, [resultsHistory]);

  const openProjecNameModal = () => {
    setIsProjectNameModalOpen(true);
  };

  const openDeleteConfirmModal = () => {
    setIsDeleteConfirmModalOpen(true);
  };

  const closeModals = () => {
    setIsProjectNameModalOpen(false);
    setIsDeleteConfirmModalOpen(false);
  };

// Функция для подтверждения удаления выбранных элементов
  const handleConfirmDelete = () => {
    handleDeleteSelectedItems();
    closeModals();
  };

  // Функция для сохранения resultsHistory в формате JSON
  const handleSaveResultsHistory = () => {
    const data = {
      projectName: projectNameValue,  // Добавляем название проекта
      resultsHistory: resultsHistory  // История результатов
    };
    const dataStr = JSON.stringify(data);
    const fileURL = URL.createObjectURL(new Blob([dataStr], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = fileURL;
    a.download = `${projectNameValue || 'resultsHistory'}.json`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(fileURL);
  };

  // Функция для загрузки resultsHistory из файла JSON
  const handleLoadResultsHistory = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.projectName && data.resultsHistory) {
          // Создаём искусственное событие с целью использовать существующую функцию валидации
          const fakeEvent = {
            target: {
              value: data.projectName
            }
          };
          projectNameValueChange(fakeEvent); // Передаем созданное "событие" в функцию
          setResultsHistory(data.resultsHistory); // Обновляем историю результатов
        } else {
          setError('Формат файла некорректен.');
        }
      } catch (error) {
        setError(`Ошибка при загрузке истории: ${error}`);
      }
    } else {
      setError('Пожалуйста, загрузите файл в формате JSON.');
    }
  };

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
      setDataSheetLoading(true);
      const selectedHistoryItems = resultsHistory.filter((historyItem, index) => selectedItems[index]);

      if (selectedHistoryItems.length === 1) {
        // Если выбран только один элемент, скачиваем его без архивации
        const historyItem = selectedHistoryItems[0];
        historyItem.projectNameValue = projectNameValue;
        const response = await getDataSheet(historyItem);
        const contentType = response.headers?.get('content-type');

        if (contentType && contentType.includes('application/pdf')) {
          const blob = await response.blob();
          const uniqueId = uuid(); // Генерируем уникальный идентификатор
          const fileURL = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = fileURL;
          a.download = `${historyItem.systemNameValue}_${uniqueId}.pdf`; // Добавляем уникальный идентификатор к имени файла
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(fileURL);
        } else {
          const text = await response.text();
          console.log('Текстовые данные', text);
        }
      } else if (selectedHistoryItems.length > 1) {
        // Если выбрано более одного элемента, создаем архив
        const zip = new JSZip();

        await Promise.all(selectedHistoryItems.map(async (historyItem) => {
          try {
            historyItem.projectNameValue = projectNameValue;
            const response = await getDataSheet(historyItem);
            const contentType = response.headers?.get('content-type');

            if (contentType && contentType.includes('application/pdf')) {
              const blob = await response.blob();
              const uniqueId = uuid(); // Генерируем уникальный идентификатор
              const fileName = `${historyItem.systemNameValue}_${uniqueId}.pdf`; // Добавляем уникальный идентификатор к имени файла
              zip.file(fileName, blob); // Добавляем файл в архив
            } else {
              const text = await response.text();
              console.log('Текстовые данные', text);
            }
          } catch (error) {
            setError(`Ошибка при создании файлов технических листов. ${error}`);
          }
        }));

        // Генерируем архив и скачиваем его
        zip.generateAsync({ type: 'blob' }).then((content) => {
          const fileURL = URL.createObjectURL(content);
          const a = document.createElement('a');
          a.href = fileURL;
          a.download = 'technical_sheets.zip'; // Имя архива
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(fileURL);
        });
      } else {
        // Если ни один элемент не выбран, не делаем ничего
      }

      setDataSheetLoading(false);
    } catch (error) {
      setError('Ошибка при создании файлов технических листов', error);
      setDataSheetLoading(false);
    }
  };

  const downloadCommercial = async () => {
    try {
      setCommercialLoading(true);

      const selectedHistoryItems = resultsHistory.filter((historyItem, index) => selectedItems[index]);
      // eslint-disable-next-line no-unused-vars
      const filteredHistory = selectedHistoryItems.map(({ plotImage, ...rest }) => rest);

      const response = await getCommercial(filteredHistory);
      const contentType = response.headers?.get('content-type');

      if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        const blob = await response.blob();
        const fileURL = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = `${projectNameValue}.xlsx`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(fileURL);
      } else {
        const text = await response.text();
        console.log('Текстовые данные', text);
        setError(`Ошибка при создании файла ТКП. ${error}`);
      }
    } catch (error) {
      console.error('Ошибка при создании файла ТКП', error);
      setError(`Ошибка при создании файла ТКП. ${error}`);
    } finally {
      setCommercialLoading(false);
    }
  };

  const handleCheckboxChange = (index) => {
    setSelectedItems((prevState) => {
      const newSelectedItems = [...prevState];
      newSelectedItems[index] = !newSelectedItems[index];
      return newSelectedItems;
    });
  };

  const handleSelectAll = () => {
    const allItemsSelected = selectedItems.every((item) => item);
    const newSelectedItems = [];
    if (allItemsSelected) {
      resultsHistory.forEach((_, index) => {
        newSelectedItems[index] = false;
      });
    } else {
      resultsHistory.forEach((_, index) => {
        newSelectedItems[index] = true;
      });
    }
    setSelectedItems(newSelectedItems);
  };

  const isAnyItemSelected = selectedItems.some((item) => item);

  const handleDeleteSelectedItems = () => {
    const newResultsHistory = resultsHistory.filter((_, index) => !selectedItems[index]);
    setResultsHistory(newResultsHistory);
    setSelectedItems(new Array(newResultsHistory.length).fill(false));
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      const draggedItem = resultsHistory[draggedIndex];
      const updatedResultsHistory = [...resultsHistory];
      updatedResultsHistory.splice(draggedIndex, 1);
      updatedResultsHistory.splice(index, 0, draggedItem);
      setResultsHistory(updatedResultsHistory);
      setDraggedIndex(index);
    }
  };

  // Функция для обновления состояния при наведении курсора
  const handleDragEnter = (index) => {
    if (draggedIndex !== null) {
      setHoveredIndex(index);
    }
  };

  // Функция для обновления состояния при окончании перетаскивания
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setHoveredIndex(null);
  };

  // Функция для изменения стилей в зависимости от состояний draggedIndex и hoveredIndex
  const getRowClassName = (index) => {
    if (index === draggedIndex) {
      return 'calculation-results__table-row calculation-results__table-row_dragged';
    }
    if (index === hoveredIndex) {
      return 'calculation-results__table-row calculation-results__table-row_hovered';
    }
    return 'calculation-results__table-row';
  };

  // Реорганизация элементов при взадимодействии drag and drop
  const rearrangeResultsHistory = (historyItem, index) => {
    return (
      <tr
        className={getRowClassName(index)}
        key={index}
        draggable
        onDragStart={() => handleDragStart(index)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDragOver(index)}
        onDragEnter={() => handleDragEnter(index)}
        onDragEnd={handleDragEnd}
      >
        <td>
          <input
            className="calculation-results__checkbox"
            type="checkbox"
            checked={selectedItems[index] || false}
            onChange={() => handleCheckboxChange(index)}
          />
        </td>
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
    );
  };

  return (
    <>
      <div className="calculation-results">
        <h2 className="calculation-results__header">История подбора</h2>
        <div className="calculation-results__wrapper calculation-results__wrapper_type_project">
          {projectNameValue &&
            <p className="calculation-results__text">{projectNameValue}</p>
          }
          <button
            className='calculation-results__button calculation-results__button_type_project'
            onClick={openProjecNameModal}
          >
          </button>
        </div>
        <div className="calculation-results__wrapper">
          <button
            className="calculation-results__button"
            disabled={!isAnyItemSelected}
            onClick={openDeleteConfirmModal}
          >
            Удалить выбранные
          </button>
          <button className="calculation-results__button" onClick={switchToForm}>
            Вернуться
            <br />
            к расчёту
          </button>
          <button
            className="calculation-results__button"
            onClick={handleSelectAll}
            disabled={resultsHistory.length === 0}
          >
            Выбрать все
          </button>
          <button
            className="calculation-results__button"
            disabled={resultsHistory.length === 0 || !isAnyItemSelected}
            onClick={() => downloadDataSheet()}
          >
            {dataSheetLoading ? 'Загрузка...' : 'Скачать тех. данные'}
          </button>
          <button
            className="calculation-results__button"
            disabled={resultsHistory.length === 0 || !isAnyItemSelected}
            onClick={() => downloadCommercial()}
          >
            {commercialLoading ? 'Загрузка...' : 'Скачать ТКП'}
          </button>
          <button
            className="calculation-results__button"
            onClick={handleSaveResultsHistory}
            disabled={resultsHistory.length === 0}
          >
            Сохранить историю
          </button>
          <input
            type="file"
            id="file-input"
            style={{ display: 'none' }}
            onChange={handleLoadResultsHistory}
          />
          <label htmlFor="file-input" className="calculation-results__button calculation-results__button_type_label">
            Загрузить историю
          </label>
        </div>
        {resultsHistory.length > 0 ? (
          <div className="calculation-results__history">
            <table className="calculation-results__table">
              <thead>
                <tr>
                  <th className="calculation-results__table-header">Выбрать</th>
                  <th className="calculation-results__table-header">Система</th>
                  <th className="calculation-results__table-header">Вентилятор</th>
                  <th className="calculation-results__table-header">Поток воздуха, м³/ч</th>
                  <th className="calculation-results__table-header">Давление сети, Па</th>
                  <th className="calculation-results__table-header">Подобранные опции</th>
                </tr>
              </thead>
              <tbody>
                {resultsHistory.map((historyItem, index) => rearrangeResultsHistory(historyItem, index))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="calculation-results__text calculation-results__text_type_bottom">Рассчитанных вентиляторов нет, начните расчёт</p>
        )}
      </div >
      <ProjectNameModal
        isProjectNameModalOpen={isProjectNameModalOpen}
        closeModals={closeModals}
        projectNameValue={projectNameValue}
        projectNameValueChange={projectNameValueChange}
      />
      <ConfirmModal
        isConfirmModalOpen={isDeleteConfirmModalOpen}
        closeModals={closeModals}
        handleConfirmSubmit={handleConfirmDelete}
      />
      {commercialLoading && <Preloader />}
      {dataSheetLoading && <Preloader />}
      {error && <ErrorModal error={error} onClose={() => setError(null)} />}
    </>
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
  dataSheetLoading: PropTypes.bool,
  setDataSheetLoading: PropTypes.func,
  commercialLoading: PropTypes.bool,
  setCommercialLoading: PropTypes.func,
  projectNameValue: PropTypes.string,
  projectNameValueChange: PropTypes.func,
};

export default CalculationResults;
