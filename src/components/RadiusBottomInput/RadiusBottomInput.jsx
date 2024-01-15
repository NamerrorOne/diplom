import style from './RadiusBottomInput.module.css';

export const RadiusBottomInput = ({ text, handleBottomRadiusChange }) => {
  const bottomRadiusChange = e => {
    const newBottomRadius = e.target.value;
    handleBottomRadiusChange(newBottomRadius);
  };

  return (
    <input
      className={style.basicInput}
      placeholder={text}
      type='number'
      onChange={bottomRadiusChange}
    ></input>
  );
};
