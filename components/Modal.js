const Modal = (props) => {

  return (
    <div className="nav-container">
      <div 
        className="modal-background"
        onClick={() => {
          props.close();
        }}
      >
        <div className="modal" onClick={(e) => e.stopPropagation() }>{props.children}</div>
      </div>

      <style jsx>{`
        .modal-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal {
          width: calc(100vw - 4em);
          max-width: 32em;
          max-height: calc(100vh - 4em);
          overflow: auto;
          padding: 1em;
          border-radius: 0.2em;
          background: white;
        }
      `}</style>
    </div>
  )
}

export default Modal;