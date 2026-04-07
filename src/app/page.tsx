'use client'

import { useState } from 'react'
import { UserPlus, LogIn, ChevronDown, ChevronUp, Phone, Mail, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [showCreatorInfo, setShowCreatorInfo] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const router = useRouter()

  const handleCreateAccount = () => {
    router.push('/register')
  }

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      {/* Main container */}
      <div className="w-full max-w-md">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            NGL Cuba
          </h1>
          <p className="text-xl text-gray-300">Recibe mensajes anónimos</p>
        </div>

        {/* Action buttons */}
        <div className="space-y-4 mb-8">
          <button
            onClick={handleCreateAccount}
            className="w-full py-4 px-6 neon-button rounded-xl font-semibold text-white flex items-center justify-center space-x-3 neon-border"
          >
            <UserPlus size={20} />
            <span>Crear cuenta</span>
          </button>

          <button
            onClick={handleLogin}
            className="w-full py-4 px-6 bg-gray-900 hover:bg-gray-800 rounded-xl font-semibold text-white flex items-center justify-center space-x-3 border-2 border-gray-700 hover:border-red-500 transition-all duration-200"
          >
            <LogIn size={20} />
            <span>Iniciar sesión</span>
          </button>
        </div>

        {/* Creator info section */}
        <div className="text-center">
          <button
            onClick={() => setShowCreatorInfo(!showCreatorInfo)}
            className="text-red-400 hover:text-red-300 transition-colors flex items-center justify-center space-x-2 mx-auto"
          >
            <span>Información del creador</span>
            {showCreatorInfo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* Expandable creator info */}
          {showCreatorInfo && (
            <div className="mt-4 p-6 bg-gray-900 rounded-xl border-2 border-red-500 neon-border">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <Phone className="text-red-500" size={20} />
                  <a href="https://wa.me/+5351234567" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 transition-colors">
                    +53 5123 4567
                  </a>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Mail className="text-red-500" size={20} />
                  <a href="mailto:contacto@nglcuba.com" className="text-red-400 hover:text-red-300 transition-colors">
                    contacto@nglcuba.com
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
