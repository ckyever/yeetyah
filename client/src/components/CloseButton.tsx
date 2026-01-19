import buttonStyles from "../styles/Buttons.module.css";

import closeIcon from "../assets/icons/close.svg";

interface CloseButtonProps {
  handleClick: () => void;
}

function CloseButton({ handleClick }: CloseButtonProps) {
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${buttonStyles.button} ${buttonStyles.red}`}
    >
      <img src={closeIcon} alt="close icon" className={buttonStyles.icon} />
    </button>
  );
}

export default CloseButton;
