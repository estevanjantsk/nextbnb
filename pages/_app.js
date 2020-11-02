import { StoreProvider } from "easy-peasy";
import store from "../store";

function App({ Component, pageProps }) {
  return (
    <StoreProvider store={store}>
      <Component {...pageProps} />
    </StoreProvider>
  )
}

export default App;