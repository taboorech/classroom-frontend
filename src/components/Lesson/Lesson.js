import { Link, useLocation } from 'react-router-dom';
import './Lesson.scss';
import { dateNormalize } from '../../utils/dateNormalize';

export default function Lesson(props) {
  
  const location = useLocation();

  return (
    <div className={'Lesson col s12 '.concat(props.className)}>
      <div className={'title-block'} onClick = { props.onClick }>
        { props.title }
        <div className='secondary-content'>
          <div className={'expires'.concat(!props.isOwner && props.expires < Date.now() ? ' missed' : null)}>
            Deadline: { dateNormalize(+props.expires) }
          </div>
          { props.isOwner ?
            <div className='buttonsBlock'>
              <Link to={`./edit?lesson=${props.lessonId}`}>
                <i className='material-icons'>edit</i>
              </Link>
            </div>
          : null}
        </div>
      </div>
      <div className='lesson-body'>
        <div className='lesson-body-content'>
          <div className='description-block'>
            { props.description }
          </div>
          <div className='attachments-block'>
            { props.attachedElements.map((attachedElement, index) => (
              <Link key={`attached-element-${index}`} target="_blank" to={  attachedElement.path  }>{ attachedElement.originalname }</Link>
            )) }
          </div>
          <div className='button-block row'>
            <Link to={`${location.pathname}/${ props.lessonId }`.concat(props.isOwner ? `/check` : "")} className="waves-effect waves-light btn col s12 m6 offset-m3 l2">
              {props.isOwner ? "Check works" : "Open lesson"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}