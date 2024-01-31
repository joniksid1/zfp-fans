import Modal from 'react-modal';
import PropTypes from 'prop-types';

function ProjectNameModal({
  isModalOpen,
  closeModal,
  projectNameValue,
  projectNameValueChange,
}) {

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Выбор опций вентилятора"
      overlayClassName="modal__overlay"
      className="modal"
    >
      <button className='modal__close-button' onClick={closeModal}></button>
      <h2 className='modal__header'>Название проекта</h2>
      <input
        name="projectName"
        type="text"
        id="projectName"
        className="modal__input"
        required=""
        maxLength={20}
        value={projectNameValue}
        onChange={projectNameValueChange}
      />
      <button className='modal__button' onClick={closeModal}>Закрыть</button>
    </Modal>
  );
}

ProjectNameModal.propTypes = {
  isModalOpen: PropTypes.bool,
  closeModal: PropTypes.func,
  projectNameValue: PropTypes.string,
  projectNameValueChange: PropTypes.func,
};

export default ProjectNameModal
