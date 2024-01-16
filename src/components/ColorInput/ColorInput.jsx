import style from './Color.module.css';

export const ColorInput = ({ handleChange, data, text }) => {
  const handleInputChange = e => {
    const userValue = String(e.target.value).toLowerCase().split('');

    const newValue = userValue
      .reduce((prev, elem) => {
        if (elem) {
          return (prev = prev + elem);
        }
      }, '')
      .trim();
    console.log(newValue);
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
