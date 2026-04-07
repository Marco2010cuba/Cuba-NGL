'use client'

import { useState, useEffect } from 'react'
import { Copy, Share2, MessageSquare, LogOut, User, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push('/login')
        return
      }
      
      setUser(currentUser)
      
      // Escuchar mensajes en tiempo real
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
      
      return () => {
        unsubscribeMessages()
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleCopyLink = () => {
    // Usar URL base estática para evitar errores de window
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://nglcuba.vercel.app'
    const link = `${baseUrl}/u/${user?.displayName}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareWhatsApp = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://nglcuba.vercel.app'
    const link = `${baseUrl}/u/${user?.displayName}`
    const text = `Envíame un mensaje anónimo en NGL Cuba: ${link}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b-2 border-red-500 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={24} />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold">{user?.displayName}</h1>
              <p className="text-gray-400 text-sm">Tu perfil NGL Cuba</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 transition-colors flex items-center space-x-2"
          >
            <LogOut size={20} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Link Section */}
        <div className="bg-gray-900 rounded-xl p-6 mb-6 border-2 border-red-500 neon-border">
          <h2 className="text-lg font-semibold mb-4">Tu Link Personal</h2>
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <code className="text-green-400 break-all">
              {process.env.NEXT_PUBLIC_BASE_URL || 'https://nglcuba.vercel.app'}/u/{user?.displayName}
            </code>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Comparte este link para recibir mensajes anónimos
          </p>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleCopyLink}
              className="py-3 px-4 neon-button rounded-lg font-semibold text-white flex items-center justify-center space-x-2 neon-border"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              <span>{copied ? '¡Copiado!' : 'Copiar link'}</span>
            </button>
            
            <button
              onClick={handleShareWhatsApp}
              className="py-3 px-4 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-white flex items-center justify-center space-x-2 transition-colors"
            >
              <Share2 size={18} />
              <span>Compartir WhatsApp</span>
            </button>
            
            <button
              onClick={() => router.push('/messages')}
              className="py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white flex items-center justify-center space-x-2 transition-colors"
            >
              <MessageSquare size={18} />
              <span>Ver mensajes ({messages.length})</span>
            </button>
          </div>
        </div>

        {/* Messages Preview */}
        <div className="bg-gray-900 rounded-xl p-6 border-2 border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Mensajes Recientes</h2>
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <MessageSquare size={48} className="mx-auto mb-4" />
              <p>No tienes mensajes aún</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.slice(0, 3).map((message) => (
                <div key={message.id} className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-white mb-2">{message.content}</p>
                  <p className="text-gray-400 text-xs">
                    {message.createdAt?.toDate ? 
                      new Date(message.createdAt.toDate()).toLocaleString() :
                      'Fecha no disponible'
                    }
                  </p>
                </div>
              ))}
              {messages.length > 3 && (
                <button
                  onClick={() => router.push('/messages')}
                  className="w-full py-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  Ver todos los mensajes ({messages.length - 3} más)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
