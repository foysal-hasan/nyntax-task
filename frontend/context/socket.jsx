import { useMemo } from "react"
import { createContext, useContext } from "react"
import { io } from 'socket.io-client'

const SocketContext = createContext(null)
export const useSocket = () => useContext(SocketContext)

const SocketProvider = ({ children }) => {
    const socket = useMemo(() => io('localhost:8080'), [])
    return <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
}

export default SocketProvider