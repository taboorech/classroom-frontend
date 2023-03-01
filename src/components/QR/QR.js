import QRCode from 'react-qr-code';
import M from 'materialize-css';
import './QR.scss';

export default function QR(props) {
  
  const copyButtonClick = async () => {
    try {
      await navigator.clipboard.writeText(props.secondaryContent);
      M.toast({html: 'Access Token is copied'});
    } catch (error) {
      M.toast({html: error});
    }
  }

  return (
    <div className={props.isOpen ? 'QR '.concat('open') : 'QR'} onClick = { props.onBackClick }>
      <div>
        <h4>{ props.titleText }</h4>
        <QRCode value={ props.QRvalue } />
        <h5>{ props.secondaryContent } <i className="material-icons" onClick={copyButtonClick}>content_copy</i></h5>
      </div>
    </div>
  )
}