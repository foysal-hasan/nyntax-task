import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../context/socket'

export default function Home() {
  const [name, setName] = useState('')
  const [roomId, setRoomId] = useState('')
  const navigate = useNavigate()
  const { socket } = useSocket()

  const handleClick = () => {
    socket.emit('join-room', {name, roomId})
    // console.log(name, "room number => ", roomId)
    navigate(`/${roomId}`)
  }
  return (
    <div>
        <h3>Join Room</h3>
         <br />

        {/*<input type="text" onChange={e => setName(e.target.value)} /> */}
        <label htmlFor="">Room ID</label>
        <br />
        <input type="text" onChange={e => setRoomId(e.target.value)} />
        <br />
        <br />
        <button onClick={handleClick}>Join</button>
    </div>
  )
}
