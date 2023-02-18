import './Lesson.scss';

export default function Lesson(props) {
  return (
    <div className={'Lesson col s12 '.concat(props.className)}>
      <div className={'title-block'} onClick = { props.onClick }>
        { props.title }
      </div>
      <div className='lesson-body'>
        <div className='description-block'>
          { props.description }
        </div>
        <div className='attachments-block'>
          {/* { props.attachedElements.map(() => (
            <p>F</p>
          )) } */}
        </div>
      </div>
    </div>
  )
}