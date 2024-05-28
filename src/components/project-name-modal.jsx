import Modal from 'react-modal';
import PropTypes from 'prop-types';

function ProjectNameModal({
  isProjectNameModalOpen,
  closeModals,
  projectNameValue,
  projectNameValueChange,
}) {

  return (
    <Modal
      isOpen={isProjectNameModalOpen}
      onRequestClose={closeModals}
      contentLabel="Выбор названия проекта"
      overlayClassName="modal__overlay"
      className="modal"
    >
      <button className='modal__close-button' onClick={closeModals}></button>
      <h2 className='modal__header'>Название проекта</h2>
      <input
        name="projectName"
        type="text"
        id="projectName"
        className="modal__input"
        required=""
        maxLength={100}
        value={projectNameValue}
        onChange={projectNameValueChange}
      />
      <button className='modal__button' onClick={closeModals}>Закрыть</button>
    </Modal>
  );
}

ProjectNameModal.propTypes = {
  isProjectNameModalOpen: PropTypes.bool,
  closeModals: PropTypes.func,
  projectNameValue: PropTypes.string,
  projectNameValueChange: PropTypes.func,
};

export default ProjectNameModal
