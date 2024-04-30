import React, { useEffect, useCallback, useState} from 'react';
import { useSocket } from '../context/SocketProvider';

const RoomPage = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const handleUserJoined = useCallback(({name, age, city, id }) => {
        console.log(` ${name} joined room`);
        setRemoteSocketId(id);
      }, []);

    const handleWelcomeMessageFromAdmin = useCallback(() => {
        console.log("Welcome message from admin:");
    }, []);

    useEffect(() => {
        socket.on('user:joined', handleUserJoined);
        socket.on('welcome-message-from-admin', handleWelcomeMessageFromAdmin);

        return () => {
            socket.off('user:joined', handleUserJoined );
            socket.off('welcome-message-from-admin', handleWelcomeMessageFromAdmin);
        }
      }, [socket, handleUserJoined, handleWelcomeMessageFromAdmin]);

    return (
        <div>
            <h1>Room Page</h1>
            <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
        </div>
    )
}

export default RoomPage;