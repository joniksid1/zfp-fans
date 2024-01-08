import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

function CustomModal({ isOpen, onRequestClose, fanName }) {
  const [displayAllSockets, setDisplayAllSockets] = useState(false);
  const [selectFlatRoofSocket, setSelectFlatRoofSocket] = useState(false);
  const [selectPitchedRoofSocket, setSelectPitchedRoofSocket] = useState(false);
  const [selectSlantRoofSocketSilencer, setSelectSlantRoofSocketSilencer] = useState(false);
  const [selectBackDraftDamper, setSelectBackDraftDamper] = useState(false);
  const [selectFlexibleConnector, setSelectFlexibleConnector] = useState(false);
  const [selectFlange, setSelectFlange] = useState(false);
  const [selectRegulator, setSelectRegulator] = useState(false);

  // Сброс состояний инпутов при закрытии модального окна

  const resetState = () => {
    setDisplayAllSockets(false);
    setSelectFlatRoofSocket(false);
    setSelectPitchedRoofSocket(false);
    setSelectSlantRoofSocketSilencer(false);
    setSelectBackDraftDamper(false);
    setSelectFlexibleConnector(false);
    setSelectFlange(false);
    setSelectRegulator(false);
  };

  const handleCloseModal = () => {
    // Вызываем сброс состояния при закрытии модального окна
    resetState();
    onRequestClose();
  };

  useEffect(() => {
    console.log('Состояние чекбокса монтажного стакана для плоской кровли:', selectFlatRoofSocket);
    console.log('Состояние чекбокса монтажного стакана для скатной кровли:', selectPitchedRoofSocket);
  }, [selectFlatRoofSocket, selectPitchedRoofSocket]);

  const handleSocketsDisplay = () => {
    setDisplayAllSockets(!displayAllSockets);

    // Сбрасываем вложенные инпуты, если скрывается меню выбора монтажных стаканов
    setSelectFlatRoofSocket(false);
    setSelectPitchedRoofSocket(false);
    setSelectSlantRoofSocketSilencer(false);
  };

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
      <input
        type="checkbox"
        id="selectSockets"
        className="modal__checkbox"
        checked={displayAllSockets}
        onChange={handleSocketsDisplay}
      />
      <label htmlFor="selectSockets" className="modal__label">
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
            />
            <label htmlFor="selectFlatRoofSocket" className="modal__label">
              Для плоской кровли
            </label>
            <input
              type="checkbox"
              id="selectPitchedRoofSocket"
              className="modal__checkbox"
              checked={selectPitchedRoofSocket}
              onChange={() => setSelectPitchedRoofSocket(!selectPitchedRoofSocket)}
            />
            <label htmlFor="selectPitchedRoofSocket" className="modal__label">
              Для наклонной кровли
            </label>
            <input
              type="checkbox"
              id="selectSlantRoofSocketSilencer"
              className="modal__checkbox"
              checked={selectSlantRoofSocketSilencer}
              onChange={() => setSelectSlantRoofSocketSilencer(!selectSlantRoofSocketSilencer)}
            />
            <label htmlFor="selectSlantRoofSocketSilencer" className="modal__label">
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
      />
      <label htmlFor="selectBackDraftDamper" className="modal__label">
        Обратный клапан
      </label>
      <input
        type="checkbox"
        id="selectFlexibleConnector"
        className="modal__checkbox"
        checked={selectFlexibleConnector}
        onChange={() => setSelectFlexibleConnector(!selectFlexibleConnector)}
      />
      <label htmlFor="selectFlexibleConnector" className="modal__label">
        Гибкая вставка
      </label>
      <input
        type="checkbox"
        id="selectFlange"
        className="modal__checkbox"
        checked={selectFlange}
        onChange={() => setSelectFlange(!selectFlange)}
      />
      <label htmlFor="selectFlange" className="modal__label">
        Фланец
      </label>
      <input
        type="checkbox"
        id="selectRegulator"
        className="modal__checkbox"
        checked={selectRegulator}
        onChange={() => setSelectRegulator(!selectRegulator)}
      />
      <label htmlFor="selectRegulator" className="modal__label">
        Регулятор скорости
      </label>
      <button className='modal__button' onClick={onRequestClose}>Сохранить(ещё нет)</button>
    </Modal>
  );
}

CustomModal.propTypes = {
  isOpen: PropTypes.bool,
  onRequestClose: PropTypes.func,
  fanName: PropTypes.string,
};

export default CustomModal
