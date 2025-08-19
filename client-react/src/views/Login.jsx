import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Field from '../components/Field.jsx'
import { api } from '../api.js'

export default function Login(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(''); setOk(''); setLoading(true)
    try {
      const res = await api.login({ username, password })
      const token = res.token || res.jwt || res.access_token || res
      if (!token) throw new Error('No se recibió token')
      localStorage.setItem('token', token)
      localStorage.setItem('username', username)
      // Si en el futuro el backend retorna profileImageURL, puedes guardar:
      // localStorage.setItem('profileImageURL', res.profileImageURL || '')
      setOk('¡Sesión iniciada!')
      navigate('/app/tareas')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <p style={{color:'#9ca3af', marginBottom:16}}>Ingresa con tu usuario y contraseña.</p>
      <Field label="Usuario" name="username" value={username} onChange={e=>setUsername(e.target.value)} placeholder="tu_usuario" required />
      <Field label="Contraseña" name="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required />
      {error && <div style={{color:'#ef4444', marginBottom:10}}>{error}</div>}
      {ok && <div style={{color:'#22c55e', marginBottom:10}}>{ok}</div>}
      <button
        type="submit"
        disabled={loading}
        style={{
          width:'100%', padding:'10px 12px', borderRadius:8,
          border:'1px solid #16a34a', background:'#22c55e', color:'#0b1022',
          fontWeight:600, cursor:'pointer', opacity:loading?0.7:1
        }}
      >
        {loading ? 'Ingresando…' : 'Ingresar'}
      </button>
      <div style={{marginTop:12, textAlign:'center', color:'#9ca3af'}}>
        ¿No tienes cuenta? <Link to="/registro" style={{color:'#93c5fd'}}>Regístrate</Link>
      </div>
    </form>
  )
}
