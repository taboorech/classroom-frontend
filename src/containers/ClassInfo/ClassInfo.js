import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getClassInfo, setOpen, changeTitleInput, changeDescriptionInput, deleteClass, getMarks } from '../../redux/classInfo/classInfoSlice';
import M from 'materialize-css';
import { openForm, closeForm } from '../../redux/createForm/createFormSlice';
import { openQRForm, closeQRForm } from '../../redux/QR/QRSlice';
import './ClassInfo.scss';
import Lesson from '../../components/Lesson/Lesson';
import CreateForm from '../../components/CreateForm/CreateForm';
import { CSSTransition } from 'react-transition-group';
import Background from '../../components/Background/Background';
import UserList from '../../components/UserList/UserList';
import QR from '../../components/QR/QR';
import GradeBook from '../../components/GradeBook/GradeBook';

export default function ClassInfo(props) {

  const classInfo = useSelector((state) => state.classInfo);
  const createForm = useSelector((state) => state.createForm);
  const QRFormState = useSelector((state) => state.QRForm);
  const location = window.location;
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getClassInfo({ id }));
  }, [dispatch, id])

  useEffect(() => {
    const tabs = document.querySelectorAll('.tabs');
    M.Tabs.init(tabs);
    M.updateTextFields();
  }, [])

  useEffect(() => {
    const tabs = document.querySelectorAll('.tabs');
    const tooltipped = document.querySelectorAll('.tooltipped');
    M.Tooltip.init(tooltipped);
    const instance = M.Tabs.getInstance(tabs[0]);
    instance.updateTabIndicator();
  })

  return (
    <>
      <CSSTransition in={createForm.open || QRFormState.open} mountOnEnter unmountOnExit timeout={{
        enter: 700,
        exit: 700
      }}>
        <Background onClick={() => {
          dispatch(closeForm());
          dispatch(closeQRForm());
        }} /> 
      </CSSTransition>
      { classInfo.info.accessToken ?
      <CSSTransition in={QRFormState.open} mountOnEnter unmountOnExit timeout={{
        enter: 400,
        exit: 700
      }}>
        <QR 
          isOpen = { QRFormState.open } 
          titleText = { 'Access Token' }
          secondaryContent = { classInfo.info.accessToken } 
          QRvalue = {`${window.location.origin}?accessToken=${classInfo.info.accessToken }`}
        />
      </CSSTransition> : null }
      {classInfo.owner ?
        <div className="update-class-block row">
          <CreateForm className={createForm.open ? "open" : ""} btnTitle = {'Update'} redBtnTitle = {'Delete'} onRedBtnClick = {() => {
            dispatch(deleteClass({ id }));
            if(!classInfo.error.length) {
              navigate('/');
            }
          }}>
            <div className="input-field col s12">
              <input id="class-name" value={classInfo.titleInput} type="text" className="validate" onChange={(event) => dispatch(changeTitleInput(event.target.value))} />
              <label htmlFor="class-name">{ 'Class title' }</label>
            </div>
            <div className="input-field col s12">
              <input id="class-description" value={classInfo.descriptionInput} type="text" className="validate" onChange={(event) => dispatch(changeDescriptionInput(event.target.value))} />
              <label htmlFor="class-description">{ 'Class description' }</label>
            </div>
          </CreateForm>
        </div> : 
      null }
      <div className='row'>
        <div className={'general-info col s12 m8 offset-m2 blue-grey darken-1 white-text'}>
          { classInfo.owner ?
          <div className='tools'>
            <i className="material-icons" onClick={() => dispatch(openForm())}>settings</i>
          </div> : null }
          <h4 style={{ marginTop: !classInfo.owner ? 1 + "rem" : 0 }} >
            { classInfo.info.title }
          </h4>
          <p>
            <span>
              { classInfo.info.description }
            </span>
            <a href='#!' className='white-text' onClick={() => dispatch(openQRForm())}>
              <i className="material-icons">open_in_new</i>
            </a>
          </p>
        </div>
        <div className="col s12 m8 offset-m2">
          <div className="col s12">
            <ul className="tabs">
              <li className={"tab col ".concat(classInfo.owner ? "s4" : "s6")}>
                <a href="#lessonsBlock">
                  <i className='material-icons'>assignment</i>
                </a>
              </li>
              <li className={"tab col ".concat(classInfo.owner ? "s4" : "s6")}>
                <a href="#usersBlock">
                  <i className='material-icons'>person</i>
                </a>
              </li>
              {classInfo.owner ?
              <li className="tab col s4">
                <a href="#gradeBook" onClick={!classInfo.marks ? () => dispatch(getMarks({ id: classInfo.info._id })) : null} >
                  <i className='material-icons'>assessment</i>
                </a>
              </li> : null}
            </ul>
          </div>
          <div id="lessonsBlock" className="col s12">
            { classInfo.owner ?
            <div className='row create-lesson-block' >
              <Link to={`${location.href}/edit`} className="col s10 offset-s1 m8 offset-m2 l6 offset-l3 waves-effect waves-light btn create-button">Create new exercise</Link>
            </div> : null }
            <div className="collection z-depth-1">
              { classInfo.info.lessons ? classInfo.info.lessons.map((lesson, index) => (
                <Lesson 
                  key={`lesson-${index}`} 
                  lessonId = { lesson._id }
                  title={ lesson.title } 
                  description={ lesson.description }
                  isOwner = { classInfo.owner } 
                  attachedElements = { lesson.attachedElements }
                  className = { classInfo.isOpen === index ? 'active' : "" }
                  onClick = {() => { dispatch(setOpen(index)) }}
                />
              )) : null }
            </div>
          </div>
          <div id="usersBlock" className="col s12">
            <UserList 
              owners = { classInfo.info.owners } 
              members = { classInfo.info.members } 
              isOwner = { classInfo.owner } 
              classId = { classInfo.info._id }
            ></UserList>
          </div>
          {classInfo.owner ?
          <div id="gradeBook" style={{display: 'none'}} className="col s12">
            { classInfo.marks ?
            <GradeBook 
              lessons = { classInfo.info.lessons }
              members = { classInfo.info.members }
              marks = { classInfo.marks }
            /> : null }
          </div> : null}
        </div>
      </div>
    </>
  )
}