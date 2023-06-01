import { useDispatch, useSelector } from 'react-redux';
import './LessonCheck.scss';
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { changeButtonState, changeTurnIn, changeMark, getLessonWorks, changeStateMark, returnWorkState } from '../../redux/lessonCheck/lessonCheckSlice';
import mainInstance from '../../api/mainInstance';
import { makeAssessment, returnWork, updateAssessment } from '../../redux/classInfo/classInfoSlice';
import M from 'materialize-css';
import ReturnAnchor from '../../components/ReturnAnchor/ReturnAnchor';

export default function LessonCheck() {

  const lessonCheck = useSelector((state) => state.lessonCheck);
  const classes = useSelector((state) => state.classes);
  const { id, lessonId } = useParams();
  const dispatch = useDispatch();
  const location = window.location;
  const userId = location.hash.split('#')[1];

  const marksInputsChange = (event) => {
    const mark = lessonCheck.marks.find((mark) => mark.user === userId);
    if ((!!mark && mark.mark.toString() !== event.target.value.toString()) || (!mark && event.target.value !== "")){
      dispatch(changeButtonState('rate'))
    } else {
      dispatch(changeButtonState('return'))
    }
    dispatch(changeMark({
      id: event.target.id,
      value: event.target.value,
    }))
  }

  
  const rateButtonClick = (event) => {
    if(lessonCheck.buttonState !== "return") {
      const mark = lessonCheck.marks.find((mark) => mark.user === userId);
      if(!!mark) {
        const message = window.confirm(`Are you agree to update an assessment?`);
        if(message) {
          dispatch(updateAssessment({
            id,
            lessonId,
            markId: mark._id,
            mark: +lessonCheck[event.target.getAttribute("input_id")]
          }))
        }
      } else {
        const message = window.confirm(`Are you agree to make an assessment?`);
        if(message) {
          dispatch(makeAssessment({
            id,
            lessonId,
            memberId: userId,
            mark: +lessonCheck[event.target.getAttribute("input_id")]
          }))
          dispatch(changeTurnIn({
            value: true,
            userId
          }));
          dispatch(changeStateMark({
            mark: lessonCheck[`mark${userId}Value`],
            userId
          }))
        }
        dispatch(changeButtonState("return"));
      }
    } else {
      const message = window.confirm(`Are you agree to return the work?`);
      if(message) {
        dispatch(returnWork({
          id,
          lessonId,
          memberId: userId
        }))
        dispatch(changeTurnIn({
          value: false,
          userId
        }));
        dispatch(changeMark({
          id: `mark${userId}Value`,
          value: ''
        }));
        console.log(returnWorkState({
          userId
        }));
        dispatch(returnWorkState({
          userId
        }))
      }
    }
  }

  useEffect(() => {
    dispatch(getLessonWorks({
      id,
      lessonId
    }))
  }, [dispatch, id, lessonId])

  useEffect(() => {
    M.updateTextFields();
  })

  useEffect(() => {
    document.title = lessonCheck.lesson?.title;
  }, [lessonCheck.lesson])

  useEffect(() => {
    const turnIn = lessonCheck.works.find((work) => work.user._id === userId);
    const mark = lessonCheck.marks.find((mark) => mark.user === userId);
    if(!!mark) {
      dispatch(changeTurnIn({
        value: true,
        userId
      }));
      return;
    }
    if(!!turnIn) {
      dispatch(changeTurnIn({
        value: turnIn.turnIn,
        userId
      }));
      return;
    }
    dispatch(changeTurnIn({
      value: false,
      userId
    }));
  })

  let classTitle;
  let classDesription;
  if(classes.classes.length) {
    const classObj = classes.classes.find(({_id}) => _id.toString() === id);
    classTitle = classObj.title;
    classDesription = classObj.description;
  }

  return (
    <>
      <ReturnAnchor link={`${location.origin}/classes/${id}`} title={classTitle} secondaryContent={classDesription} />
      <div className="LessonCheck row">
        <div className="collection users col s12 l4">
          <h5>Users: </h5>
          <div className='col s12'>
            {lessonCheck.members.map((member, index) => (
              <Link 
                key={`user-${index}`} 
                to={`#${member._id}`}
                className={`collection-item user`.concat(userId === member._id ? ' active' : "")}
              >
                { `${member.surname} ${member.name}` }
                <div className='secondary-content'>
                  {!!lessonCheck.marks.find((mark) => mark.user === member._id) ? "Rated" : !!lessonCheck.works.find((work) => work.user._id === member._id)?.turnIn ? "Handed over" : "Appointed"}
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="collection works col s12 l4">
          <h5>Attachments: </h5>
          <div className='col s12'>
            {lessonCheck.works.map((work) => (
              work.user._id === userId && !!work.files ? work.files.map((file, index) => (
                <Link 
                  key={`file-${index}-${work.user._id}`} 
                  to={file.type === "file" ? mainInstance.defaults.baseURL + '\\' + file.path : file.path}
                  className='collection-item'
                  target='_blank'
                >
                  {file.originalname}
                </Link>
              )) : null
            ))}
          </div>
        </div>
        <div className='collection marks col s12 l4'>
          <h5>Tools: </h5>
          {userId ? <div className='row'>
            <div className='col marksInfo s12'>
              <div className='input-field col offset-s1 s5 l3'>
                <input 
                  id={`mark${userId}Value`}
                  type='text' 
                  value={lessonCheck[`mark${userId}Value`] || ""}
                  onChange={(event) => marksInputsChange(event)}
                />
                <label htmlFor='mark' >Mark</label>
              </div>
              <div className='input-field col s5 l3'>
                <input 
                  id={`mark${userId}Value`}
                  type='text' 
                  value={lessonCheck.lesson.maxMark || ""}
                  readOnly
                />
                <label htmlFor='mark' >Max mark</label>
              </div>
            </div>
            <button 
              className="waves-effect waves-light btn col offset-s1 add-edit-mark"
              input_id = {`mark${userId}Value`}
              onClick={(event) => rateButtonClick(event)}
              disabled={!lessonCheck.turnIn && lessonCheck[`mark${userId}Value`] === ""}
            >
              {lessonCheck.buttonState === "rate" ? "Rate" : "Return"}
            </button>
          </div> : null}
        </div>
      </div>
    </>
  )
}