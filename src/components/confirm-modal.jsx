import Modal from 'react-modal';
import PropTypes from 'prop-types';

function ConfirmModal({
  isConfirmModalOpen,
  closeModals,
  handleConfirmSubmit,
}) {

  return (
    <Modal
      isOpen={isConfirmModalOpen}
      onRequestClose={closeModals}
      contentLabel="Подтверждение очистки истории подбора"
      overlayClassName="modal__overlay"
      className="modal modal_type_confirm"
    >
      <button className='modal__close-button' onClick={closeModals}></button>
      <h2 className='modal__header'>Вы уверены ?</h2>
      <button className='modal__button' onClick={handleConfirmSubmit}>Да</button>
    </Modal>
  );
}

ConfirmModal.propTypes = {
  isConfirmModalOpen: PropTypes.bool,
  closeModals: PropTypes.func,
  handleConfirmSubmit: PropTypes.func,
};

export default ConfirmModal
