import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Class from "../../components/Class/Class";
import { changeTitle, changeDesription, createClass, changeAccessTokenInput, connectToClass } from '../../redux/classes/classesSlice';
import './Classes.scss';
import CreateForm from "../../components/CreateForm/CreateForm";
import { openForm } from "../../redux/createForm/createFormSlice";
import Background from "../../components/Background/Background";
import { CSSTransition } from 'react-transition-group';
import M from "materialize-css";
import { useLocation, useNavigate } from "react-router-dom";

export default function Classes(props) {
  const classes = useSelector((state) => state.classes);
  const createForm = useSelector((state) => state.createForm);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search).get('accessToken');

  useEffect(() => {
    document.title = "Classes";
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    const modals = document.querySelectorAll('.modal');
    const modalObj = M.Modal.getInstance(modals);
    if(modalObj)
      modalObj.open();
    M.Modal.init(modals);
    M.Dropdown.init(dropdownTriggers);
  }, [])

  const connectToClassroom = useCallback((accessToken = queryParams) => {
    if(accessToken)
      dispatch(connectToClass({ accessToken }));
      navigate('/');
    if(classes.error) {
      classes.error.map((error) => {
        return M.toast({html: `${error}`});
      })
    }
  }, [queryParams, dispatch, navigate, classes.error]);
  
  useEffect(() => {
    connectToClassroom();
  }, [connectToClassroom])

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
        <button
          className="dropdown-trigger btn-floating waves-effect waves-light right-align create-class-button"
          data-target= {'classesActions'}
        >
          <i className="material-icons">add</i>
        </button>
        <ul id='classesActions' className='dropdown-content'>
          <li><a href="#connectModal" className="modal-trigger">Connect</a></li>
          <li><a href="#!" onClick={() => {dispatch(openForm())}}>Create</a></li>
        </ul>
        <div id="connectModal" className="modal">
          <div className="modal-content">
            <h4>Connect to classroom</h4>
            <div className="row">
              <div className="input-field col s12">
                <input 
                  id="accessTokenInput" 
                  type="text" 
                  value={ classes.accessTokenInput } 
                  className="validate" 
                  onChange={(event) => {
                    dispatch(changeAccessTokenInput(event.target.value));
                  }}
                />
                <label htmlFor="accessTokenInput">Access token</label>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button 
              className="modal-close waves-effect waves-light btn"
              onClick={() => connectToClassroom(classes.accessTokenInput)}
            >Connect</button>
          </div>
        </div>
      </div>
      <div className="Classes row">
        { classes.classes.map((classObj, index) => (
          <Class key={`classes-${index}`} title={ classObj.title } description={ classObj.description } lessons={ classObj.lessons } classId={ classObj._id } owner={ classObj.owners } />
        )) }
      </div>
    </>
  )
}