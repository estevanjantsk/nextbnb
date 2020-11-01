const LoginModal = (props) => {
  return (
    <>
      <h2>Log in</h2>
      <div>
        <form>
          <input type="email" name="email" id="email" placeholder="Email address" />
          <input type="password" name="password" id="password" placeholder="Password" />
          <button>Log in</button>
        </form>
        <p>
          Don't have an account yet?{' '}
          <a href='#' onClick={() => props.showSignup() }>
            Sign up
          </a>
        </p>
      </div>
    </>
  )
}

export default LoginModal;