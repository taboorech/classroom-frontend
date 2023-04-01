import './Class.scss';
import { Link } from "react-router-dom"

export default function Class(props) {
  const getLessons = (props) => {
    if(props.lessons) {
      return props.lessons.map((lesson, index) => {
        if(lesson.expires && (+lesson.expires > (Date.now() + 3600 * 24 * 7)) && index <= 4) {
          return(
            <Link key={`lesson-${index}`} to={'/classes/' + props.classId + '/' + lesson._id} className={'s12 missed'}>
              { lesson.title }
            </Link>
          )
        }
        return false;
      })
    }
  }

  return (
    <div className="Class col s12 m4 l3 sample">
      <div className="card blue-grey darken-1">
        <Link to={`/classes/${props.classId}`}>
          <div className="card-content white-text">
            <span className="card-title">{ props.title }</span>
            <p>{ props.description }</p>
          </div>
        </Link>
        <div className="card-action z-depth-3">
          { getLessons(props) }
        </div>
      </div>
    </div>
  )
}