import Modal from 'react-modal';
import PropTypes from 'prop-types';

function CustomModal({ isOpen, onRequestClose, fanName }) {

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Выбор опций вентилятора"
      overlayClassName="modal__overlay"
      className="modal"
    >
      <button className='modal__close-button' onClick={onRequestClose}></button>
      <h2 className='modal__header'>{fanName}</h2>
      <button className='modal__button calculator__button' onClick={onRequestClose}>Сохранить(ещё нет)</button>
    </Modal>
  );
}

CustomModal.propTypes = {
  isOpen: PropTypes.bool,
  onRequestClose: PropTypes.func,
  fanName: PropTypes.string,
};

export default CustomModal
