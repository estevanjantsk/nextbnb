import { useState } from "react";
import axios from "axios";

const RegistrationModal = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordconfirmation, setPasswordconfirmation] = useState('')

  const submit = async () => {
    try {
      const response = await axios.post('/api/auth/register', {
        email, password, passwordconfirmation
      })
      if (response.data.status === 'error') {
        alert(response.data.message)
        return
      }
    } catch (error) {
      alert(error.response.data.message)
      return
    }
  }

  return (
    <>
      <h2>Sign up</h2>
      <div>
        <form onSubmit={(e) => {
          e.preventDefault();
          console.log(email, password, passwordconfirmation);
          console.log('RegistrationModal submited');
          submit();
        }}>
          <input 
            type="email"
            name="email"
            id="email"
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value) } />
          <input type="password"
            name="password" 
            id="password" 
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value) } />
          <input 
            type="password"
            name="passwordconfirmation" 
            id="passwordconfirmation"
            placeholder="Enter password again"
            onChange={(e) => setPasswordconfirmation(e.target.value) } />

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