import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './views/Login.jsx'
import Register from './views/Register.jsx'
import Dashboard from './views/Dashboard.jsx'

const Layout = ({ children }) => (
  <div style={{
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(180deg,#0b1022,#0f172a 40%,#0b1022)',
    color: '#e5e7eb',
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Arial'
  }}>
    <div style={{
      width: '100%',
      maxWidth: 420,
      background: '#111827',
      border: '1px solid #1f2937',
      borderRadius: 12,
      padding: 24,
      boxShadow: '0 10px 30px rgba(0,0,0,.35)'
    }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 12}}>
        <Link to="/" style={{textDecoration:'none', color:'#e5e7eb'}}><h2 style={{margin:0}}>Todolist</h2></Link>
      </div>
      {children}
    </div>
  </div>
)

function Protected({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/" replace />
}

export default function App(){
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  return (
    <Routes>
      {/* Login y Registro mantienen el Layout y estilos actuales */}
      <Route path="/" element={token ? <Navigate to="/app/tareas" replace /> : <Layout><Login /></Layout>} />
      <Route path="/registro" element={<Layout><Register /></Layout>} />

      {/* Área autenticada */}
      <Route path="/app/*" element={
        <Protected>
          <Dashboard />
        </Protected>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
