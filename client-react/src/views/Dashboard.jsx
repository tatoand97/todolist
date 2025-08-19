import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Tareas from './Tareas.jsx'
import Categorias from './Categorias.jsx'

function Sidebar(){
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || 'Usuario'
  const img = localStorage.getItem('profileImageURL') || '' // si no hay, mostramos círculo vacío

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('profileImageURL')
    navigate('/')
  }

  return (
    <div style={{
      width:240, background:'#111827', color:'#e5e7eb',
      display:'flex', flexDirection:'column', alignItems:'center',
      padding:'20px 16px', gap:12
    }}>
      <div style={{
        width:96, height:96, borderRadius:'50%', overflow:'hidden',
        background:'#374151', display:'grid', placeItems:'center'
      }}>
        {img
          ? <img src={img} alt="Perfil" style={{width:'100%', height:'100%', objectFit:'cover'}} />
          : <span style={{color:'#9ca3af', fontWeight:700, fontSize:24}}>
              {username?.[0]?.toUpperCase() || 'U'}
            </span>}
      </div>
      <div style={{fontWeight:700, marginTop:6, textAlign:'center'}}>{username}</div>

      <nav style={{display:'flex', flexDirection:'column', gap:10, marginTop:12, width:'100%'}}>
        <Link to="/app/tareas" style={{color:'#93c5fd', textDecoration:'none'}}>Tareas</Link>
        <Link to="/app/categorias" style={{color:'#93c5fd', textDecoration:'none'}}>Categorías</Link>
      </nav>

      <div style={{marginTop:'auto', width:'100%'}}>
        <button
          onClick={logout}
          style={{width:'100%', background:'#ef4444', color:'#fff', border:'none', padding:'10px 12px', borderRadius:8, cursor:'pointer'}}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export default function Dashboard(){
  return (
    <div style={{display:'flex', minHeight:'100vh', background:'#0b1022', color:'#e5e7eb', fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Arial'}}>
      <Sidebar />
      <main style={{flex:1, padding:24}}>
        <Routes>
          <Route path="tareas" element={<Tareas />} />
          <Route path="categorias" element={<Categorias />} />
        </Routes>
      </main>
    </div>
  )
}
