import { useDispatch, useSelector } from 'react-redux';
import './LessonCheck.scss';
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { changeMark, getLessonWorks } from '../../redux/lessonCheck/lessonCheckSlice';
import mainInstance from '../../api/mainInstance';
import { makeAssessment, returnWork, updateAssessment } from '../../redux/classInfo/classInfoSlice';
import M from 'materialize-css';

export default function LessonCheck() {

  const lessonCheck = useSelector((state) => state.lessonCheck);
  const { id, lessonId } = useParams();
  const dispatch = useDispatch();
  const location = window.location;
  const userId = location.hash.split('#')[1];
  let turnIn = lessonCheck.works ? lessonCheck.works.find((work) => work.user._id === userId) : null;
  if(!!turnIn) {
    turnIn = turnIn.turnIn;
  } else {
    turnIn = false;
  }

  const mark = lessonCheck.marks ? lessonCheck.marks.find((mark) => mark.user === userId) : null;
  if(!!mark && !!mark.mark) {
    turnIn = true
  } else {
    turnIn = false;
  }

  const marksInputsChange = (event) => {
    dispatch(changeMark({
      id: event.target.id,
      value: event.target.value
    }))
  }

  
  const rateButtonClick = (event) => {
    if(lessonCheck[event.target.getAttribute("input_id")] !== "") {
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
        }
      }
    } else {
      const message = window.confirm(`Are you agree to return the work?`);
      if(message) {
        dispatch(returnWork({
          id,
          lessonId,
          memberId: userId
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

  return (
    <div className="LessonCheck row">
      <div className="collection users col s4">
        <h5>Users: </h5>
        {lessonCheck.members ? lessonCheck.members.map((member, index) => (
          <Link 
            key={`user-${index}`} 
            to={`#${member._id}`} 
            className={`collection-item user`.concat(userId === member._id ? ' active' : "")}
          >
            { `${member.surname} ${member.name}` }
          </Link>
        )) : null}
      </div>
      <div className="collection works col s4">
        <h5>Attachments: </h5>
        <div className='col s12'>
          {lessonCheck.works ? lessonCheck.works.map((work) => (
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
          )) : null}
        </div>
      </div>
      <div className='marks col s4'>
        <h5>Tools: </h5>
        <div className='row'>
          <div className='col marksInfo s12'>
            <div className='input-field col s3'>
              <input 
                id={`mark${userId}Value`}
                type='text' 
                value={lessonCheck[`mark${userId}Value`] || ""}
                onChange={(event) => marksInputsChange(event)}
              />
              <label htmlFor='mark' >Mark</label>
            </div>
            <div className='input-field col s3'>
              <input 
                id={`mark${userId}Value`}
                type='text' 
                value={lessonCheck.lesson ? lessonCheck.lesson.maxMark : ""}
                readOnly
              />
              <label htmlFor='mark' >Max mark</label>
            </div>
          </div>
          <button 
            className="waves-effect waves-light btn col offset-s1"
            input_id = {`mark${userId}Value`}
            onClick={(event) => rateButtonClick(event)}
            disabled={lessonCheck[`mark${userId}Value`] === "" && turnIn ? false : lessonCheck[`mark${userId}Value`] !== "" ? false : true}
            >
            {lessonCheck[`mark${userId}Value`] ? "Rate" : "Return"}
          </button>
        </div>
      </div>
    </div>
  )
}