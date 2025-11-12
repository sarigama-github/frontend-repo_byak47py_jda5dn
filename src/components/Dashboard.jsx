import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [domains, setDomains] = useState([])
  const [selected, setSelected] = useState('')
  const [roadmap, setRoadmap] = useState([])
  const [progress, setProgress] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.domains().then(d => setDomains(d.domains))
  }, [])

  const chooseDomain = async (d) => {
    setSelected(d)
    await api.selectDomain(d)
    const rm = await api.roadmap(d)
    setRoadmap(rm.steps)
    const pr = await api.progress(d)
    setProgress(pr)
  }

  const loadProgress = async (d) => {
    const pr = await api.progress(d)
    setProgress(pr)
  }

  const submitAssessment = async (stepId) => {
    setMessage('')
    const score = Math.floor(Math.random() * 21) // demo 0-20; replace with real quiz later
    const res = await api.submitAssessment({ domain: selected, step_id: stepId, score })
    setMessage(`Scored ${res.score}/20. ${res.passed ? 'Passed' : 'Failed'}`)
    await loadProgress(selected)
  }

  const finalAssessment = async () => {
    setMessage('')
    const score = 60 + Math.floor(Math.random() * 41) // 60-100 demo
    const res = await api.finalAssessment(selected, score)
    setMessage(`Final Score ${res.score}/100. ${res.passed ? 'Passed' : 'Failed'}`)
    await loadProgress(selected)
  }

  const isUnlocked = (idx) => progress?.steps_status?.[idx] !== 'locked'
  const isPassed = (idx) => progress?.steps_status?.[idx] === 'passed'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Welcome, {user?.first_name}</h1>
          <p className="text-sm text-gray-500">Choose a domain, follow roadmap, suggest videos, pass assessments.</p>
        </div>
        <div className="flex items-center gap-3">
          <a className="text-blue-600" href="/resume">Resume Builder</a>
          <button onClick={logout} className="bg-gray-800 text-white px-3 py-1.5 rounded">Logout</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <section className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Domains</h2>
          <div className="flex flex-wrap gap-3">
            {domains.map((d) => (
              <button key={d} onClick={() => chooseDomain(d)} className={`px-3 py-1.5 rounded border ${selected===d? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50'}`}>
                {d}
              </button>
            ))}
          </div>
        </section>

        {selected && (
          <section className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Roadmap: {selected}</h2>
              <button onClick={finalAssessment} className="bg-green-600 text-white px-3 py-1.5 rounded disabled:opacity-50" disabled={!progress || !progress.steps_status?.every(s => s === 'passed')}>Final Assessment</button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {roadmap.map((s, idx) => (
                <div key={s.id} className={`border rounded p-4 ${isPassed(idx) ? 'border-green-500' : isUnlocked(idx) ? 'border-blue-400' : 'opacity-60'}`}>
                  <h3 className="font-semibold">{idx+1}. {s.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{s.description}</p>
                  <div className="flex gap-2">
                    <a href={`/videos/${encodeURIComponent(selected)}/${encodeURIComponent(s.id)}`} className="px-2 py-1 rounded border">Suggest Videos</a>
                    <button disabled={!isUnlocked(idx)} onClick={()=>submitAssessment(s.id)} className="px-2 py-1 rounded bg-blue-600 text-white disabled:opacity-50">Take 20-mark test</button>
                  </div>
                </div>
              ))}
            </div>
            {message && <p className="mt-3 text-sm">{message}</p>}
          </section>
        )}

        <section className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Your Progress</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {(progress ? [progress] : []).map((p) => (
              <div key={p._id} className="p-4 border rounded">
                <p className="font-semibold">{p.domain}</p>
                <div className="mt-2 h-2 w-full bg-gray-200 rounded">
                  <div className="h-2 bg-blue-600 rounded" style={{ width: `${(p.steps_status?.filter(s=>s==='passed').length || 0) * 100 / (p.steps_status?.length || 1)}%` }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{p.steps_status?.filter(s=>s==='passed').length || 0} / {p.steps_status?.length || 0} steps completed</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
