import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Resume() {
  const [form, setForm] = useState({ summary: '', skills: [], education: [], experience: [], projects: [] })
  const [message, setMessage] = useState('')

  const addItem = (field, obj) => setForm(prev => ({ ...prev, [field]: [...prev[field], obj] }))
  const removeItem = (field, idx) => setForm(prev => ({ ...prev, [field]: prev[field].filter((_,i)=>i!==idx) }))

  useEffect(() => { api.getResume().then(setForm) }, [])

  const save = async () => {
    // Basic validations
    if (!form.summary || form.summary.length < 30) return setMessage('Summary must be at least 30 characters')
    if (!form.skills || form.skills.length === 0) return setMessage('Add at least one skill')
    for (const s of form.skills) if (s.length < 2 || s.length > 40) return setMessage('Each skill 2-40 chars')
    await api.saveResume({ ...form, skills: form.skills })
    setMessage('Saved! You can download now.')
  }

  const download = () => {
    window.open(api.downloadResumeUrl(), '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Resume Builder</h1>
          <a href="/" className="text-blue-600">Back</a>
        </div>

        <div className="bg-white p-4 rounded shadow space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Summary</label>
            <textarea value={form.summary} onChange={(e)=>setForm({...form, summary: e.target.value})} className="w-full border rounded px-3 py-2" rows={5} placeholder="Professional summary (min 30 chars)"/>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Skills</label>
            <div className="flex gap-2 mb-2">
              <input id="skillInput" className="flex-1 border rounded px-3 py-2" placeholder="e.g., React"/>
              <button onClick={() => { const i=document.getElementById('skillInput'); if(i.value){ setForm({...form, skills: [...(form.skills||[]), i.value]}); i.value=''} }} className="px-3 py-2 bg-gray-800 text-white rounded">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(form.skills || []).map((s, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 rounded border">{s} <button onClick={()=>removeItem('skills', idx)} className="text-red-600 ml-1">x</button></span>
              ))}
            </div>
          </div>

          {['education','experience','projects'].map((section) => (
            <div key={section}>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">{section[0].toUpperCase()+section.slice(1)}</label>
                <button onClick={() => addItem(section, {})} className="text-sm px-2 py-1 border rounded">Add</button>
              </div>
              <div className="space-y-2">
                {(form[section] || []).map((item, idx) => (
                  <div key={idx} className="grid md:grid-cols-2 gap-2 p-2 border rounded">
                    <input placeholder="Title/Degree/Role/Name" className="border rounded px-2 py-1" value={item.title || item.degree || item.role || item.name || ''} onChange={(e)=>{
                      const arr=[...form[section]]; if(section==='education') arr[idx]={...arr[idx], degree:e.target.value}; else if(section==='experience') arr[idx]={...arr[idx], role:e.target.value}; else arr[idx]={...arr[idx], name:e.target.value}; setForm({...form, [section]:arr})
                    }}/>
                    <input placeholder="Institution/Company/Tech" className="border rounded px-2 py-1" value={item.institution || item.company || item.tech || ''} onChange={(e)=>{ const arr=[...form[section]]; if(section==='education') arr[idx]={...arr[idx], institution:e.target.value}; else if(section==='experience') arr[idx]={...arr[idx], company:e.target.value}; else arr[idx]={...arr[idx], tech:e.target.value}; setForm({...form, [section]:arr}) }}/>
                    <input placeholder="Start" className="border rounded px-2 py-1" value={item.start || ''} onChange={(e)=>{ const arr=[...form[section]]; arr[idx]={...arr[idx], start:e.target.value}; setForm({...form, [section]:arr}) }}/>
                    <input placeholder="End" className="border rounded px-2 py-1" value={item.end || ''} onChange={(e)=>{ const arr=[...form[section]]; arr[idx]={...arr[idx], end:e.target.value}; setForm({...form, [section]:arr}) }}/>
                    <textarea placeholder="Description / Link" className="md:col-span-2 border rounded px-2 py-1" value={item.description || item.link || ''} onChange={(e)=>{ const arr=[...form[section]]; if(section==='projects') arr[idx]={...arr[idx], description:e.target.value}; else arr[idx]={...arr[idx], description:e.target.value}; setForm({...form, [section]:arr}) }}/>
                    <button onClick={()=>removeItem(section, idx)} className="text-red-600 text-sm">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {message && <p className="text-sm">{message}</p>}

          <div className="flex gap-2">
            <button onClick={save} className="bg-blue-600 text-white px-3 py-2 rounded">Save</button>
            <button onClick={download} className="border px-3 py-2 rounded">Download</button>
          </div>
        </div>
      </div>
    </div>
  )}
