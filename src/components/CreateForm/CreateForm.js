import { useSelector } from 'react-redux';
import './CreateForm.scss';

export default function CreateForm(props) {
  const createForm = useSelector((state) => state.createForm);

  return (
    <div className={createForm.open ? "col m8 l4 offset-l8 s12 offset-m4 create-form ".concat("open") : "col m4 s12 offset-m8 create-form"}>
      { props.children }
      <div className='row'>
        {props.redBtnTitle ?
        <>
          <button className="col s3 offset-s1 waves-effect waves-light btn red" onClick={ props.onRedBtnClick } >{ props.redBtnTitle }</button>
          <button className="col s3 offset-s4 waves-effect waves-light btn create-button" onClick={ props.onBtnClick }>{ props.btnTitle }</button>
        </> :
        <button className="col s3 offset-s8 waves-effect waves-light btn create-button" onClick={ props.onBtnClick }>{ props.btnTitle }</button> }
      </div>
    </div>
  )
}