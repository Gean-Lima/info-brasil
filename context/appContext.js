import { createContext, useState } from 'react'

const AppContext = createContext()

export default AppContext

export function AppContextProvider({children}) {
  const [rootModal, setRootModal] = useState({
    active: false,
    message: ''
  })

  return <AppContext.Provider value={{
    state: {
      rootModal
    },
    setRootModal
  }}>{children}</AppContext.Provider>
}