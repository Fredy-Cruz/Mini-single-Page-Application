import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { ref, onValue, push, set } from "firebase/database";
import styles from "./Chat.module.css";

//Interfaz para los mensajes de firebase
interface Message {
  id: string;
  message: string;
  timestamp: number;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const messagesRef = ref(db, "messages"); // Referencia a la colección de mensajes

  useEffect(() => {
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messagesData: Message[] = [];
      snapshot.forEach((childSnapshot) => {
        const message: Message = {
          id: childSnapshot.key,
          message: childSnapshot.val().message,
          timestamp: childSnapshot.val().timestamp,
        };
        messagesData.push(message);
      });
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      const newMessageRef = push(messagesRef);
      set(newMessageRef, {
        message: newMessage,
        timestamp: Date.now(),
      });
      setNewMessage("");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Chat en Tiempo Real</h1>
      </div>

      <div className={styles.messages}>
        <ul className={styles.list}>
          {messages.map((message) => (
            <li key={message.id}>
              <div className={styles.list_message}>
                <h3>{message.message}</h3>
              </div>
              <div className={styles.list_date}>
                <h3>{new Date(message.timestamp).toLocaleString()}</h3>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSendMessage} className={styles.form}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Chat;
