'use client'

import { useState } from 'react'
import { ArrowLeft, User, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validaciones
      if (formData.username.length < 3) {
        setError('El nombre de usuario debe tener al menos 3 caracteres')
        return
      }

      if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres')
        return
      }

      // Convertir username a email interno para login
      const internalEmail = `${formData.username.toLowerCase()}@nglcuba.com`

      // Iniciar sesión con email interno
      await signInWithEmailAndPassword(auth, internalEmail, formData.password)

      // Redirigir al dashboard
      router.push('/dashboard')
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Usuario o contraseña incorrectos')
      } else if (error.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Inténtalo más tarde')
      } else if (error.code === 'auth/invalid-email') {
        setError('Nombre de usuario no válido')
      } else {
        setError('Error al iniciar sesión. Inténtalo de nuevo.')
        console.error('Error en login:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="mr-4 text-red-400 hover:text-red-300 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Iniciar sesión</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-2">Nombre de usuario</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                placeholder="Tu nombre de usuario"
                required
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Usa el mismo nombre de usuario que registraste</p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                placeholder="Tu contraseña"
                required
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-500/20 border-2 border-red-500 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 neon-button rounded-xl font-semibold text-white flex items-center justify-center space-x-3 neon-border disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}
