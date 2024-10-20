import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { getDataSheet, getCommercial } from '../utils/api';
import ProjectNameModal from './project-name-modal';
import ConfirmModal from './confirm-modal';
import Preloader from './preloader';
import ErrorModal from './error-modal';
import JSZip from 'jszip';
import { QUANTITY_INPUT_REGEXP } from '../utils/constants';

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
  setCurrentHistoryIndex,
  flowRateValueChange,
  staticPressureValueChange,
}) {
  const [isProjectNameModalOpen, setIsProjectNameModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [editingSystemNameIndex, setEditingSystemNameIndex] = useState(null);
  const [editingQuantityIndex, setEditingQuantityIndex] = useState(null);
  const [newSystemName, setNewSystemName] = useState('');
  const [newQuantity, setNewQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Array(resultsHistory.length).fill(false));
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    setSelectedItems(new Array(resultsHistory.length).fill(false));
    setCurrentHistoryIndex(null);
  }, [resultsHistory, setCurrentHistoryIndex]);

  useEffect(() => {
    if (selectedItems.some(item => item)) {
      const selectedIndex = selectedItems.indexOf(true);
      setCurrentHistoryIndex(selectedIndex);
    } else {
      setCurrentHistoryIndex(null);
    }
  }, [selectedItems, setCurrentHistoryIndex]);

  useEffect(() => {
    if (selectedItems.some(item => item)) {
      const selectedIndex = selectedItems.indexOf(true);
      setCurrentHistoryIndex(selectedIndex);

      // Извлекаем flowRate и staticPressure выбранного элемента
      const selectedSystem = resultsHistory[selectedIndex];
      if (selectedSystem) {
        flowRateValueChange({ target: { value: selectedSystem.flowRateValue.toString() } });
        staticPressureValueChange({ target: { value: selectedSystem.staticPressureValue.toString() } });
      }
    } else {
      setCurrentHistoryIndex(null);
      flowRateValueChange({ target: { value: '' } });
      staticPressureValueChange({ target: { value: '' } });
    }
  }, [selectedItems, setCurrentHistoryIndex, flowRateValueChange, staticPressureValueChange, resultsHistory]);

  // Функция для проверки значения (количество)
  const validateQuantity = (value) => {
    return QUANTITY_INPUT_REGEXP.test(value);
  };

  const handleQuantityInputChange = (e) => {
    const value = e.target.value;

    if (validateQuantity(value) || value === '') {
      setNewQuantity(value);
    }
  }

  // Обработчик сохранения значения при потере фокуса в количестве
  const handleQuantityBlur = (index) => {
    // Если значение пустое, устанавливаем "1"
    const finalQuantity = newQuantity.trim() === '' ? '1' : newQuantity;
    handleQuantityChange(index, finalQuantity);
    setEditingQuantityIndex(null);
  };

  // Открытие модального окна для изменения имени проекта
  const openProjectNameModal = () => {
    setIsProjectNameModalOpen(true);
  };

  // Открытие модального окна подтверждения удаления
  const openDeleteConfirmModal = () => {
    setIsDeleteConfirmModalOpen(true);
  };

  // Закрытие модальных окон
  const closeModals = () => {
    setIsProjectNameModalOpen(false);
    setIsDeleteConfirmModalOpen(false);
  };

  // Подтверждение удаления выбранных элементов
  const handleConfirmDelete = () => {
    handleDeleteSelectedItems();
    closeModals();
  };

  // Обработка нажатия клавиш Enter и ESC (подтверждение изменения название системы)
  const handleSystemNameKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      handleSystemNameChange(index, newSystemName);
      setEditingSystemNameIndex(null);
    }
  };

  // Обработка нажатия клавиш Enter и ESC (подтверждение изменения название системы)
  const handleQuantityKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      handleQuantityChange(index, newQuantity);
      setEditingQuantityIndex(null);
      handleQuantityBlur(index);
    }
  };

  // Сохранение истории результатов в файл JSON
  const handleSaveResultsHistory = () => {
    const data = {
      projectName: projectNameValue,
      resultsHistory: resultsHistory
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

  // Загрузка истории из файла JSON
  const handleLoadResultsHistory = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.projectName && data.resultsHistory) {
          // Обрабатываем элементы истории и устанавливаем значение по умолчанию для quantity
          const updatedResultsHistory = data.resultsHistory.map(item => ({
            ...item,
            quantity: item.quantity !== undefined ? item.quantity : '1' // Устанавливаем "1", если quantity отсутствует
          }));
          const fakeEvent = {
            target: {
              value: data.projectName
            }
          };
          projectNameValueChange(fakeEvent);
          setResultsHistory(updatedResultsHistory);
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

  // Получение названия компонента по ключу
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

  // Загрузка технических данных для выбранных систем
  const downloadDataSheet = async () => {
    try {
      setDataSheetLoading(true);
      const selectedHistoryItems = resultsHistory.filter((historyItem, index) => selectedItems[index]);

      // Функция для добавления индекса к имени файла при совпадении
      const getUniqueFileName = (fileName, existingFileNames) => {
        let baseName = fileName.replace(/\.pdf$/, ''); // Убираем расширение для дальнейших манипуляций
        let extension = '.pdf';
        let counter = 1;
        let uniqueFileName = fileName;

        // Пока файл с таким именем уже существует, добавляем индекс
        while (existingFileNames.includes(uniqueFileName)) {
          uniqueFileName = `${baseName} (${counter})${extension}`;
          counter++;
        }

        return uniqueFileName;
      };

      if (selectedHistoryItems.length === 1) {
        const historyItem = selectedHistoryItems[0];
        historyItem.projectNameValue = projectNameValue;
        const response = await getDataSheet(historyItem);
        const contentType = response.headers?.get('content-type');

        if (contentType && contentType.includes('application/pdf')) {
          const blob = await response.blob();
          const fileURL = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = fileURL;
          a.download = `${historyItem.systemNameValue}.pdf`;
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(fileURL);
        } else {
          const text = await response.text();
          console.log('Текстовые данные', text);
        }
      } else if (selectedHistoryItems.length > 1) {
        const zip = new JSZip();
        const existingFileNames = [];

        await Promise.all(selectedHistoryItems.map(async (historyItem) => {
          try {
            historyItem.projectNameValue = projectNameValue;
            const response = await getDataSheet(historyItem);
            const contentType = response.headers?.get('content-type');

            if (contentType && contentType.includes('application/pdf')) {
              const blob = await response.blob();
              let fileName = `${historyItem.systemNameValue}.pdf`;

              // Проверка на уникальность имени файла
              fileName = getUniqueFileName(fileName, existingFileNames);
              existingFileNames.push(fileName); // Добавляем новое имя в список существующих

              zip.file(fileName, blob);
            } else {
              const text = await response.text();
              console.log('Текстовые данные', text);
            }
          } catch (error) {
            setError(`Ошибка при создании файлов технических листов. ${error}`);
          }
        }));

        zip.generateAsync({ type: 'blob' }).then((content) => {
          const fileURL = URL.createObjectURL(content);
          const a = document.createElement('a');
          a.href = fileURL;
          a.download = 'technical_sheets.zip';
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

  // Загрузка коммерческого предложения для выбранных систем
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

  // Обработка изменения состояния чекбокса
  const handleCheckboxChange = (index) => {
    setSelectedItems((prevState) => {
      const newSelectedItems = [...prevState];
      newSelectedItems[index] = !newSelectedItems[index];
      return newSelectedItems;
    });
  };

  // Выбор всех элементов
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

  // Проверка наличия выбранных элементов
  const isAnyItemSelected = selectedItems.some((item) => item);
  const isSingleItemSelected = selectedItems.filter(item => item).length === 1;

  // Удаление выбранных элементов
  const handleDeleteSelectedItems = () => {
    const updatedResultsHistory = resultsHistory.filter((_, index) => !selectedItems[index]);
    setResultsHistory(updatedResultsHistory);
    setSelectedItems(new Array(updatedResultsHistory.length).fill(false));
  };

  // Начало перетаскивания
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  // Обработка перетаскивания
  const handleDragOver = (index) => {
    if (draggedIndex !== null) {
      const updatedResultsHistory = [...resultsHistory];
      const draggedItem = updatedResultsHistory[draggedIndex];
      updatedResultsHistory.splice(draggedIndex, 1);
      updatedResultsHistory.splice(index, 0, draggedItem);
      setResultsHistory(updatedResultsHistory);
      setDraggedIndex(index);
    }
  };

  // Обработка входа перетаскивания
  const handleDragEnter = (index) => {
    if (draggedIndex !== null) {
      setHoveredIndex(index);
    }
  };

  // Завершение перетаскивания
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setHoveredIndex(null);
  };

  // Определение класса строки таблицы
  const getRowClassName = (index) => {
    if (index === draggedIndex) {
      return 'calculation-results__table-row calculation-results__table-row_dragged';
    }
    if (index === hoveredIndex) {
      return 'calculation-results__table-row calculation-results__table-row_hovered';
    }
    return 'calculation-results__table-row';
  };

  // Обработка изменения названия системы
  const handleSystemNameChange = (index, newName) => {
    const updatedResults = [...resultsHistory];
    updatedResults[index].systemNameValue = newName;
    setResultsHistory(updatedResults);
  };

  // Копирование выбранной системы
  const handleCopySystem = () => {
    const selectedIndex = selectedItems.indexOf(true);
    if (selectedIndex !== -1) {
      const itemToCopy = resultsHistory[selectedIndex];
      const newItem = { ...itemToCopy, systemNameValue: `${itemToCopy.systemNameValue} (копия)` };
      const updatedResults = [...resultsHistory];
      updatedResults.splice(selectedIndex + 1, 0, newItem);
      setResultsHistory(updatedResults);
      setSelectedItems(new Array(updatedResults.length).fill(false));
      setSelectedItems((prev) => {
        const newSelectedItems = [...prev];
        newSelectedItems[selectedIndex + 1] = true;
        return newSelectedItems;
      });
    }
  };

  // Изменение количества

  const handleQuantityChange = (index, newQuantity) => {
    const updatedResults = [...resultsHistory];
    updatedResults[index].quantity = newQuantity;
    setResultsHistory(updatedResults);
  };

  // Рендеринг строки таблицы
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
        <td className="calculation-results__table-data">
          {editingSystemNameIndex === index ? (
            <input
              className="calculation-results__input"
              type="text"
              value={newSystemName}
              onChange={(e) => setNewSystemName(e.target.value)}
              onBlur={() => {
                handleSystemNameChange(index, newSystemName);
                setEditingSystemNameIndex(null);
              }}
              onKeyDown={(e) => handleSystemNameKeyDown(e, index)} // Обработка нажатия клавиши Enter
              autoFocus
            />
          ) : (
            <span onClick={() => {
              setNewSystemName(historyItem.systemNameValue);
              setEditingSystemNameIndex(index);
            }}>
              {historyItem.systemNameValue || 'Нажмите для редактирования'}
            </span>
          )}
        </td>
        <td className="calculation-results__table-data">{historyItem.fanName}</td>
        <td className="calculation-results__table-data">{historyItem.flowRateValue}</td>
        <td className="calculation-results__table-data">{historyItem.staticPressureValue}</td>
        <td className="calculation-results__table-data">
          {editingQuantityIndex === index ? (
            <input
              className="calculation-results__input"
              type="text"
              value={newQuantity}
              onChange={handleQuantityInputChange}
              onKeyDown={(e) => handleQuantityKeyDown(e, index)} // Обработка нажатия клавиши Enter
              onBlur={() => handleQuantityBlur(index)}
              autoFocus
            />
          ) : (
            <span onClick={() => {
              setEditingQuantityIndex(index);
              setNewQuantity(historyItem.quantity || '1');
            }}>
              {historyItem.quantity || '1'}
            </span>
          )}
        </td>
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
            onClick={openProjectNameModal}
          >
          </button>
        </div>
        <div className="calculation-results__wrapper calculation-results__wrapper_type_controls">
          <button
            className='calculation-results__button'
            onClick={switchToForm}
            disabled={isAnyItemSelected}
            title={isAnyItemSelected ? "Невозможно вернуться к расчёту, когда выбрана хотя бы одна система" : ""}
          >
            Вернуться
            <br />
            к расчёту
          </button>
          <button
            className="calculation-results__button"
            disabled={!isSingleItemSelected}
            onClick={switchToForm}
          >
            Пересчитать выбранную
          </button>
          <button
            className="calculation-results__button"
            disabled={!isAnyItemSelected}
            onClick={openDeleteConfirmModal}
          >
            Удалить выбранные
          </button>
          <button
            className="calculation-results__button"
            disabled={!isSingleItemSelected}
            onClick={handleCopySystem}
          >
            Копировать выбранную
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
              <thead className="calculation-results__table-top-row">
                <tr>
                  <th className="calculation-results__table-header">Выбрать</th>
                  <th className="calculation-results__table-header">Система</th>
                  <th className="calculation-results__table-header">Вентилятор</th>
                  <th className="calculation-results__table-header">Поток воздуха, м³/ч</th>
                  <th className="calculation-results__table-header">Давление сети, Па</th>
                  <th className="calculation-results__table-header">Количество</th>
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
      </div>
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
  currentHistoryIndex: PropTypes.number,
  setCurrentHistoryIndex: PropTypes.func,
  flowRateValueChange: PropTypes.func,
  staticPressureValueChange: PropTypes.func,
};

export default CalculationResults;
