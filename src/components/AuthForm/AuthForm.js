export default function AuthForm(props) {
  return (
    <div className="row">
      { props.children }
      <button className="col s12 m6 offset-m3 l3 offset-l8 waves-effect waves-light btn" onClick={ props.onBtnClick } >{ props.btnName }</button>
    </div>
  )
}