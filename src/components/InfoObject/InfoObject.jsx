import style from './InfoObject.module.css';

export const InfoObject = props => {
  console.log(props.isActive);
  return (
    <div className={props.isActive ? style.active : style.infoWrapper}>
      {props.children}
    </div>
  );
};
