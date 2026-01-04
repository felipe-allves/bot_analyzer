import { useState } from 'react'
import './App.css'

function App() {
  const [code, setCode] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Cole seu código para analisar')
      return
    }

    setLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const response = await fetch('http://localhost:3001/api/analyzer/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao analisar')
      }

      setAnalysis(data.analyze)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="hero">
      <div className="logo">&lt;bot_analyzer/&gt;</div>
      <h1 className="hero-title">Transforme erros em aprendizado</h1> 
        
        <div className="editor-wrapper">
          <textarea
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Cole seu código JavaScript aqui..."
            spellCheck={false}
          />
          
          <button 
            onClick={handleAnalyze} 
            disabled={loading}
            className="btn-analyze"
          >
            {loading ? 'Analisando...' : '→ Analisar Código'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      {analysis && (
        <div className="results">
          <h2>Análise Completa</h2>
          {analysis.raw_response ? (
            <pre className="raw-response">{analysis.raw_response}</pre>
          ) : (
            <div className="analysis-grid">
              <div className="analysis-card">
                <strong>Tipo do Erro</strong>
                <p>{analysis.error_type}</p>
              </div>
              <div className="analysis-card">
                <strong>Localização</strong>
                <p>{analysis.location}</p>
              </div>
              <div className="analysis-card full">
                <strong>Explicação</strong>
                <p>{analysis.explanation}</p>
              </div>
              <div className="analysis-card full">
                <strong>Solução</strong>
                <p>{analysis.solution}</p>
              </div>
              <div className="analysis-card full">
                <strong>Boas Práticas</strong>
                <p>{analysis.best_practices}</p>
              </div>
              <div className="analysis-card">
                <strong>Categoria</strong>
                <span className="badge">{analysis.category}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App