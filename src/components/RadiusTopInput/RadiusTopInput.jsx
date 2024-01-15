import style from './RadiusTopInput.module.css';

export const TopRadiusInput = ({ text, handleTopRadiusChange }) => {
  const TopRadiusChange = e => {
    const newTopRadius = e.target.value;
    handleTopRadiusChange(newTopRadius);
  };

  return (
    <input
      className={style.basicInput}
      placeholder={text}
      type='number'
      onChange={TopRadiusChange}
    ></input>
  );
};
