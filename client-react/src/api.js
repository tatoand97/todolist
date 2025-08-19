// El Nginx del contenedor redirige /api -> http://host.docker.internal:8080
const BASE = '/api';

async function jsonFetch(path, { method='GET', token, body } = {}){
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try { const j = await res.json(); msg = j.error || j.message || msg; } catch {}
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

async function formFetch(path, { method='POST', token, formData } = {}){
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { method, headers, body: formData });
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try { const j = await res.json(); msg = j.error || j.message || msg; } catch {}
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export const api = {
  // --- Auth ---
  async login({ username, password }){
    // POST /usuarios/iniciar-sesion -> { token }
    return jsonFetch('/usuarios/iniciar-sesion', { method:'POST', body:{ username, password } });
  },

  async register({ username, password, file }){
    // Si hay imagen: intentamos multipart (profileImage); si el backend no lo soporta, fallback a JSON
    if (file) {
      const fd = new FormData();
      fd.append('username', username);
      fd.append('password', password);
      fd.append('profileImage', file);
      try {
        return await formFetch('/usuarios', { method:'POST', formData: fd });
      } catch (e) {
        const msg = String(e.message || '');
        if (!(msg.includes('415') || msg.toLowerCase().includes('unsupported')))
          throw e;
      }
    }
    return jsonFetch('/usuarios', { method:'POST', body:{ username, password } });
  },

  // --- Categorías ---
  async getCategorias(token){
    return jsonFetch('/categorias', { method:'GET', token });
  },

  async createCategoria({ nombre, descripcion }, token){
    return jsonFetch('/categorias', { method:'POST', token, body:{ nombre, descripcion } });
  },

  async deleteCategoria(id, token){
    return jsonFetch(`/categorias/${id}`, { method:'DELETE', token });
  },

  // --- Tareas ---
  async getTareasUsuario({ token, page=1, pageSize=20, categoriaId, estado }){
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('pageSize', pageSize);
    if (categoriaId) params.set('categoriaId', categoriaId);
    if (estado) params.set('estado', estado);
    const data = await jsonFetch(`/tareas/usuario?${params.toString()}`, { method:'GET', token });
    const items = Array.isArray(data) ? data : (data.items || []);
    const total = Array.isArray(data) ? items.length : (data.total ?? items.length);
    return { items, total };
  },

   // 👇 CREATE: exactamente 3 campos (texto, fechaTentativaFin, idCategoria)
  async createTarea({ texto, fechaTentativaFin, categoriaId }, token){
    const body = { texto, idCategoria: String(categoriaId) };
    if (fechaTentativaFin) body.fechaTentativaFin = fechaTentativaFin;
    return jsonFetch('/tareas', { method:'POST', token, body });
  },

  // 👇 UPDATE: enviamos solo lo que venga (texto, fechaTentativaFin, estado, idCategoria)
  async updateTarea(id, { texto, fechaTentativaFin, estado, categoriaId }, token){
    const body = {};
    if (texto !== undefined) body.texto = texto;
    if (fechaTentativaFin) body.fechaTentativaFin = fechaTentativaFin;
    if (estado) body.estado = estado;
    if (categoriaId) body.idCategoria = String(categoriaId);
    return jsonFetch(`/tareas/${id}`, { method:'PUT', token, body });
  },

  async deleteTarea(id, token){
    return jsonFetch(`/tareas/${id}`, { method:'DELETE', token });
  }
};
