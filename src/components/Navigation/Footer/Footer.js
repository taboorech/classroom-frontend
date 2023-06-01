import './Footer.scss';

export default function Footer() {
  return (
    <footer className="page-footer">
      <div className="container">
        <div className="row">
          <div className="col l6 s12">
            <h5 className="white-text">Classroom</h5>
            <p className="grey-text text-lighten-4">Project created as a copy of Google Classroom for distance learning</p>
          </div>
          <div className="col l4 offset-l2 s12">
            <h5 className="white-text">Feedback</h5>
            <ul>
              <li><a className="grey-text text-lighten-3" href="https://github.com/taboorech">GitHub</a></li>
              <li><a className="grey-text text-lighten-3" href="https://mail.google.com/mail/u/1/?ogbl#inbox?compose=CllgCJlFlwZKMdscDjRVtgWQhXQxbjFhfDVbVrsBBTtdcFZmbJTLSdbGVtzFZBzrQcgzKrMnFlB">Gmail</a></li>
              <li><a className="grey-text text-lighten-3" href="https://t.me/taboorech">Telegram</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        <div className="container">
        
        </div>
      </div>
    </footer>
  )
}