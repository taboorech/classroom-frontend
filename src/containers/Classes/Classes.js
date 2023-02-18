import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Class from "../../components/Class/Class";
import { changeTitle, changeDesription, createClass } from '../../redux/classes/classesSlice';
import './Classes.scss';
import CreateForm from "../../components/CreateForm/CreateForm";
import { openForm } from "../../redux/createForm/createFormSlice";
import Background from "../../components/Background/Background";
import { CSSTransition } from 'react-transition-group';

export default function Classes(props) {
  const classes = useSelector((state) => state.classes);
  const createForm = useSelector((state) => state.createForm);
  const dispatch = useDispatch();

  return(
    <>
      <CSSTransition in={createForm.open} mountOnEnter unmountOnExit timeout={{
        enter: 700,
        exit: 700
      }}>
        <Background onClick={() => dispatch(openForm())} /> 
      </CSSTransition>
      <div className="create-class-block row">
        <CreateForm btnTitle = {'Create'} onBtnClick={() => {
          dispatch(createClass({ 
            title: classes.createClassTitle, 
            description: classes.createClassDescription
          }));
          dispatch(openForm());
        }}>
          <div className="input-field col s12">
            <input id="class-name" value={classes.createClassTitle} type="text" className="validate" onChange={(event) => dispatch(changeTitle(event.target.value))} />
            <label htmlFor="class-name">{ 'Class title' }</label>
          </div>
          <div className="input-field col s12">
            <input id="class-description" value={classes.createClassDescription} type="text" className="validate" onChange={(event) => dispatch(changeDesription(event.target.value))} />
            <label htmlFor="class-description">{ 'Class description' }</label>
          </div>
        </CreateForm>
        <button className="col s10 offset-s1 m4 offset-m7 l1 offset-l10 waves-effect waves-light btn create-class-button" onClick={() => {dispatch(openForm())}}>Create</button>
      </div>
      <div className="Classes row">
        { classes.classes.map((classObj, index) => (
          <Class key={`classes-${index}`} title={ classObj.title } description={ classObj.description } lessons={ classObj.lessons } classId={ classObj._id } owner={ classObj.owners } />
        )) }
      </div>
    </>
  )
}