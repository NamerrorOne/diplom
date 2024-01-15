import style from './Color.module.css';

export const ColorInput = ({ handleChange, data, text }) => {
  const handleInputChange = e => {
    const newValue = e.target.value;
    handleChange(newValue); //handleColorChange
  };

  return (
    <input
      value={data}
      className={style.basicInput}
      type='text'
      onChange={handleInputChange}
      placeholder={text}
    />
  );
};
