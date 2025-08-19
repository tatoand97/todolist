import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'

// Helpers fecha <-> input datetime-local
function toLocalInputValue(iso){
  if (!iso) return ''
  const d = new Date(iso)
  const pad = n => String(n).padStart(2,'0')
  const yyyy = d.getFullYear()
  const mm = pad(d.getMonth()+1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const mi = pad(d.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
}
function fromLocalInputValue(v){
  if (!v) return ''
  const d = new Date(v)
  return d.toISOString()
}

const ESTADOS = ['Sin Empezar','Empezada','Finalizada']

export default function Tareas(){
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  // Crear
  const [texto, setTexto] = useState('')
  const [fecha, setFecha] = useState('') // datetime-local string
  const [categoriaId, setCategoriaId] = useState('')

  // Listado
  const [categorias, setCategorias] = useState([])
  const [tareas, setTareas] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  // Edición inline por fila
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState({ texto:'', fechaTentativaFin:'', estado:ESTADOS[0], categoriaId:'' })

  // Cargar categorías y tareas
  const fetchAll = async () => {
    setLoading(true)
    setError(''); setOk('')
    try {
      const cats = await api.getCategorias(token)
      const catItems = Array.isArray(cats) ? cats : (cats.items || [])
      setCategorias(catItems)
      const { items, total } = await api.getTareasUsuario({ token, page, pageSize })
      setTareas(items)
      setTotal(total)
    } catch (e) {
      setError(e.message)
      if ((e.status === 401) || String(e.message).includes('401')) navigate('/')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { fetchAll() }, [page])

  // Crear tarea (solo 3 campos)
  const onCreate = async (e) => {
    e.preventDefault()
    if (!texto.trim()) { setError('El texto es obligatorio'); return }
    if (!categoriaId) { setError('Selecciona una categoría'); return }
    setSaving(true); setError(''); setOk('')
    try {
      await api.createTarea({
        texto: texto.trim(),
        fechaTentativaFin: fecha ? fromLocalInputValue(fecha) : null,
        categoriaId
      }, token)
      setTexto(''); setFecha(''); setCategoriaId('')
      setOk('Tarea creada')
      setPage(1)
      fetchAll()
    } catch (e) {
      setError(e.message)
      if ((e.status === 401) || String(e.message).includes('401')) navigate('/')
    } finally {
      setSaving(false)
    }
  }

  // Eliminar
  const onDelete = async (id) => {
    if (!confirm('¿Eliminar esta tarea?')) return
    try {
      await api.deleteTarea(id, token)
      setTareas(prev => prev.filter(t => t.id !== id))
      setTotal(t => Math.max(0, t-1))
    } catch (e) {
      setError(e.message)
      if ((e.status === 401) || String(e.message).includes('401')) navigate('/')
    }
  }

  // Editar
  const startEdit = (t) => {
    setEditingId(t.id)
    setDraft({
      texto: t.texto || t.text,
      fechaTentativaFin: toLocalInputValue(t.fechaTentativaFin || t.due_date || ''),
      estado: t.estado || t.state || ESTADOS[0],
      categoriaId: String(t.categoriaId || t.category_id || '')
    })
  }
  const cancelEdit = () => {
    setEditingId(null)
    setDraft({ texto:'', fechaTentativaFin:'', estado:ESTADOS[0], categoriaId:'' })
  }
  const saveEdit = async (id) => {
    if (!draft.texto.trim()) { setError('El texto es obligatorio'); return }
    if (!draft.categoriaId) { setError('Selecciona una categoría'); return }
    setSaving(true); setError(''); setOk('')
    try {
      await api.updateTarea(id, {
        texto: draft.texto.trim(),
        fechaTentativaFin: draft.fechaTentativaFin ? fromLocalInputValue(draft.fechaTentativaFin) : null,
        estado: draft.estado,
        categoriaId: draft.categoriaId
      }, token)
      setOk('Tarea actualizada')
      cancelEdit()
      fetchAll()
    } catch (e) {
      setError(e.message)
      if ((e.status === 401) || String(e.message).includes('401')) navigate('/')
    } finally {
      setSaving(false)
    }
  }

  // map categorias
  const catById = useMemo(() => {
    const m = new Map()
    categorias.forEach(c => m.set(c.id, c.nombre || c.name))
    return m
  }, [categorias])

  return (
    <div>
      {/* Título */}
      <h2 style={{marginTop:0}}>Tareas</h2>

      {/* Crear tarea (texto + fecha + categoría) */}
      <div style={{background:'#111827', border:'1px solid #1f2937', borderRadius:12, padding:16, marginBottom:16}}>
        <h3 style={{marginTop:0}}>Crear tarea</h3>
        <form onSubmit={onCreate} style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr auto', gap:12}}>
          <input
            type="text"
            placeholder="Texto de la tarea"
            value={texto}
            onChange={e=>setTexto(e.target.value)}
            style={{padding:'10px 12px', borderRadius:8, border:'1px solid #374151', background:'#0b1220', color:'#e5e7eb'}}
          />
          <input
            type="datetime-local"
            value={fecha}
            onChange={e=>setFecha(e.target.value)}
            style={{padding:'10px 12px', borderRadius:8, border:'1px solid #374151', background:'#0b1220', color:'#e5e7eb'}}
          />
          <select
            value={categoriaId}
            onChange={e=>setCategoriaId(e.target.value)}
            required
            style={{padding:'10px 12px', borderRadius:8, border:'1px solid #374151', background:'#0b1220', color:'#e5e7eb'}}
          >
            <option value="">Categoría</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nombre || c.name}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={saving}
            style={{padding:'10px 16px', borderRadius:8, border:'1px solid #16a34a', background:'#22c55e', color:'#0b1022', fontWeight:600, cursor:'pointer', opacity:saving?0.7:1}}
          >
            {saving ? 'Creando…' : 'Crear'}
          </button>
        </form>
        {error && <div style={{color:'#ef4444', marginTop:10}}>{error}</div>}
        {ok && <div style={{color:'#22c55e', marginTop:10}}>{ok}</div>}
      </div>

      {/* Tabla de tareas */}
      <div style={{background:'#111827', border:'1px solid #1f2937', borderRadius:12, padding:16}}>
        <h3 style={{marginTop:0}}>Lista</h3>
        {loading ? (
          <div>Cargando…</div>
        ) : tareas.length === 0 ? (
          <div style={{color:'#9ca3af'}}>No hay tareas aún.</div>
        ) : (
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead>
                <tr style={{textAlign:'left', color:'#9ca3af'}}>
                  <th style={{padding:'8px 6px', borderBottom:'1px solid #1f2937'}}>ID</th>
                  <th style={{padding:'8px 6px', borderBottom:'1px solid #1f2937'}}>Texto</th>
                  <th style={{padding:'8px 6px', borderBottom:'1px solid #1f2937'}}>Fecha tentativa</th>
                  <th style={{padding:'8px 6px', borderBottom:'1px solid #1f2937'}}>Estado</th>
                  <th style={{padding:'8px 6px', borderBottom:'1px solid #1f2937'}}>Categoría</th>
                  <th style={{padding:'8px 6px', borderBottom:'1px solid #1f2937'}}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tareas.map(t => {
                  const isEditing = editingId === t.id
                  const texto = t.texto || t.text
                  const fISO = t.fechaTentativaFin || t.due_date || ''
                  const estado = t.estado || t.state
                  const catId = t.categoriaId || t.category_id
                  return (
                    <tr key={t.id}>
                      <td style={{padding:'10px 6px', borderBottom:'1px solid #1f2937'}}>{t.id}</td>
                      <td style={{padding:'10px 6px', borderBottom:'1px solid #1f2937'}}>
                        {!isEditing ? (
                          texto
                        ) : (
                          <input
                            type="text"
                            value={draft.texto}
                            onChange={e=>setDraft({...draft, texto:e.target.value})}
                            style={{padding:'8px 10px', borderRadius:6, border:'1px solid #374151', background:'#0b1220', color:'#e5e7eb', width:'100%'}}
                          />
                        )}
                      </td>
                      <td style={{padding:'10px 6px', borderBottom:'1px solid #1f2937'}}>
                        {!isEditing ? (
                          fISO ? new Date(fISO).toLocaleString() : '—'
                        ) : (
                          <input
                            type="datetime-local"
                            value={draft.fechaTentativaFin}
                            onChange={e=>setDraft({...draft, fechaTentativaFin:e.target.value})}
                            style={{padding:'8px 10px', borderRadius:6, border:'1px solid #374151', background:'#0b1220', color:'#e5e7eb'}}
                          />
                        )}
                      </td>
                      <td style={{padding:'10px 6px', borderBottom:'1px solid #1f2937'}}>
                        {!isEditing ? (
                          estado
                        ) : (
                          <select
                            value={draft.estado}
                            onChange={e=>setDraft({...draft, estado:e.target.value})}
                            style={{padding:'8px 10px', borderRadius:6, border:'1px solid #374151', background:'#0b1220', color:'#e5e7eb'}}
                          >
                            {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        )}
                      </td>
                      <td style={{padding:'10px 6px', borderBottom:'1px solid #1f2937'}}>
                        {!isEditing ? (
                          catById.get(catId) || catId
                        ) : (
                          <select
                            value={draft.categoriaId}
                            onChange={e=>setDraft({...draft, categoriaId:e.target.value})}
                            style={{padding:'8px 10px', borderRadius:6, border:'1px solid #374151', background:'#0b1220', color:'#e5e7eb'}}
                          >
                            {categorias.map(c => (
                              <option key={c.id} value={c.id}>{c.nombre || c.name}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td style={{padding:'10px 6px', borderBottom:'1px solid #1f2937', whiteSpace:'nowrap'}}>
                        {!isEditing ? (
                          <>
                            <button
                              onClick={()=>{ setError(''); setOk(''); setSaving(false); startEdit(t) }}
                              style={{marginRight:8, background:'transparent', border:'1px solid #2563eb', color:'#3b82f6', padding:'6px 10px', borderRadius:6, cursor:'pointer'}}
                            >Editar</button>
                            <button
                              onClick={()=>onDelete(t.id)}
                              title="Eliminar"
                              style={{background:'transparent', border:'1px solid #ef4444', color:'#ef4444', padding:'6px 10px', borderRadius:6, cursor:'pointer'}}
                            >🗑️</button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={()=>saveEdit(t.id)}
                              disabled={saving}
                              style={{marginRight:8, background:'#22c55e', border:'1px solid #16a34a', color:'#0b1022', padding:'6px 10px', borderRadius:6, cursor:'pointer', opacity:saving?0.7:1}}
                            >Guardar</button>
                            <button
                              onClick={cancelEdit}
                              style={{background:'transparent', border:'1px solid #9ca3af', color:'#9ca3af', padding:'6px 10px', borderRadius:6, cursor:'pointer'}}
                            >Cancelar</button>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación simple */}
        {total > pageSize && (
          <div style={{display:'flex', gap:8, marginTop:12}}>
            <button
              onClick={()=> setPage(p => Math.max(1, p-1))}
              disabled={page===1}
              style={{padding:'6px 10px', borderRadius:6, border:'1px solid #374151', background:'#0b1220', color:'#e5e7eb', opacity:page===1?0.5:1}}
            >Anterior</button>
            <div style={{alignSelf:'center', color:'#9ca3af'}}>Página {page}</div>
            <button
              onClick={()=> setPage(p => p + 1)}
              disabled={(page*pageSize) >= total}
              style={{padding:'6px 10px', borderRadius:6, border:'1px solid #374151', background:'#0b1220', color:'#e5e7eb', opacity: (page*pageSize)>=total ? 0.5 : 1}}
            >Siguiente</button>
          </div>
        )}
      </div>
    </div>
  )
}
