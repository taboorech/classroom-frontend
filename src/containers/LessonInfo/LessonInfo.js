import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import CreateForm from "../../components/CreateForm/CreateForm";
import { openForm, closeForm } from "../../redux/createForm/createFormSlice";
import { getLessonInfo, uploadFiles, changeURLInput } from '../../redux/lessonInfo/lessonInfoSlice';
import M from 'materialize-css';
import './LessonInfo.scss';
import { CSSTransition } from 'react-transition-group';
import Background from '../../components/Background/Background';
import mainInstance from '../../api/mainInstance';

export default function LessonInfo() {

  const classes = useSelector((state) => state.classes);
  const createForm = useSelector((state) => state.createForm);
  const lessonInfo = useSelector((state) => state.lessonInfo);
  const dispatch = useDispatch();
  const { id, lessonId } = useParams();
  const location = window.location;

  useEffect(() => {
    dispatch(getLessonInfo({ id, lessonId }));
  }, [dispatch, id, lessonId]);
  
  useEffect(() => {
    const dropdowns = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropdowns);
    const modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  })

  let classTitle;
  let classDesription;
  if(classes.classes.length) {
    const classObj = classes.classes.find(({_id}) => _id.toString() === id);
    classTitle = classObj.title;
    classDesription = classObj.description;
  }

  const dateNormalize = (date) => {
    return Intl.DateTimeFormat('ua', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  }

  const fileInputOnChange = (event) => {
    const modal = document.querySelector('.modal#filesModal');
    let instance = M.Modal.getInstance(modal);
    instance.close();
    let files = new FormData();
    files.append('files', event.target.files[0]);
    dispatch(uploadFiles({
      id, 
      lessonId, 
      files
    }));
    event.target.value = null;
  }

  const urlInputConfirm = (event) => {
    console.log(event);
    let attachedElements = new FormData();
    attachedElements.append('attachedElements', lessonInfo.urlInput);
    dispatch(uploadFiles({
      id,
      lessonId,
      attachedElements
    }))
    dispatch(changeURLInput(''));
  }

  return (
    lessonInfo.lesson ?
    <>
      <CSSTransition in={createForm.open} mountOnEnter unmountOnExit timeout={{
        enter: 700,
        exit: 700
      }}>
        <Background onClick={() => {
          dispatch(closeForm());
        }} /> 
      </CSSTransition>
      <div className='add-link-block row'>
        <CreateForm btnTitle = {'Add'} onBtnClick={(event) => {
          urlInputConfirm(event);
          dispatch(openForm());
        }}>
          <div className="input-field col s12">
            <input id="URL" type="text" value={ lessonInfo.urlInput } onChange={(event) => dispatch(changeURLInput(event.target.value))} className="validate" />
            <label htmlFor="URL">URL</label>
          </div>
        </CreateForm>
      </div>
      <div className='navigationBlock'>
        <Link to={`${location.origin}/classes/${id}`}>
          <h5>&lt; { classTitle }</h5>
          <p>{ classDesription }</p>
        </Link>
      </div>
      <div className="generalBlock row">
        <div className="mainInfo col s12 m8 l9">
          <div className='mainTitleBlock row'>
            <div className='mainTitle col s3'>
              { lessonInfo.lesson.title }
            </div>
            <div className={'expires col s3 offset-s6 right-align'.concat(+lessonInfo.lesson.expires < Date.now() ? ' missed' : '')}>
              Deadline: { dateNormalize(+lessonInfo.lesson.expires) }
            </div>
          </div>
          <div className='attachedElements'>
            { lessonInfo.lesson.attachedElements.map((attachedElement, index) => (
              <Link 
                to={ attachedElement.path } 
                key={`attached-element-${index}`} 
                className='attachedElement'
                target={'_blank'}
              >
                <i className="material-icons">
                  { attachedElement.type === 'path' ? "insert_link" : "attach_file" }
                </i>
                { attachedElement.originalname }
              </Link>
            )) }
          </div>
        </div>
        <div className="filesBlock col s12 m4 l3">
          <h5>Turn in: </h5>
          <div className='userFilesBlock'>
            { lessonInfo.userElements.files ? lessonInfo.userElements.files.map((userElement, index) => (
              <Link key={`files-${index}`} to={ userElement.type === 'path' ? userElement.path : mainInstance.defaults.baseURL + '\\' + userElement.path } target={'_blank'} className='userFile'>
                <i className="material-icons">
                  { userElement.type === 'path' ? "insert_link" : "attach_file" }
                </i>
                <div className='userFilesNames'>
                  { userElement.originalname }
                  { lessonInfo.userElements !== null && (lessonInfo.userElements === undefined || !lessonInfo.userElements.turnIn) ?
                  <i className="material-icons">
                    clear
                  </i> : null }
                </div>
              </Link>
            )) : null}
            { lessonInfo.userElements !== null && (lessonInfo.userElements === undefined || !lessonInfo.userElements.turnIn) ?
            <>
              <button className="dropdown-trigger waves-effect waves-light btn col s8 offset-s2 addAttachments" data-target='attachmentsSwitch'>
                <i className='material-icons'>add</i>
                Add attachments
              </button>
              <ul id='attachmentsSwitch' className='dropdown-content'>
                <li><a className="modal-trigger" href="#filesModal">Files</a></li>
                <li><a href="#!" onClick={() => dispatch(openForm())}>Link</a></li>
              </ul>
              <div id="filesModal" className="modal">
                <div className="modal-content">
                  <h4>Add Files</h4>
                  <div className="file-field input-field">
                    <div className="btn">
                      <span>
                        <i className='material-icons'>file_upload</i>
                      </span>
                      <input type="file" onChange={(event) => fileInputOnChange(event)} multiple />
                    </div>
                    <div className="file-path-wrapper">
                      <input className="file-path validate" type="text" placeholder="Upload one or more files"/>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <a href="#!" className="modal-close waves-effect waves-green btn-flat">Close</a>
                </div>
              </div>
            </> : null }
          </div>
          <button className="waves-effect waves-light btn col s12 l8 offset-l2" disabled={lessonInfo.userElements !== null && (lessonInfo.userElements === undefined || !lessonInfo.userElements.turnIn) ? false : true}>
            <i className="material-icons left">check</i>
            Turn in
          </button>
        </div>
      </div>
      <div className="secondaryBlock">

      </div>
    </> : 
    <div className="preloader-wrapper big active">
      <div className="spinner-layer spinner-blue">
        <div className="circle-clipper left">
          <div className="circle"></div>
        </div><div className="gap-patch">
          <div className="circle"></div>
        </div><div className="circle-clipper right">
          <div className="circle"></div>
        </div>
      </div>
    </div>
  )
}