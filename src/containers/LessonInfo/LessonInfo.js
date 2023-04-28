import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import CreateForm from "../../components/CreateForm/CreateForm";
import { openForm, closeForm } from "../../redux/createForm/createFormSlice";
import { getLessonInfo, uploadFiles, changeURLInput, deleteElements, turnIn, cancel } from '../../redux/lessonInfo/lessonInfoSlice';
import M from 'materialize-css';
import './LessonInfo.scss';
import { CSSTransition } from 'react-transition-group';
import Background from '../../components/Background/Background';
import mainInstance from '../../api/mainInstance';
import ReturnAnchor from '../../components/ReturnAnchor/ReturnAnchor';
import { dateNormalize } from '../../api/dateNormalize';

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

  const fileInputOnChange = (event) => {
    const modal = document.querySelector('.modal#filesModal');
    let instance = M.Modal.getInstance(modal);
    instance.close();
    let files = new FormData();
    for(let i = 0; i < event.target.files.length; i++) {
      files.append('files', event.target.files[i]);
    }
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

  const deleteElementClick = (event) => {
    event.preventDefault();
    let message = window.confirm(`Do you want to delete file?`);
    if(message) {
      let attachedElements = new FormData();
      attachedElements.append('attachedElements', event.target.getAttribute("element_id"));
      dispatch(deleteElements({
        id,
        lessonId,
        attachedElements
      }))
    }
  }

  const turnInFunc = () => {
    dispatch(turnIn({
      id,
      lessonId
    }))
  }

  const cancelTurnInFunc = () => {
    dispatch(cancel({
      id,
      lessonId
    }))
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
      <ReturnAnchor link={`${location.origin}/classes/${id}`} title={classTitle} secondaryContent={classDesription} />
      <div className="generalBlock row">
        <div className="mainInfo col s12 m8 l9">
          <div className='mainTitleBlock row'>
            <div className='mainTitle col s9 l3'>
              { lessonInfo.lesson.title }
              { !!lessonInfo.marks.mark ? <p>{lessonInfo.marks.mark} of {lessonInfo.lesson.maxMark}</p> : null }
            </div>
            <div className={'expires col s3 l3 offset-l6 right-align'.concat(+lessonInfo.lesson.expires < Date.now() && !lessonInfo.userElements.turnIn && lessonInfo.marks === null ? ' missed' : '')}>
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
        { lessonInfo.lesson.type === "EXERCISE" ?
          <div className="filesBlock col s12 m4 l3">
            <h5>Turn in: </h5>
            <div className='userFilesBlock'>
              { lessonInfo.userElements.files ? lessonInfo.userElements.files.map((userElement, index) => (
                <Link key={`files-${index}`} to={ userElement.type === 'path' ? userElement.path : mainInstance.defaults.baseURL + '\\' + userElement.path } target={'_blank'} className='userFile'>
                  <i className="material-icons">
                    { userElement.type === 'path' ? "insert_link" : "attach_file" }
                  </i>
                  <div className='userFilesNames' title={ userElement.originalname }>
                    { userElement.originalname }
                  </div>
                  { lessonInfo.userElements !== null && (lessonInfo.userElements === undefined || !lessonInfo.userElements.turnIn) ?
                  <i className="material-icons" element_id = { userElement._id } onClick={(event) => deleteElementClick(event)}>
                    clear
                  </i> : null }
                </Link>
              )) : null}
              { lessonInfo.userElements !== null && (lessonInfo.userElements === undefined || !lessonInfo.userElements.turnIn) ?
              <>
                <button className="dropdown-trigger waves-effect waves-light btn col s8 offset-s2 addAttachments" data-target='attachmentsSwitch'>
                  <i className='material-icons left'>add</i>
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
            { lessonInfo.userElements !== null && (lessonInfo.userElements === undefined || !lessonInfo.userElements.turnIn) ?
            <>
              <button data-target="turnInModal" className="waves-effect waves-light btn col s12 l8 offset-l2 modal-trigger" >
                <i className="material-icons left">check</i>
                Turn in
              </button>
              <div id="turnInModal" className="modal">
                <div className="modal-content">
                  <h4>Turn in?</h4>
                </div>
                <div className="modal-footer">
                  <a href="#!" className="modal-close waves-effect waves-green btn-flat">Cancel</a>
                  <a href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={() => turnInFunc()}>Turn in</a>
                </div>
              </div>
            </> : 
            <button data-target="turnInModal" className="waves-effect waves-light btn col s12 l8 offset-l2 modal-trigger red" onClick={() => cancelTurnInFunc()}>
              <i className="material-icons left">clear</i>
              Cancel
            </button>}
          </div>
        : null }
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