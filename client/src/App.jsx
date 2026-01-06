import { useState, useEffect, useRef } from 'react'
import './App.css'
import { addPoints, saveAnalysis, updateStats, checkBadges, getPoints, getStats } from './services/gamification'
import { analyzeLearning } from './services/learning_analytics'
import { getTheme, toggleTheme, initTheme } from './services/theme'
import { API_URL } from './config'

function App() {
  const [code, setCode] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [points, setPoints] = useState(getPoints())
  const [stats, setStats] = useState(getStats())
  const [newBadges, setNewBadges] = useState([])
  const [theme, setThemeState] = useState(getTheme())
  const [learningData, setLearningData] = useState(analyzeLearning())
  const resultsRef = useRef(null)

  useEffect(() => {
    initTheme()
  }, [])

  const handleThemeToggle = () => {
    const newTheme = toggleTheme()
    setThemeState(newTheme)
  }

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Cole seu código para analisar')
      return
    }

    setLoading(true)
    setError(null)
    setAnalysis(null)
    setNewBadges([])

    try {
      const response = await fetch(`${API_URL}/api/analyzer/analyze`, {
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
      setCode('')

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        })
      }, 100)

      const newPoints = addPoints(10)
      setPoints(newPoints)

      saveAnalysis(data.analyze)

      const updatedStats = updateStats(data.analyze)
      setStats(updatedStats)

      const learning = analyzeLearning()
      setLearningData(learning)

      const badges = checkBadges()
      if (badges.length > 0) {
        setNewBadges(badges)
        setPoints(getPoints())
      }

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getLearningIcon = () => {
    switch(learningData.status) {
      case 'improving':
        return <i className="bi bi-graph-up-arrow" style={{ color: 'var(--success-text)' }}></i>
      case 'regressing':
        return <i className="bi bi-graph-down-arrow" style={{ color: 'var(--error-text)' }}></i>
      case 'repeated_errors':
        return <i className="bi bi-arrow-repeat" style={{ color: 'var(--error-text)' }}></i>
      case 'stable':
        return <i className="bi bi-dash-circle" style={{ color: 'var(--text-tertiary)' }}></i>
      default:
        return <i className="bi bi-info-circle" style={{ color: 'var(--text-tertiary)' }}></i>
    }
  }

  return (
    <div className="app">
      <button className="theme-toggle" onClick={handleThemeToggle} aria-label="Toggle theme">
        <i className={theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill'}></i>
      </button>

      <div className="hero">
        <div className="logo">&lt;bot_analyzer/&gt;</div>

        <h1 className="hero-title">Transforme erros em aprendizado</h1>
        
        <div className="editor-wrapper">
          <textarea
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Cole seu código JavaScript aqui..."
            spellCheck={false}
          />
          
          <button 
            onClick={handleAnalyze} 
            disabled={loading}
            className="btn-analyze"
          >
            {loading ? (
              <>
                <i className="bi bi-arrow-repeat spinning"></i>
                {' '}Analisando...
              </>
            ) : (
              'Analisar Código'
            )}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <i className="bi bi-exclamation-triangle"></i> {error}
          </div>
        )}
      </div>

      {analysis && (
        <div className="results" ref={resultsRef}>
          <h2>Análise Completa</h2>

          {learningData && learningData.shouldShow && (
            <div className="learning-bar">
              <div className="learning-bar-content">
                <span className="learning-message">{learningData.message}</span>
                <div className="learning-progress">
                  <div 
                    className={`learning-progress-fill ${learningData.status}`}
                    style={{ width: `${learningData.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          
          {analysis.has_issues !== undefined && (
            <div className={`status-badge ${analysis.has_issues ? 'has-issues' : 'clean'}`}>
              <i className={analysis.has_issues ? 'bi bi-x-circle' : 'bi bi-check-circle'}></i>
              {' '}
              {analysis.has_issues ? 'Problemas Encontrados' : 'Código Limpo'}
            </div>
          )}

          {analysis.raw_response ? (
            <pre className="raw-response">{analysis.raw_response}</pre>
          ) : (
            <div className="analysis-grid">
              {analysis.error_type && (
                <div className="analysis-card">
                  <strong><i className="bi bi-bug"></i> Tipo do Erro</strong>
                  <p>{analysis.error_type}</p>
                </div>
              )}
              {analysis.location && (
                <div className="analysis-card">
                  <strong><i className="bi bi-geo-alt"></i> Localização</strong>
                  <p>{analysis.location}</p>
                </div>
              )}
              <div className="analysis-card full">
                <strong><i className="bi bi-lightbulb"></i> Explicação</strong>
                <p>{analysis.explanation}</p>
              </div>
              <div className="analysis-card full">
                <strong><i className="bi bi-wrench"></i> Solução</strong>
                <p>{analysis.solution}</p>
              </div>
              {analysis.best_practices && (
                <div className="analysis-card full">
                  <strong><i className="bi bi-star"></i> Boas Práticas</strong>
                  <p>{analysis.best_practices}</p>
                </div>
              )}
              {analysis.category && (
                <div className="analysis-card">
                  <strong><i className="bi bi-tag"></i> Categoria</strong>
                  <span className="badge">{analysis.category}</span>
                </div>
              )}
            </div>
          )}

          {newBadges.length > 0 && (
            <div className="badges-earned-inline">
              <h4><i className="bi bi-trophy"></i> Conquistas Desbloqueadas</h4>
              <div className="badges-list">
                {newBadges.map(badge => (
                  <div key={badge.id} className="badge-earned">
                    <span className="badge-name">{badge.name}</span>
                    <span className="badge-points">+{badge.points}pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="stats-footer">
            <div className="stat-item">
              <span className="stat-value">{points}</span>
              <span className="stat-label">Pontos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.total_analyses}</span>
              <span className="stat-label">Análises</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.errors_found}</span>
              <span className="stat-label">Erros</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.clean_codes}</span>
              <span className="stat-label">Limpos</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App