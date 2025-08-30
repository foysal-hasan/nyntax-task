import React from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import axois from 'axios'
import { useSocket } from '../context/socket'
import { useEffect } from 'react'

export default function Game() {
    const { roomId } = useParams()
    const [words, setWords] = useState([])
    const [myWords, setMyWords] = useState([])
    const [remoteWords, setRemoteWords] = useState([])
    const [myScore, setMyScore] = useState(1)
    const [remoteScore, setRemoteScore] = useState(1)
    const [wordInput, setWordInput] = useState('')
    const [remoteInput, setRemoteInput] = useState('')
    const [error, setError] = useState('')
    const [yourTurn, setYourTurn] = useState(false)
    const [winner, setWinner] = useState(null)

    const { socket } = useSocket()


    // validations 
    // word validation
    const handleSubmit = async () => {
        try {
            if (wordInput.length < 4) {
                setError("Atleast 4 letter")
                return;
            }
            if(words.includes(wordInput)){
                setError('Word already in use')
                return
            }
            await axois(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordInput}`)
            setWords(prev => [...prev, wordInput])
            setMyWords(prev => [wordInput, ...prev])
            setMyScore(prev =>  prev - (wordInput.length - 4))

            setWordInput('')
            setYourTurn(false)
            socket.emit('remote-score', myScore - (wordInput.length - 4))
            socket.emit('remote-word', wordInput)
            socket.emit('remote-input', '')
            socket.emit('turn', '')

            if (myScore - (wordInput.length - 4) <= 0) {
                setWinner('You')
            }
        } catch (error) {
            setError("Use valid english word")
        }
    }

    const handleWordInput = (e) => {
        const value = e.target.value
        setWordInput(value)
        socket.emit('remote-input', value)
        

        // start with last word's last letter
        let l = null;

        if (words.length > 0) {
            const word = words[words.length - 1]
            l = word[word.length - 1]
        }

        if (l && !value.startsWith(l)) {
            setError("last letter doesn't match")
        }
        else {
            setError("")
        }

    }

    const handleRemoteInput = (remoteInput) => {

        setRemoteInput(remoteInput)
    }

    const handleRemoteWord = (remoteWord) => {
        setWords(prev => [...prev, remoteWord])
        setRemoteWords(prev => [remoteWord, ...prev])
    }

    const handleRemoteScore = (rs) => {
        if(rs <= 0) {
            setWinner('Your Friend')
        }
        setRemoteScore(rs)
    }

    const handleTurn = () => {
        setYourTurn(true)
    }

    useEffect(()=> {
        socket.on('remote-input', handleRemoteInput)
        socket.on('remote-word', handleRemoteWord)
        socket.on('remote-score', handleRemoteScore)
        socket.on('turn', handleTurn)

        return ()=> {
            socket.off('remote-input', handleRemoteInput)
            socket.off('remote-word', handleRemoteWord)
        socket.off('remote-score', handleRemoteScore)
        socket.off('turn', handleTurn)


        }
    }, [])

    if(winner){
        return <h1>{winner} Won</h1>
    }

    return (
       <>
        <h1>{yourTurn ? "Your Turn": "Friend Turn"}</h1>
        
        <div className='flex gap-5'>
            <div>
                <h3>You {myScore}</h3>
                <div>
                    <div>
                        <input type="text" onChange={handleWordInput} value={wordInput} className={`${!yourTurn? "bg-gray-100": ''}`} disabled={!yourTurn} />
                        <button onClick={handleSubmit} disabled={!yourTurn}>submit</button>
                    </div>
                    {error && <p className='text-red-500'>{error}</p>}
                </div>
                <div>
                    {myWords?.map(word => <p>{word}</p>)}
                </div>
            </div>

            <div>
                <h3>Friend {remoteScore}</h3>
                <div>
                    <div>
                        <input type="text" value={remoteInput} />
                        {/* <button onClick={handleSubmit}>submit</button> */}
                    </div>
                    {/* {error && <p className='text-red-500'>{error}</p>} */}
                </div>
                <div>
                    {remoteWords?.map(word => <p>{word}</p>)}
                </div>
            </div>
        </div>
        </>
    )
}
