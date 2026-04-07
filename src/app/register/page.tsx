'use client'

import { useState } from 'react'
import { ArrowLeft, Camera, User, Mail, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { auth, db, storage } from '@/lib/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profileImage: null as File | null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, profileImage: e.target.files[0] })
    }
  }

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

      // Convertir username a email interno
      const internalEmail = `${formData.username.toLowerCase()}@nglcuba.com`

      // Crear usuario en Firebase Auth con email interno
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        internalEmail,
        formData.password
      )

      const user = userCredential.user

      // Subir foto de perfil si existe
      let photoURL = ''
      if (formData.profileImage) {
        const storageRef = ref(storage, `profile_images/${user.uid}`)
        await uploadBytes(storageRef, formData.profileImage)
        photoURL = await getDownloadURL(storageRef)
      }

      // Actualizar perfil con username
      await updateProfile(user, {
        displayName: formData.username,
        photoURL: photoURL
      })

      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        username: formData.username,
        email: internalEmail, // Guardar email interno
        originalEmail: formData.email, // Guardar email real del usuario
        photoURL: photoURL,
        createdAt: new Date(),
        bio: ''
      })

      // Redirigir al dashboard
      router.push('/dashboard')
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Este nombre de usuario ya está en uso')
      } else if (error.code === 'auth/weak-password') {
        setError('La contraseña es muy débil (mínimo 6 caracteres)')
      } else if (error.code === 'auth/invalid-email') {
        setError('Nombre de usuario no válido')
      } else {
        setError('Error al crear la cuenta. Inténtalo de nuevo.')
        console.error('Error en registro:', error)
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
          <h1 className="text-2xl font-bold">Crear cuenta</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="flex justify-center">
            <label className="relative cursor-pointer">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center border-2 border-red-500 hover:border-red-400 transition-colors">
                {formData.profileImage ? (
                  <img
                    src={URL.createObjectURL(formData.profileImage)}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Camera size={32} className="text-gray-400" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

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
            <p className="text-xs text-gray-400 mt-1">Este será tu nombre de usuario único</p>
          </div>

          {/* Email (opcional para contacto) */}
          <div>
            <label className="block text-sm font-medium mb-2">Correo electrónico (opcional)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                placeholder="tu@email.com"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Solo para contacto, no afecta tu login</p>
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
                placeholder="Tu contraseña (mínimo 6 caracteres)"
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
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}
