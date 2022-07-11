import { NextUIProvider } from "@nextui-org/react"
import LayoutDefault from "../components/layout"
import { AppContextProvider } from "../context/appContext"

function MyApp({ Component, pageProps }) {
  return (
    <NextUIProvider>
      <AppContextProvider>
        <LayoutDefault>
          <Component {...pageProps} />
        </LayoutDefault>
      </AppContextProvider>
    </NextUIProvider>
  )
}

export default MyApp
