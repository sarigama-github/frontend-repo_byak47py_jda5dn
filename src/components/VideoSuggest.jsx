import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useParams, Link } from 'react-router-dom'
import Navbar from './Navbar'

export default function VideoSuggest() {
  const { domain, stepId } = useParams()
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [items, setItems] = useState([])
  const [message, setMessage] = useState('')

  const load = async () => {
    const res = await api.suggestions(domain, stepId)
    setItems(res.items || [])
  }

  useEffect(() => { load() }, [domain, stepId])

  const submit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      await api.suggestVideo({ domain, step_id: stepId, title, url })
      setTitle(''); setUrl('')
      setMessage('Suggestion submitted!')
      await load()
    } catch (e) {
      setMessage(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Suggest YouTube videos</h1>
          <Link to={`/domain/${encodeURIComponent(domain)}`} className="text-blue-600">Back to Roadmap</Link>
        </div>
        <p className="text-sm text-gray-600 mb-4">Domain: {domain} · Step: {stepId}</p>
        <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input value={title} onChange={(e)=>setTitle(e.target.value)} required minLength={3} className="w-full border rounded px-3 py-2"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">YouTube URL</label>
            <input value={url} onChange={(e)=>setUrl(e.target.value)} required pattern="^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.*$" className="w-full border rounded px-3 py-2"/>
          </div>
          <button className="bg-blue-600 text-white px-3 py-2 rounded">Submit</button>
          {message && <p className="text-sm mt-1">{message}</p>}
        </form>

        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Suggestions</h2>
          <ul className="space-y-2">
            {items.map(it => (
              <li key={it._id} className="p-2 border rounded">
                <p className="font-medium">{it.title}</p>
                <a className="text-blue-600" href={it.url} target="_blank" rel="noreferrer">{it.url}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
