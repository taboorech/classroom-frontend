import { useEffect } from "react";
import M from "materialize-css";
import AuthForm from "../../components/AuthForm/AuthForm";
import { changeEmail, changeRegEmail, changePassword, changeRegPassword, changeConfirmPassword, changeRegLogin, signIn, signUp, changeSurname, changeName } from "../../redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import './Auth.scss';

export default function Auth(props) {

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registerValidate = () => auth.regEmail !== '' && auth.regLogin !== '' && auth.regPassword !== ''  && auth.regPassword === auth.confirmPassword && auth.surname !== '' && auth.name !== '';

  useEffect(() => {
    if(auth.isAuth) {
      navigate('/');
    }
    M.Tabs.init(document.querySelectorAll('.tabs'));
    M.updateTextFields();
  })

  useEffect(() => {
    document.title = "Authorization";
  }, []);

  return (
    <>
      <div className="Auth row">
        <div className="col s12">
          <ul className="tabs">
            <li className="tab col s6 l3 offset-l3"><a href="#login">Login</a></li>
            <li className="tab col s6 l3"><a href="#register">Registration</a></li>
          </ul>
        </div>
        {auth.error.length > 0 ?
        <ErrorMessage>
          {auth.error.map((error, index) => (
            <p key={`error-message-${index}`}>{error}</p>
          ))}
        </ErrorMessage> : null}
        <div id="login" className="col s10 offset-s1 m8 offset-m2 l6 offset-l3">
          <AuthForm onBtnClick={() => {
              dispatch(signIn({ email: auth.email, password: auth.password}));
            }} btnName = {'Login'}>
            <div className="input-field col s12">
              <input id="email" type="email" className="validate" value={auth.email} onChange={(event) => dispatch(changeEmail(event.target.value))} required />
              <label htmlFor="email">Email</label>
            </div>
            <div className="input-field col s12">
              <input id="password" type="password" value={auth.password} className="validate" onChange={(event) => dispatch(changePassword(event.target.value))} required />
              <label htmlFor="password">Password</label>
            </div>
          </AuthForm>
        </div>
        <div id="register" className="col s10 offset-s1 m8 offset-m2 l6 offset-l3">
          <AuthForm btnName = {'Registration'} onBtnClick={registerValidate() ? () => dispatch(signUp({ email: auth.regEmail, login: auth.regLogin, surname: auth.surname, name: auth.name, password: auth.regPassword})) : null } >
            <div className="input-field col s12">
              <input id="regEmail" type="email" value={auth.regEmail} className="validate" onChange={(event) => dispatch(changeRegEmail(event.target.value))} required />
              <label htmlFor="regEmail">Email</label>
              <span className="helper-text" data-error="Email must be correct"></span>
            </div>
            <div className="input-field col s12">
              <input id="regLogin" type="text" value={auth.regLogin} className="validate" onChange={(event) => dispatch(changeRegLogin(event.target.value))} required />
              <label htmlFor="regLogin">Login</label>
            </div>
            <div>
              <div className="input-field col s6">
                <input id="surname" value={auth.surname} onChange={(event) => dispatch(changeSurname(event.target.value))} type="text" className="validate" />
                <label htmlFor="surname">Surname</label>
              </div>
              <div className="input-field col s6">
                <input id="name" type="text" value={auth.name} onChange={(event) => dispatch(changeName(event.target.value))} className="validate" />
                <label htmlFor="name">Name</label>
              </div>
            </div>
            <div className="input-field col s12">
              <input id="regPassword" type="password" value={auth.regPassword} className="validate" minLength="5" onChange={(event) => dispatch(changeRegPassword(event.target.value))} required />
              <label htmlFor="regPassword">Password</label>
              <span className="helper-text" data-error="The field must be contain more than 4 symbols"></span>
            </div>
            <div className="input-field col s12">
              <input id="confirmPassword" type="password" value={auth.confirmPassword} className={auth.confirmPassword !== '' ? (auth.regPassword === auth.confirmPassword ? "valid" : "invalid") : ''} onChange={(event) => dispatch(changeConfirmPassword(event.target.value))} required />
              <label htmlFor="confirmPassword">Confirm password</label>
            </div>
          </AuthForm>
        </div>
      </div>
    </>
  )
}