import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import Navbar from './Navbar'

export default function DomainRoadmap() {
  const { domain } = useParams()
  const [steps, setSteps] = useState([])
  const [progress, setProgress] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const rm = await api.roadmap(domain)
      setSteps(rm.steps)
      const pr = await api.progress(domain)
      setProgress(pr)
    }
    load()
  }, [domain])

  const isUnlocked = (idx) => progress?.steps_status?.[idx] !== 'locked'
  const isPassed = (idx) => progress?.steps_status?.[idx] === 'passed'

  const submitAssessment = async (stepId) => {
    setMessage('')
    const score = Math.floor(Math.random() * 21)
    const res = await api.submitAssessment({ domain, step_id: stepId, score })
    setMessage(`Scored ${res.score}/20. ${res.passed ? 'Passed' : 'Failed'}`)
    const pr = await api.progress(domain)
    setProgress(pr)
  }

  const finalAssessment = async () => {
    setMessage('')
    const score = 60 + Math.floor(Math.random() * 41)
    const res = await api.finalAssessment(domain, score)
    setMessage(`Final Score ${res.score}/100. ${res.passed ? 'Passed' : 'Failed'}`)
    const pr = await api.progress(domain)
    setProgress(pr)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Roadmap: {domain}</h1>
          <button onClick={finalAssessment} className="bg-green-600 text-white px-3 py-1.5 rounded disabled:opacity-50" disabled={!progress || !progress.steps_status?.every(s => s === 'passed')}>Final Assessment</button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((s, idx) => (
            <div key={s.id} className={`border rounded p-4 ${isPassed(idx) ? 'border-green-500' : isUnlocked(idx) ? 'border-blue-400' : 'opacity-60'}`}>
              <h3 className="font-semibold">{idx+1}. {s.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{s.description}</p>
              <div className="flex gap-2">
                <Link to={`/videos/${encodeURIComponent(domain)}/${encodeURIComponent(s.id)}`} className="px-2 py-1 rounded border">Suggest Videos</Link>
                <button disabled={!isUnlocked(idx)} onClick={()=>submitAssessment(s.id)} className="px-2 py-1 rounded bg-blue-600 text-white disabled:opacity-50">Take 20-mark test</button>
              </div>
            </div>
          ))}
        </div>

        {message && <p className="text-sm">{message}</p>}
      </div>
    </div>
  )
}
