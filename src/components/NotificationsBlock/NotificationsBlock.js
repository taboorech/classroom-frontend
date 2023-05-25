import { useEffect } from 'react';
import M from 'materialize-css';
import './NotificationsBlock.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteNotifications, notificationBlockChange, deleteStateNotifications } from '../../redux/classes/classesSlice';

export default function NotificationsBlock(props) {

  const classes = useSelector((state) => state.classes);
  const dispatch = useDispatch();

  const deleteNotificationsButtonClick = (event, notification, type) => {
    event.preventDefault();
    dispatch(deleteNotifications({
      notification,
      type
    }))
    if(classes.error) {
      classes.error.map((error) => {
        return M.toast({html: `${error}`});
      })
    }
    dispatch(deleteStateNotifications({
      _id: notification,
      type: type.toLowerCase()
    }));
  }

  const createCollection = (elements, type = 'STUDENT') => {
    return elements.map((element, index) => (
      <Link 
        to={`classes/${element.class}/${element.lesson}`.concat(type === 'TEACHER' ? '/check' : '')} 
        key={`collection-${type}-${index}`} 
        className="collection-item"
        onClick={() => dispatch(notificationBlockChange())}
      >
        {element.message}
        <div className='secondary-content'>
          <i 
            className='material-icons' 
            onClick={(event) => deleteNotificationsButtonClick(event, element._id, type)}
          >clear</i>
        </div>
      </Link>
    ))
  }

  useEffect(() => {
    M.Tabs.init(document.querySelectorAll('.tabs'));
  })

  return (
    <div className={'NotificationsBlock'.concat(props.open ? ' open' : '')}>
      <div className="row">
        <div className="col s12">
          <ul className="tabs">
            <li className="tab col s6"><a className='active' href="#student">Student</a></li>
            <li className="tab col s6"><a href="#teacher">Teacher</a></li>
          </ul>
        </div>
        <div id="student" className="col s12">
          <div className="collection">
            {createCollection(classes.notifications.student)}
          </div>
        </div>
        <div id="teacher" className="col s12">
          <div className="collection">
            {createCollection(classes.notifications.teacher, 'TEACHER')}
          </div>
        </div>
      </div>
    </div>
  )
}