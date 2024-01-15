import style from './HeightInput.module.css';

export const HeightInput = ({ text, handleHeightChange }) => {
  const heightChange = e => {
    const newHeight = e.target.value;
    handleHeightChange(newHeight);
  };

  return (
    <input
      placeholder={text}
      className={style.basicInput}
      type='number'
      onChange={heightChange}
    ></input>
  );
};
