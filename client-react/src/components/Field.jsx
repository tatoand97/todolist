import React from 'react'

export default function Field({ label, type="text", value, onChange, placeholder, name, required=false, accept, multiple=false }){
  return (
    <div style={{marginBottom:12}}>
      <label style={{display:'block', fontSize:14, color:'#9ca3af', marginBottom:6}}>{label}</label>
      <input
        name={name}
        type={type}
        value={type==='file' ? undefined : value}
        onChange={onChange}
        placeholder={placeholder}
        accept={accept}
        multiple={multiple}
        required={required}
        style={{
          width:'100%', padding:'10px 12px', borderRadius:8,
          border:'1px solid #374151', background:'#0b1220', color:'#e5e7eb',
          outline:'none'
        }}
      />
    </div>
  )
}
