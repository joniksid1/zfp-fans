import PropTypes from 'prop-types';

const ErrorModal = ({ error, onClose }) => {
  if (!error) {
    return null;
  }

  return (
    <div className="error-modal" onClick={onClose}>
      <div className="error-modal__content">
        <h2 className="error-modal__header">При запросе возникла ошибка</h2>
        <p className="error-modal__text">{error}</p>
      </div>
    </div>
  );
};

ErrorModal.propTypes = {
  error: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ErrorModal;
