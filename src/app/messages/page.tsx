'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'

export default function Messages() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push('/login')
        return
      }
      
      const messagesQuery = query(
        collection(db, 'messages'),
        where('recipientId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      )
      
      const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
        const messagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setMessages(messagesData)
        setLoading(false)
      })
      
      return () => unsubscribeMessages()
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Cargando mensajes...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b-2 border-red-500 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => router.push('/dashboard')} className="mr-4 text-red-400">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold">Tus Mensajes</h1>
          </div>
          <div className="text-gray-400">
            Total: {messages.length} mensajes
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="max-w-4xl mx-auto p-4">
        {messages.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <MessageSquare size={64} className="mx-auto mb-4" />
            <p className="text-xl mb-2">No tienes mensajes aún</p>
            <p className="text-sm">Comparte tu link para recibir mensajes anónimos</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="bg-gray-900 rounded-xl p-6 border-2 border-gray-700 hover:border-red-500 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <p className="text-white flex-1 text-lg">{message.content}</p>
                  <div className="ml-4 text-xs text-gray-400 whitespace-nowrap">
                    Anónimo
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-400 text-sm">
                    {message.createdAt?.toDate ? 
                      new Date(message.createdAt.toDate()).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) :
                      'Fecha no disponible'
                    }
                  </p>
                  <div className="flex space-x-2">
                    <button className="text-red-400 hover:text-red-300 text-sm">
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
