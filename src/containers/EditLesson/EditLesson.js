import { useEffect } from "react";
import M from "materialize-css";
import './EditLesson.scss';
import ReturnAnchor from "../../components/ReturnAnchor/ReturnAnchor";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { changeTitle, changeMark, changeDescription, changeType, changeExpires, changeFiles, changeAttachments, createLesson, getLesson, updateLesson, clearValues } from "../../redux/editLesson/editLessonSlice";
import { dateNormalize } from "../../api/dateNormalize";

export default function EditLesson() {

  const { id } = useParams();
  const editLessonState = useSelector((state) => state.editLesson);
  const classes = useSelector((state) => state.classes);
  const location = window.location;
  const lessonId = location.search.split('?lesson=')[1];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fileInputOnChange = (event) => {
    dispatch(changeFiles(event.target.files));
  }

  const datePickerChange = (value) => {
    const expires = value.split('.');
    dispatch(changeExpires(new Date(expires[2], expires[1] - 1, expires[0]).getTime()));
  }

  const addUrlClick = () => {
    dispatch(changeAttachments({
      id: Object.keys(editLessonState.attachedElements).length,
      url: ''
    }));
  };

  let classTitle;
  let classDesription;
  if(classes.classes.length) {
    const classObj = classes.classes.find(({_id}) => _id.toString() === id);
    classTitle = classObj.title;
    classDesription = classObj.description;
  }

  const createButtonClick = () => {
    let lesson = new FormData();
    lesson.append('title', editLessonState.title);
    lesson.append('description', editLessonState.description);
    lesson.append('type', editLessonState.type);
    lesson.append('files', editLessonState.files);
    Object.keys(editLessonState.attachedElements).map((key) => (
      lesson.append('attachedElements[]', editLessonState.attachedElements[key])
    ))
    lesson.append('expires', editLessonState.expires);
    if(!lessonId) {
      dispatch(createLesson({
        id,
        lesson
      }));
    } else {
      dispatch(updateLesson({
        id,
        lessonId,
        lesson
      }))
    }
    console.log(editLessonState.expires);
    if(!editLessonState.error.length) {
      navigate(-1);
    }
  }
  
  useEffect(() => {
    let select = document.querySelectorAll('select');
    let datepickers = document.querySelectorAll('.datepicker');
    M.FormSelect.init(select);
    M.Datepicker.init(datepickers, { autoClose: true, format: 'dd.mm.yyyy', onClose: () => datePickerChange(datepickers[0].value) });
    if(!!editLessonState.expires) {
      datepickers[0].value = dateNormalize(+editLessonState.expires);
    } else {
      datepickers[0].value = '';
    }
    M.updateTextFields();
  })

  useEffect(() => {
    if(!!lessonId) {
      dispatch(getLesson({
        id,
        lessonId
      }))
    } else {
      dispatch(clearValues());
    }
  }, [dispatch, id, lessonId])

  return (
    <div className="EditLesson row">
      <ReturnAnchor link={`${location.origin}/classes/${id}`} title={classTitle} secondaryContent={classDesription} />
      <div className="col l6 m8 offset-m2 s12 offset-l3">
        <div className="input-field col s9">
          <input 
            id="title" 
            type="text" 
            className="validate" 
            value={editLessonState.title} 
            onChange={(event) => dispatch(changeTitle(event.target.value))} 
          />
          <label htmlFor="title">Title</label>
        </div>
        <div className="input-field col s3">
          <input 
            id="maxMark" 
            type="number" 
            className="validate" 
            value={editLessonState.maxMark} 
            onChange={(event) => dispatch(changeMark(event.target.value))} 
          />
          <label htmlFor="maxMark">Max mark</label>
        </div>
      </div>
      <div className="col l6 m8 offset-m2 s12 offset-l3">
        <div className="input-field col s12">
          <textarea 
            id="description" 
            className="materialize-textarea"
            value={editLessonState.description}
            onChange={(event) => dispatch(changeDescription(event.target.value))}
          ></textarea>
          <label htmlFor="description">Description</label>
        </div>
      </div>
      <div className="col l6 m8 offset-m2 s12 offset-l3">
        <div className="input-field col s12">
          <select 
            value={editLessonState.type || "DEFAULT"} 
            onChange={(event) => dispatch(changeType(event.target.value))}
          >
            <option value="DEFAULT" disabled>Choose type of exericse</option>
            <option value="EXERCISE">Exercise</option>
            <option value="LECTION">Lection</option>
          </select>
          <label>Type</label>
        </div>
      </div>
      <h5 className="col l6 m8 offset-m2 s12 offset-l3">Attachments: </h5>
      <div className="col l6 m8 offset-m2 s12 offset-l3">
        {Object.keys(editLessonState.attachedElements).map((key, index) => (
          <div className="input-field col s12" key={`add-attachments-link-${index}`}>
            <input 
              id={`url-${index}`} 
              type="url" 
              className="validate" 
              value={editLessonState.attachedElements[key]} 
              onChange={(event) => dispatch(changeAttachments({
                id: index,
                url: event.target.value
              }))} 
            />
            <label htmlFor={`url-${index}`}>URL</label>
          </div>
        ))}
        <button 
          className="btn waves-effect waves-light col s3 offset-s9"
          onClick={() => addUrlClick()}
        >Add url</button>
      </div>
      <div className="col l6 m8 offset-m2 s12 offset-l3">
        <div className="file-field input-field col s12">
          <div className="btn">
            <span>Files</span>
            <input type="file" multiple onChange={(event) => fileInputOnChange(event)} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" placeholder="Upload one or more files" />
          </div>
        </div>
      </div>
      <div className="col l6 m8 offset-m2 s12 offset-l3" hidden={editLessonState.type === "LECTION"}>
        <div className="input-field col s12">
          <input 
            type="text" 
            className="datepicker" 
            id="deadlineInput"
            readOnly
          />
          <label htmlFor="deadlineInput">Select deadline</label>
        </div>
      </div>
      <div className="col l6 m8 offset-m2 s12 offset-l3">
        <button className="btn waves-effect waves-light col s3" onClick={createButtonClick}>
          {lessonId ? `Update lesson` : `Create lesson`}
        </button>
      </div>
    </div>
  )
}