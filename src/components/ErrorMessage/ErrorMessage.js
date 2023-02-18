import './ErrorMessage.scss';

export default function ErrorMessage(props) {
  return (
    <div className="Error-message col s10 offset-s1 m8 offset-m2 l6 offset-l3">
      { props.children }
    </div>
  )
}