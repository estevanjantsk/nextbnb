import { StoreProvider } from "easy-peasy";
import NextApp from "next/app";
import store from "../store";

function App({ Component, pageProps, user }) {
  if (user) {
    store.getActions().user.setUser(user)
  }

  return (
    <StoreProvider store={store}>
      <Component {...pageProps} />
    </StoreProvider>
  )
}

App.getInitialProps = async (appContext) => {
  const appProps = await NextApp.getInitialProps(appContext)

  let user = null
  if (
    appContext.ctx.req &&
    appContext.ctx.req.session &&
    appContext.ctx.req.session.passport &&
    appContext.ctx.req.session.passport.user
  ) {
    user = appContext.ctx.req.session.passport.user
  }

  return { ...appProps, user: user }
}

export default App;