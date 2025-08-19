import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Field from '../components/Field.jsx'
import { api } from '../api.js'

export default function Register(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(''); setOk(''); setLoading(true)
    try {
      await api.register({ username, password, file })
      setOk('Usuario creado. Ya puedes iniciar sesión.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <p style={{color:'#9ca3af', marginBottom:16}}>Crea tu cuenta. La imagen de perfil es opcional.</p>
      <Field label="Usuario" name="username" value={username} onChange={e=>setUsername(e.target.value)} placeholder="tu_usuario" required />
      <Field label="Contraseña" name="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required />
      <div style={{marginBottom:12}}>
        <label style={{display:'block', fontSize:14, color:'#9ca3af', marginBottom:6}}>Imagen de perfil (opcional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={e=>setFile(e.target.files?.[0] || null)}
          style={{
            width:'100%', padding:'10px 12px', borderRadius:8,
            border:'1px solid #374151', background:'#0b1220', color:'#e5e7eb',
            outline:'none'
          }}
        />
      </div>
      {error && <div style={{color:'#ef4444', marginBottom:10}}>{error}</div>}
      {ok && <div style={{color:'#22c55e', marginBottom:10}}>{ok}</div>}
      <button
        type="submit"
        disabled={loading}
        style={{
          width:'100%', padding:'10px 12px', borderRadius:8,
          border:'1px solid #2563eb', background:'#3b82f6', color:'#0b1022',
          fontWeight:600, cursor:'pointer', opacity:loading?0.7:1
        }}
      >
        {loading ? 'Creando…' : 'Crear usuario'}
      </button>
      <div style={{marginTop:12, textAlign:'center', color:'#9ca3af'}}>
        ¿Ya tienes cuenta? <Link to="/" style={{color:'#93c5fd'}}>Volver al login</Link>
      </div>
    </form>
  )
}
