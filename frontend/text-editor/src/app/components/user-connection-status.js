

export default function UserConnectionStatus({ userName, isConnected }) {
    return (
        <div>
            <span><b>Username:</b> {userName}</span><br/>
            <span>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
    );
}