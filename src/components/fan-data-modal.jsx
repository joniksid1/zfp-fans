import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { NAME_VALIDATION_REGEXP } from '../utils/constants';

function FanDataModal({
  isOpen,
  closeModalWindow,
  fanName,
  flowRateValue,
  staticPressureValue,
  addResultsToHistory,
  switchToResults,
  generatePlotImage,
  loading,
  setLoading,
  projectNameValue,
  projectNameValueChange,
  isProjectNameLocked,
  setIsProjectNameLocked,
}) {
  const [systemNameValue, setSystemNameValue] = useState('');
  const [displayAllSockets, setDisplayAllSockets] = useState(false);
  const [selectFlatRoofSocket, setSelectFlatRoofSocket] = useState(false);
  const [selectFlatRoofSocketSilencer, setSelectFlatRoofSocketSilencer] = useState(false);
  const [selectSlantRoofSocketSilencer, setSelectSlantRoofSocketSilencer] = useState(false);
  const [selectBackDraftDamper, setSelectBackDraftDamper] = useState(false);
  const [selectFlexibleConnector, setSelectFlexibleConnector] = useState(false);
  const [selectFlange, setSelectFlange] = useState(false);
  const [selectRegulator, setSelectRegulator] = useState(false);

  // Разблокирование project name в модальном окне при очистке значения projectNameValue
  useEffect(() => {
    if (!projectNameValue) {
      setIsProjectNameLocked((prevIsLocked) => {
        // Изменяем состояние только если оно было заблокировано (true)
        return prevIsLocked ? false : prevIsLocked;
      });
    }
  }, [projectNameValue, setIsProjectNameLocked]);

  const systemNameValueChange = (e) => {
    if (NAME_VALIDATION_REGEXP.test(e.target.value)) {
      setSystemNameValue(e.target.value);
    }
  };

  // Сброс состояний инпутов при закрытии модального окна

  const resetState = () => {
    setDisplayAllSockets(false);
    setSelectFlatRoofSocket(false);
    setSelectFlatRoofSocketSilencer(false);
    setSelectSlantRoofSocketSilencer(false);
    setSelectBackDraftDamper(false);
    setSelectFlexibleConnector(false);
    setSelectFlange(false);
    setSelectRegulator(false);
  };

  const handleCloseModal = () => {
    resetState();
    setSystemNameValue('');

    // Закрываем модальное окно
    closeModalWindow();
  };

  const handleSocketsDisplay = () => {
    setDisplayAllSockets(!displayAllSockets);

    // Сбрасываем вложенные инпуты, если скрывается меню выбора монтажных стаканов

    setSelectFlatRoofSocket(false);
    setSelectFlatRoofSocketSilencer(false);
    setSelectSlantRoofSocketSilencer(false);
  };

  const handleModalConfirm = async () => {
    try {
      setLoading(true);

      setIsProjectNameLocked(true);

      const plotImageResult = await generatePlotImage();

      addResultsToHistory({
        systemNameValue,
        fanName,
        flowRateValue,
        staticPressureValue,
        selectedOptions: {
          selectFlatRoofSocket,
          selectFlatRoofSocketSilencer,
          selectSlantRoofSocketSilencer,
          selectBackDraftDamper,
          selectFlexibleConnector,
          selectFlange,
          selectRegulator,
        },
        plotImage: plotImageResult,
      });

      handleCloseModal();
      switchToResults();
    } catch (error) {
      console.error("Error generating plot image:", error);
      // Обработка ошибок при генерации изображения
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel="Выбор опций вентилятора"
      overlayClassName="modal__overlay"
      className="modal"
    >
      <button className='modal__close-button' onClick={handleCloseModal}></button>
      <h2 className='modal__header'>{fanName}</h2>
      <label htmlFor="projectName" className="modal__label modal__label_type_name">
        Название проекта:
      </label>
      <input
        name="projectName"
        type="text"
        id="projectName"
        className="modal__input"
        required=""
        maxLength={20}
        value={projectNameValue}
        onChange={projectNameValueChange}
        disabled={isProjectNameLocked}
      />
      <button
        className='modal__edit-button'
        onClick={() => setIsProjectNameLocked(!isProjectNameLocked)}
      >
      </button>
      <label htmlFor="systemName" className="modal__label modal__label_type_name">
        Название системы:
      </label>
      <input
        name="systemName"
        type="text"
        id="systemName"
        className="modal__input"
        required=""
        maxLength={20}
        value={systemNameValue ?? ''}
        onChange={systemNameValueChange}
      />
      <input
        type="checkbox"
        id="selectSockets"
        className="modal__checkbox"
        checked={displayAllSockets}
        onChange={handleSocketsDisplay}
        disabled={fanName === "ZFR 1,9-2E" || fanName === "ZFR 2,2-2E"}
      />
      <label htmlFor="selectSockets" className="modal__label modal__label_type_option">
        Монтажный стакан:
      </label>
      {
        displayAllSockets
          ?
          <div className='modal__mounting-cups-wrapper'>
            <input
              type="checkbox"
              id="selectFlatRoofSocket"
              className="modal__checkbox"
              checked={selectFlatRoofSocket}
              onChange={() => setSelectFlatRoofSocket(!selectFlatRoofSocket)}
              disabled={fanName === "ZFR 1,9-2E" || fanName === "ZFR 2,2-2E"}
              />
            <label htmlFor="selectFlatRoofSocket" className="modal__label modal__label_type_option">
              Для плоской кровли
            </label>
            <input
              type="checkbox"
              id="selectPitchedRoofSocket"
              className="modal__checkbox"
              checked={selectFlatRoofSocketSilencer}
              onChange={() => setSelectFlatRoofSocketSilencer(!selectFlatRoofSocketSilencer)}
              disabled={fanName === "ZFR 1,9-2E" || fanName === "ZFR 2,2-2E"}
              />
            <label htmlFor="selectPitchedRoofSocket" className="modal__label modal__label_type_option">
              Для плоской кровли с шумоглушением
            </label>
            <input
              type="checkbox"
              id="selectSlantRoofSocketSilencer"
              className="modal__checkbox"
              checked={selectSlantRoofSocketSilencer}
              onChange={() => setSelectSlantRoofSocketSilencer(!selectSlantRoofSocketSilencer)}
              disabled={fanName === "ZFR 1,9-2E" || fanName === "ZFR 2,2-2E"}
              />
            <label htmlFor="selectSlantRoofSocketSilencer" className="modal__label modal__label_type_option">
              Для наклонной кровли с шумоглушением
            </label>
          </div>
          :
          ''
      }
      <input
        type="checkbox"
        id="selectBackDraftDamper"
        className="modal__checkbox"
        checked={selectBackDraftDamper}
        onChange={() => setSelectBackDraftDamper(!selectBackDraftDamper)}
        disabled={fanName === "ZFR 1,9-2E" || fanName === "ZFR 2,2-2E"}
      />
      <label htmlFor="selectBackDraftDamper" className="modal__label modal__label_type_option">
        Обратный клапан
      </label>
      <input
        type="checkbox"
        id="selectFlexibleConnector"
        className="modal__checkbox"
        checked={selectFlexibleConnector}
        onChange={() => setSelectFlexibleConnector(!selectFlexibleConnector)}
        disabled={fanName === "ZFR 1,9-2E" || fanName === "ZFR 2,2-2E"}
      />
      <label htmlFor="selectFlexibleConnector" className="modal__label modal__label_type_option">
        Гибкая вставка
      </label>
      <input
        type="checkbox"
        id="selectFlange"
        className="modal__checkbox"
        checked={selectFlange}
        onChange={() => setSelectFlange(!selectFlange)}
        disabled={fanName === "ZFR 1,9-2E" || fanName === "ZFR 2,2-2E"}
      />
      <label htmlFor="selectFlange" className="modal__label modal__label_type_option">
        Фланец
      </label>
      <input
        type="checkbox"
        id="selectRegulator"
        className="modal__checkbox"
        checked={selectRegulator}
        onChange={() => setSelectRegulator(!selectRegulator)}
      />
      <label htmlFor="selectRegulator" className="modal__label modal__label_type_option">
        Регулятор скорости
      </label>
      <button className='modal__button' onClick={handleModalConfirm}>{loading ? 'Сохранение...' : 'Сохранить'}</button>
    </Modal>
  );
}

FanDataModal.propTypes = {
  isOpen: PropTypes.bool,
  closeModalWindow: PropTypes.func,
  fanName: PropTypes.string,
  flowRateValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  staticPressureValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  addResultsToHistory: PropTypes.func,
  switchToResults: PropTypes.func,
  generatePlotImage: PropTypes.func,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  projectNameValue: PropTypes.string,
  projectNameValueChange: PropTypes.func,
  isProjectNameLocked: PropTypes.bool,
  setIsProjectNameLocked: PropTypes.func,
};

export default FanDataModal
