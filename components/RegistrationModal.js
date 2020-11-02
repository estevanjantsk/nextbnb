const RegistrationModal = (props) => {
  return (
    <>
      <h2>Sign up</h2>
      <div>
        <form onSubmit={(e) => {
          e.preventDefault();
          console.log('RegistrationModal submited');
        }}>
          <input type="email" name="email" id="email" placeholder="Email address" />
          <input type="password" name="password" id="password" placeholder="Password" />
          <input type="password" name="passwordconfirmation" id="passwordconfirmation" placeholder="Enter password again" />

          <button>Sign up</button>
        </form>
        <p>
          Already have an account?{' '}
          <a href='#' onClick={() => props.showLogin()}>
            Log in
          </a>
        </p>
      </div>
    </>
  )
}

export default RegistrationModal;