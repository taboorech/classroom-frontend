import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getClassInfo, setOpen } from '../../redux/classInfo/classInfoSlice';
import M from 'materialize-css';
import './ClassInfo.scss';
import Lesson from '../../components/Lesson/Lesson';

export default function ClassInfo(props) {

  const classInfo = useSelector((state) => state.classInfo);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getClassInfo({ id }));
  }, [dispatch, id])

  useEffect(() => {
    const tabs = document.querySelectorAll('.tabs');
    M.Tabs.init(tabs);
  }, [])

  useEffect(() => {
    const tabs = document.querySelectorAll('.tabs');
    const instance = M.Tabs.getInstance(tabs[0]);
    instance.updateTabIndicator();
  })

  return (
    <div className='row'>
      <div className={'general-info col s12 m8 offset-m2 blue-grey darken-1 white-text'}>
        <h4>
          { classInfo.info.title }
        </h4>
        <p>
          <span>
            { classInfo.info.description }
          </span>
          <span>
            {`Access token: ${ classInfo.info.accessToken }`}
          </span>
        </p>
      </div>
      <div className="col s12 m8 offset-m2">
        <div className="col s12">
          <ul className="tabs">
            <li className={"tab col ".concat(classInfo.owner ? "s4" : "s6")}><a href="#lessonsBlock">Test 1</a></li>
            <li className={"tab col ".concat(classInfo.owner ? "s4" : "s6")}><a href="#test2">Test 2</a></li>
            {classInfo.owner ?
            <li className="tab col s4"><a href="#test3">Test 3</a></li> : null}
          </ul>
        </div>
        <div id="lessonsBlock" className="col s12">
          <div className="collection">
            { classInfo.info.lessons ? classInfo.info.lessons.map((lesson, index) => (
              <Lesson 
                key={`lesson-${index}`} 
                title={ lesson.title } 
                description={ lesson.description } 
                attachedElements = { lesson.attachedElements }
                className = { classInfo.isOpen === index ? 'active' : "" }
                onClick = {() => { dispatch(setOpen(index)) }}
              />
              // <Link key={`lesson-${index}`} to={`/classes/${id}/${lesson._id}`} className="collection-item">Alvin</Link>
            )) : null }
          </div>
        </div>
        <div id="test2" className="col s12">Test 2</div>
        {classInfo.owner ?
        <div id="test3" style={{display: 'none'}} className="col s12">Test 3</div> : null}
      </div>
    </div>
  )
}