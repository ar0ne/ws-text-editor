import styles from "./page.module.css";
import TextEditor from "./components/text-editor";
import UserConnectionStatus from "./components/user-connection-status";
import { useUserId } from "./hooks/useUserId";


export default function Home() {

  const userId = useUserId();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <UserConnectionStatus 
          userId={userId}
          isConnected='true' 
        />
        <TextEditor 
          value='foo'
        />
      </main>
    </div>
  );
}
