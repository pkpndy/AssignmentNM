import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useSocket} from '../context/SocketProvider';

const LobbyScreen = () => {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [city, setCity] = useState("");
    const [room, setRoom] = useState("");

    const socket = useSocket();
    const navigate = useNavigate();

    const handleWelcome = useCallback(() => {
        socket.emit('welcome-message', {name, room});
    },[socket, name, room]);

    const handleSubmitForm = useCallback((e) => {
        e.preventDefault();
        socket.emit("room:join", {name, age, city, room});
    }, [name, age, city, room, socket]);

    const handleJoinRoom = useCallback((data) => {
        const {room} = data;
        navigate(`/room/${room}`);
    }, [navigate])

    useEffect(() => {
        socket.on("room:join", handleJoinRoom);
        return () => {
            socket.off("room:join", handleJoinRoom);
        }
    }, [socket, handleJoinRoom]);

    return(
        <div>
            <h1>Lobby</h1>
            <form onSubmit={handleSubmitForm}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                <br />
                <label htmlFor="age">Age</label>
                <input type="number" id="age" value={age} onChange={e => setAge(e.target.value)} />
                <br />
                <label htmlFor="city">City</label>
                <input type="text" id="city" value={city} onChange={e => setCity(e.target.value)} />
                <br />
                <label htmlFor="room">Room Number</label>
                <input type="text" id="room" value={room} onChange={e => setRoom(e.target.value)} />
                <br />
                <button type="submit">Join</button>
                <br />
                <button onClick={handleWelcome}>Welcome!</button>
            </form>
        </div>
    )
}

export default LobbyScreen;