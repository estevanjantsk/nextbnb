import Link from "next/link";
import { useStoreActions, useStoreState } from "easy-peasy";
import axios from "axios";

const Header = () => {
  const user = useStoreState(state => state.user.user)
  const setShowLoginModal = useStoreActions(actions => {
    return actions.modals.setShowLoginModal
  });
  const setShowRegistrationModal = useStoreActions(actions => {
    return actions.modals.setShowRegistrationModal
  });
  const setUser = useStoreActions(actions => {
    return actions.user.setUser
  })

  return (
    <div className="nav-container">
      <Link href="/">
        <a>
          <img src="/img/logo.png" alt="Logo" />
        </a>
      </Link>
      <nav>
        <ul>
          {user ? (
            <>
              <li className="username">{user}</li>
              <li>
                <Link href="/bookings">
                  <a>Bookings</a>
                </Link>
              </li>
              <li>
                <Link href='/host'>
                  <a>Your Houses</a>
                </Link>
              </li>
              <li>
                <Link href='/host/new'>
                  <a>Add House</a>
                </Link>
              </li>
              <li>
                <a href="#" onClick={async () => {
                  await axios.post('/api/auth/logout')
                  setUser(null)
                }}>Log out</a>
              </li>
            </>
          ) : (
              <>
                <li>
                  <a href='#' onClick={() => setShowRegistrationModal()}>Sign up</a>
                </li>
                <li>
                  <a href='#' onClick={() => setShowLoginModal()}>Log in</a>
                </li>
              </>
            )}

        </ul>
      </nav>

      <style jsx>{`
      .nav-container {
        border-bottom: 1px solid #eee;
        height: 50px;
        display: flex;
        justify-content: space-between;
        padding: 0 10px 0 0;
      }
      
      ul {
        height: 100%;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        list-style-type: none;
      }

      a {
        text-decoration: none;
        display: block;
        margin-right: 15px;
        color: #333;
      }

      nav a {
        padding: 1em 0.5em;
      }
    `}</style>
    </div>
  )
};

export default Header;