

export default function UserConnectionStatus({ userId, isConnected }) {
    return (
        <div>
            <span><b>User:</b> {userId}</span><br/>
            <span>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
    );
}