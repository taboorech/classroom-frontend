import { useDispatch, useSelector } from "react-redux";
import { changeMark, makeAssessment, updateAssessment } from "../../redux/classInfo/classInfoSlice";
import './GradeBook.scss';
import M from "materialize-css";

export default function GradeBook(props) {

  const classInfo = useSelector((state) => state.classInfo);
  const dispatch = useDispatch();

  const saveAssessment = (event) => {
    if(!event.target.getAttribute("firstaction")) {
      dispatch(makeAssessment({
        id: classInfo.info._id,
        lessonId: event.target.getAttribute('lessonid'),
        memberId: event.target.getAttribute('memberid'),
        mark: +event.target.value
      }))
    } else {
      dispatch(updateAssessment({
        id: classInfo.info._id,
        lessonId: event.target.getAttribute('lessonid'),
        markId: event.target.getAttribute('firstaction'),
        mark: +event.target.value
      }))
    }

    if(classInfo.error) {
      classInfo.error.map((error) => {
        return M.toast({html: `${error}`});
      })
    }
  }

  return (
    <div className="GradeBook">
      <table>
        <thead>
          <tr>
            <th>Students</th>
            { props.lessons ? props.lessons.map((lesson, index) => (
              <th key={`lessons-names-${index}`} >{ lesson.title }</th>
            )) : null }
          </tr>
        </thead>

        <tbody>
          { props.members ? props.members.map((member, index) => (
            <tr key={`member-${index}`}>
              <td>{`${member.surname} ${member.name}`}</td>
              { props.lessons ? props.lessons.map((lesson, index) => {
                const mark = props.marks.find((mark) => (mark.lesson === lesson._id || mark.lesson._id === lesson._id) && (mark.user === member._id || mark.user._id === member._id));
                return <td key={`mark-column-${index}`} >
                  <div className="row">
                    <div className="input-field col s12">
                      <input 
                        id={`mark${lesson._id + member._id}Value`} 
                        value={ classInfo[`mark${lesson._id + member._id}Value`] } 
                        onChange={(event) => dispatch(changeMark(event.target))} 
                        lessonid = { lesson._id }
                        memberid = { member._id }
                        type="text"
                        firstaction = { mark ? mark._id : '' }
                        onBlur = {(event) => saveAssessment(event)}
                        className="validate marks-input" 
                      />
                    </div>
                  </div>
                </td>
              }) : null }
            </tr>  
          )) : null }
        </tbody>
      </table>
    </div>
  )
}