import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config'; // Asegúrate de que firebaseConfig.ts esté configurado correctamente
import { ref, onValue, push, set } from 'firebase/database';

interface Message {
  id: string;
  message: string;
  timestamp: number;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const messagesRef = ref(db, 'messages'); // Referencia a la colección de mensajes

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
    if (newMessage.trim() !== '') {
      const newMessageRef = push(messagesRef);
      set(newMessageRef, {
        message: newMessage,
        timestamp: Date.now(),
      });
      setNewMessage('');
    }
  };

  return (
    <div>
      <h2>Chat en Tiempo Real</h2>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            {message.message} - {new Date(message.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage}>
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

