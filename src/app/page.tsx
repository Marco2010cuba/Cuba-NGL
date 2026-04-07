'use client'

import { useState, useEffect } from 'react'
import { Copy, Share2, MessageSquare, LogOut, User, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Demo Firebase using localStorage
const demoAuth = {
  currentUser: null,
  onAuthStateChanged: (callback: any) => {
    const user = localStorage.getItem('ngl_user')
    if (user) {
      callback(JSON.parse(user))
    } else {
      callback(null)
    }
  },
  signOut: async () => {
    localStorage.removeItem('ngl_user')
  }
}

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = demoAuth.onAuthStateChanged((currentUser: any) => {
      setUser(currentUser)
      
      // Get messages from localStorage
      const messagesData = JSON.parse(localStorage.getItem('ngl_messages') || '[]')
      const userMessages = messagesData.filter((msg: any) => msg.recipientId === currentUser?.uid)
      setMessages(userMessages)
      setLoading(false)
    })

    return () => {}
  }, [])

  const handleCopyLink = () => {
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
      await demoAuth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const showRegister = () => {
    const username = prompt('Nombre de usuario:')
    const password = prompt('Contraseña:')
    
    if (username && password) {
      const newUser = {
        uid: 'demo_' + Math.random().toString(36).substr(2, 9),
        displayName: username,
        email: username + '@nglcuba.com'
      }
      localStorage.setItem('ngl_user', JSON.stringify(newUser))
      setUser(newUser)
    }
  }

  const showLogin = () => {
    const username = prompt('Nombre de usuario:')
    const password = prompt('Contraseña:')
    
    if (username && password) {
      const newUser = {
        uid: 'demo_' + Math.random().toString(36).substr(2, 9),
        displayName: username,
        email: username + '@nglcuba.com'
      }
      localStorage.setItem('ngl_user', JSON.stringify(newUser))
      setUser(newUser)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2" style={{color: '#ff0040', textShadow: '0 0 10px #ff0040'}}>
              NGL Cuba
            </h1>
            <p className="text-gray-400">Plataforma de Mensajes Anónimos</p>
          </div>

          <div className="space-y-4">
            <div className="neon-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Comenzar</h2>
              <div className="space-y-3">
                <button 
                  onClick={showRegister}
                  className="neon-button block text-center py-3 px-6 rounded-lg text-white font-semibold w-full"
                >
                  Crear Cuenta
                </button>
                <button 
                  onClick={showLogin}
                  className="neon-button block text-center py-3 px-6 rounded-lg text-white font-semibold w-full"
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>

            <div className="neon-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Acerca del Creador</h2>
              <div className="text-gray-300">
                <p className="mb-2">Email: marco@nglcuba.com</p>
                <p className="mb-2">WhatsApp: +53 1234 5678</p>
                <p>Hecho para la comunidad cubana</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-gray-900 border-b-2 border-red-500 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <User size={24} />
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

      <div className="max-w-4xl mx-auto p-4">
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
              className="py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white flex items-center justify-center space-x-2 transition-colors"
            >
              <MessageSquare size={18} />
              <span>Ver mensajes ({messages.length})</span>
            </button>
          </div>
        </div>

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
                    {message.createdAt ? 
                      new Date(message.createdAt).toLocaleString() :
                      'Fecha no disponible'
                    }
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
