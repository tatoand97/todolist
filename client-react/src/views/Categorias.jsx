import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'

export default function Categorias(){
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  // Cargar lista
  const fetchCategorias = async () => {
    setError(''); setOk('')
    try {
      const data = await api.getCategorias(token)
      setCategorias(Array.isArray(data) ? data : (data.items || []))
    } catch (e) {
      setError(e.message)
      if (String(e.message).includes('Error 401')) navigate('/')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategorias() }, []) // mount

  // Crear
  const onCreate = async (e) => {
    e.preventDefault()
    if (!nombre.trim()) { setError('El nombre es obligatorio'); return }
    setSaving(true); setError(''); setOk('')
    try {
      await api.createCategoria({ nombre: nombre.trim(), descripcion: descripcion.trim() }, token)
      setNombre(''); setDescripcion('')
      setOk('Categoría creada')
      fetchCategorias()
    } catch (e) {
      setError(e.message)
      if (String(e.message).includes('Error 401')) navigate('/')
    } finally {
      setSaving(false)
    }
  }

  // Eliminar
  const onDelete = async (id) => {
    if (!confirm('¿Eliminar esta categoría?')) return
    try {
      await api.deleteCategoria(id, token)
      setCategorias(prev => prev.filter(c => c.id !== id))
    } catch (e) {
      setError(e.message)
      if (String(e.message).includes('Error 401')) navigate('/')
    }
  }

  return (
    <div>
      {/* Título */}
      <h2 style={{marginTop:0}}>Categorías</h2>

      {/* Crear categoría */}
      <div style={{background:'#111827', border:'1px solid #1f2937', borderRadius:12, padding:16, marginBottom:16}}>
        <h3 style={{marginTop:0}}>Crear categoría</h3>
        <form onSubmit={onCreate} style={{display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:12}}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={e=>setNombre(e.target.value)}
            style={{padding:'10px 12px', borderRadius:8, border:'1px solid #374151', background:'#0b1220', color:'#e5e7eb'}}
          />
          <input
            type="text"
            placeholder="Descripción (opcional)"
            value={descripcion}
            onChange={e=>setDescripcion(e.target.value)}
            style={{padding:'10px 12px', borderRadius:8, border:'1px solid #374151', background:'#0b1220', color:'#e5e7eb'}}
          />
          <button
            type="submit"
            disabled={saving}
            style={{padding:'10px 16px', borderRadius:8, border:'1px solid #2563eb', background:'#3b82f6', color:'#0b1022', fontWeight:600, cursor:'pointer', opacity:saving?0.7:1}}
          >
            {saving ? 'Creando…' : 'Crear'}
          </button>
        </form>
        {error && <div style={{color:'#ef4444', marginTop:10}}>{error}</div>}
        {ok && <div style={{color:'#22c55e', marginTop:10}}>{ok}</div>}
      </div>

      {/* Tabla de categorías */}
      <div style={{background:'#111827', border:'1px solid #1f2937', borderRadius:12, padding:16}}>
        <h3 style={{marginTop:0}}>Lista</h3>
        {loading ? (
          <div>Cargando…</div>
        ) : categorias.length === 0 ? (
          <div style={{color:'#9ca3af'}}>No hay categorías aún.</div>
        ) : (
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead>
                <tr style={{textAlign:'left', color:'#9ca3af'}}>
                  <th style={{padding:'8px 6px', borderBottom:'1px solid #1f2937'}}>ID</th>
                  <th style={{padding:'8px 6px', borderBottom:'1px solid #1f2937'}}>Nombre</th>
                  <th style={{padding:'8px 6px', borderBottom:'1px solid #1f2937'}}>Descripción</th>
                  <th style={{padding:'8px 6px', borderBottom:'1px solid #1f2937'}}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map(cat => (
                  <tr key={cat.id}>
                    <td style={{padding:'10px 6px', borderBottom:'1px solid #1f2937'}}>{cat.id}</td>
                    <td style={{padding:'10px 6px', borderBottom:'1px solid #1f2937'}}>{cat.nombre || cat.name}</td>
                    <td style={{padding:'10px 6px', borderBottom:'1px solid #1f2937'}}>{cat.descripcion || cat.description}</td>
                    <td style={{padding:'10px 6px', borderBottom:'1px solid #1f2937'}}>
                      <button
                        title="Eliminar"
                        onClick={()=>onDelete(cat.id)}
                        style={{background:'transparent', border:'1px solid #ef4444', color:'#ef4444', padding:'6px 10px', borderRadius:6, cursor:'pointer'}}
                      >🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
