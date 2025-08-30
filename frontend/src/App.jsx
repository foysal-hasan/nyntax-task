
import SocketProvider from '../context/socket'
import Game from '../pages/Game'
import Home from '../pages/Home'
import './App.css'
import { Routes, Route} from 'react-router-dom'
function App() {

  return (
    <>
    <SocketProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/:roomId' element={<Game />} />
      </Routes>
      </SocketProvider>
    </>
  )
}

export default App
