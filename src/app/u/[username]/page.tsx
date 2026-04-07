'use client'

import { useState, useEffect } from 'react'
import { Send, User, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'

export default function SendMessage({ params }: { params: { username: string } }) {
  const [message, setMessage] = useState('')
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [userLoading, setUserLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const findUser = async () => {
      try {
        const usersQuery = query(
          collection(db, 'users'),
          where('username', '==', params.username)
        )
        const snapshot = await getDocs(usersQuery)
        
        if (snapshot.empty) {
          setError('Usuario no encontrado')
          setUserLoading(false)
          return
        }
        
        const userDoc = snapshot.docs[0].data()
        setUserData(userDoc)
        setUserLoading(false)
      } catch (err) {
        console.error('Error buscando usuario:', err)
        setError('Error al cargar usuario')
        setUserLoading(false)
      }
    }

    findUser()
  }, [params.username])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !userData) return

    setLoading(true)
    setError('')

    try {
      await addDoc(collection(db, 'messages'), {
        recipientId: userData.uid,
        content: message.trim(),
        createdAt: new Date()
      })

      setSuccess(true)
      setMessage('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error enviando mensaje:', error)
      setError('Error al enviar mensaje. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (userLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Cargando perfil...</div>
      </div>
    )
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={40} />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-red-400">Usuario no encontrado</h1>
          <p className="text-gray-400 mb-6">El usuario "{params.username}" no existe en NGL Cuba</p>
          <button
            onClick={() => router.push('/')}
            className="py-2 px-4 neon-button neon-border rounded-lg"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => router.push('/')}
          className="mb-6 text-red-400 hover:text-red-300 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>Volver</span>
        </button>

        {/* User Profile */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            {userData?.photoURL ? (
              <img src={userData.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={40} />
            )}
          </div>
          <h1 className="text-2xl font-bold mb-2">{userData?.username}</h1>
          <p className="text-gray-400">Envía un mensaje anónimo</p>
        </div>

        {/* Message Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            className="w-full p-4 bg-gray-900 border-2 border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none resize-none"
            rows={4}
            maxLength={500}
            required
          />
          
          <div className="text-right text-sm text-gray-400">
            {message.length}/500 caracteres
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border-2 border-red-500 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-500/20 border-2 border-green-500 rounded-lg text-green-300 text-sm">
              ¡Mensaje enviado exitosamente!
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="w-full py-3 neon-button neon-border rounded-xl font-semibold text-white flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
            <span>{loading ? 'Enviando...' : 'Enviar mensaje'}</span>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>NGL Cuba - Mensajes anónimos seguros</p>
        </div>
      </div>
    </div>
  )
}
