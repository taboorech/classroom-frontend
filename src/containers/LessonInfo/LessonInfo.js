import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getLessonInfo } from '../../redux/lessonInfo/lessonInfoSlice';
import './LessonInfo.scss';

export default function LessonInfo() {

  const classes = useSelector((state) => state.classes);
  const lessonInfo = useSelector((state) => state.lessonInfo);
  const dispatch = useDispatch();
  const { id, lessonId } = useParams();
  const location = window.location;

  useEffect(() => {
    dispatch(getLessonInfo({ id, lessonId }));
  }, [dispatch, id, lessonId])

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

  return (
    lessonInfo.info.lesson ?
    <>
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
              { lessonInfo.info.lesson.title }
            </div>
            <div className={'expires col s3 offset-s6 right-align'.concat(+lessonInfo.info.lesson.expires < Date.now() ? ' missed' : '')}>
              Deadline: { dateNormalize(+lessonInfo.info.lesson.expires) }
            </div>
          </div>
          <div className='attachedElements'>
            { lessonInfo.info.lesson.attachedElements.map((attachedElement, index) => (
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
            { lessonInfo.info.userElements ? lessonInfo.info.userElements.map((userElement) => (
              <Link to={ userElement.files.path } target={'_blank'} className='userFile'>
                <i className="material-icons">
                  { userElement.files.type === 'path' ? "insert_link" : "attach_file" }
                </i>
              </Link>
            )) : null}
            <Link target={'_blank'} className='userFile'>
              <i className="material-icons">
                attach_file
              </i>
              FFF
            </Link>
            { lessonInfo.userElements !== null && (lessonInfo.userElements === undefined || !lessonInfo.userElements.turnIn) ?
            <div className="file-field input-field">
              <div className="btn">
                <span>
                  <i className='material-icons'>file_upload</i>
                </span>
                <input type="file" multiple />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" placeholder="Upload one or more files"/>
              </div>
            </div> : null }
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