import './Navbar.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import M from 'materialize-css';
import { logout } from '../../../redux/auth/authSlice';
import { setData, getClasses, notificationBlockChange } from '../../../redux/classes/classesSlice';
import NotificationsBlock from '../../NotificationsBlock/NotificationsBlock';
import { CSSTransition } from 'react-transition-group';
import Background from '../../Background/Background';

export default function Navbar(props) {

  const classes = useSelector((state) => state.classes);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    if(auth.isAuth) {
      dispatch(getClasses());
    }
  }, [dispatch, auth])

  useEffect(() => {
    M.Dropdown.init(document.querySelector('.dropdown-trigger'));
    M.Sidenav.init(document.querySelector('.sidenav'));
  }, [])

  return (
    <>
      <ul id="navbarDropdownMenu" className="dropdown-content" hidden={!auth.isAuth ? true : false} >
        {classes.classes.map((classObj, index) => {
          return(
            <li key={`dropdown-classes-${index}`} className={params.id === classObj._id ? 'active' : null}>
              <NavLink to={`/classes/${classObj._id}`}>{ classObj.title }</NavLink>
            </li>
          )
        })}
      </ul>
      <nav>
        <div className="nav-wrapper">
          <Link to={'/'} className="brand-logo">Logo</Link>
          <a href="#!" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
          <ul className="right hide-on-med-and-down">
            <li hidden={!auth.isAuth ? true : false} ><a href="#!" onClick={() => dispatch(notificationBlockChange())}><i className="material-icons right">{!!classes.notifications.student && !!classes.notifications.student ? 'notifications' : 'notifications_none'}</i></a></li>
            <li className={location.pathname === '/' ? 'active' : null} ><NavLink to={'/'}>Home</NavLink></li>
            <li hidden={!auth.isAuth ? true : false} ><a className="dropdown-trigger" href="#!" data-target="navbarDropdownMenu">Classes<i className="material-icons right">arrow_drop_down</i></a></li>
            <li><NavLink to={'/auth'} onClick={!!localStorage.getItem('accessToken') ? () => {dispatch(logout()); dispatch(setData())} : null} >{ auth.isAuth ? "Logout" : "Login" }</NavLink></li>
          </ul>
        </div>
      </nav>
      <NotificationsBlock open = {classes.notificationBlockOpen} />
      <CSSTransition in={classes.notificationBlockOpen} mountOnEnter unmountOnExit timeout={{
        enter: 700,
        exit: 700
      }}>
        <Background onClick={() => dispatch(notificationBlockChange())} /> 
      </CSSTransition>

      <ul className="sidenav" id="mobile-demo">
        <li className={location.pathname === '/' ? 'active' : null} ><NavLink to={'/'}>Home</NavLink></li>
        <li><NavLink to={'/auth'} onClick={auth.isAuth ? () => {dispatch(logout()); dispatch(setData())} : null} >{ auth.isAuth ? "Logout" : "Login" }</NavLink></li>
        <hr/>
        <h5 hidden={!auth.isAuth ? true : false} >Classes: </h5>
        {classes.classes.map((classObj, index) => {
          return(
            <li key={`dropdown-classes-${index}`} className={params.id === classObj._id ? 'active' : null}>
              <NavLink to={`/classes/${classObj._id}`}>{ classObj.title }</NavLink>
            </li>
          )
        })}
      </ul>
    </>
  )
}