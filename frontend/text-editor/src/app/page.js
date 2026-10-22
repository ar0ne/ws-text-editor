import styles from "./page.module.css";
import TextEditor from "./components/text-editor";
import UserConnectionStatus from "./components/user-connection-status";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <UserConnectionStatus 
          userName="Alex" 
          isConnected='true' 
        />
        <TextEditor 
          value='foo'
        />
      </main>
    </div>
  );
}
