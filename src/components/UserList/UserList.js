import { useDispatch } from 'react-redux';
import { addOwner, removeOwner, removeFromClassroom } from '../../redux/classInfo/classInfoSlice';
import './UserList.scss';

export default function UserList(props) {
  const dispatch = useDispatch();

  const removeOwnerOnClick = (ownerId) => {
    let confirmMessage = window.confirm('Are you sure to remove owner?');
    if(props.isOwner && confirmMessage)
      dispatch(removeOwner({ id: props.classId , userId: ownerId }))
  }

  const removeFromClassroomOnClick = (memberId) => {
    let confirmMessage = window.confirm('Are you sure to remove this member?');
    if(props.isOwner && confirmMessage)
      dispatch(removeFromClassroom({ id: props.classId , userId: memberId }));
  }

  const addOwnerOnClick = (memberId) => {
    let confirmMessage = window.confirm('Are you sure to add owner?');
    if(props.isOwner && confirmMessage)
      dispatch(addOwner({ id: props.classId , userId: memberId }));
  }

  const owners = (owners, isOwner) => {
    return owners.map((owner, index) => (
      <li key={`owners-list-object-${index}`} className="collection-item">
        <div>
          { `${owner.surname} ${owner.name}` }
          { isOwner && index !== 0 ?
          <div className="secondary-content">
            <a href="#!" className="red-text tooltipped" onClick={() => removeOwnerOnClick(owner._id)} a-position="bottom" data-tooltip="Remove from owners">
              <i className="material-icons">remove_circle</i>
            </a>
          </div> : null }
        </div>
      </li>
    ))
  }

  const members = (members, isOwner) => {
    return members.map((member, index) => (
      <li key={`members-list-object-${index}`} className="collection-item">
        <div>
          { `${member.surname} ${member.name}` }
          { isOwner ?
          <div className="secondary-content members">
            {/* <Link to="#!" className="green-text tooltipped" a-position="bottom" data-tooltip="Check user works">
              <i className="material-icons">check_box</i>
            </Link> */}
            <a href="#!" className="green-text tooltipped" onClick={() => addOwnerOnClick(member._id)} a-position="bottom" data-tooltip="Raise to owners">
              <i className="material-icons">arrow_upward</i>
            </a>
            <a href="#!" className="red-text tooltipped" onClick={() => removeFromClassroomOnClick(member._id)} a-position="bottom" data-tooltip="Remove from classroom">
              <i className="material-icons">clear</i>
            </a>
          </div> : null }
        </div>
      </li>
    ))
  }

  return (
    <>
      <h5>Owners: </h5>
      <ul className="collection z-depth-1">
        { props.owners ? owners(props.owners, props.isOwner) : null }
      </ul>
      <h5>Members: </h5>
      <ul className="collection z-depth-1">
        { props.members ? members(props.members, props.isOwner) : null }
      </ul>
    </>
  )
}