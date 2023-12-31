import { useState, useEffect } from 'react'
import {io} from 'socket.io-client'
import { UlMensajes , LiMensaje} from './ui-components'
import './App.css'


const socket = io('http://localhost:3000')


function App() {

  const [isConnected, setIsConnected] = useState(false);

  const [nuevoMensaje, setNuevoMensaje] = useState('');

  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true))

      // conexion para enviar mensajes
    socket.on('chat_message', (data) => {
      setMensajes((mensajes) => [...mensajes, data]);
    });

    return () => {
      socket.off('connect')
      socket.off('chat_message')
    }

  }, []);

  // emitir mensaje al servidor
  const enviarMensaje = () => {

    socket.emit('chat_message', {
      usuario: socket.id,
      mensaje: nuevoMensaje
    })
  };
  

  return (
    <>
      <div className='App'>
        <h1>{isConnected ? 'CONECTADO' : 'ERROR'}</h1>

        <UlMensajes>
        {mensajes.map((mensaje, index) => (
          <LiMensaje key={index}>{mensaje.usuario} {mensaje.mensaje}</LiMensaje>
        ))}
        </UlMensajes>
        <input  
          onChange={e => setNuevoMensaje(e.target.value)}
          type="text"/>

        <button onClick={enviarMensaje} >Enviar</button>
      </div>
    </>
  )
}

export default App
