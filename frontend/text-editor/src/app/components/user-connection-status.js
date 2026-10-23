"use client";

import { useUserId } from "../hooks/useUserId";

export default function UserConnectionStatus({ isConnected }) {
    
    const userId = useUserId();

    return (
        <div>
            <span><b>User:</b> {userId}</span><br/>
            <span>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
    );
}