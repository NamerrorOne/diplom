import style from './AddObjBtn.module.css';

export const AddObjBtn = props => {
  const data = props.color;
  const sizes = [props.height, props.radiusBottom, props.radiusTop];

  return (
    <button
      onClick={() => props.addObject(data, sizes)}
      className={style.addObjBtn}
    >
      {props.text}
    </button>
  );
};
