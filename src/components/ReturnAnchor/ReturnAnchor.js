import { Link } from 'react-router-dom';
import './ReturnAnchor.scss';

export default function ReturnAnchor(props) {
  return (
    <div className='navigationBlock'>
      <Link to={props.link}>
        <h5>&lt; { props.title }</h5>
        <p>{ props.secondaryContent }</p>
      </Link>
    </div>
  )
}