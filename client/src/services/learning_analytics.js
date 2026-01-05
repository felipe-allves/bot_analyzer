import { getHistory } from './gamification'

const LEARNING_WINDOW = 8

export const analyzeLearning = () => {
  const history = getHistory()
  
  if (history.length < 5) {
    return null
  }

  const recent = history.slice(0, LEARNING_WINDOW)
  const older = history.slice(LEARNING_WINDOW, LEARNING_WINDOW * 2)

  if (older.length < 3) {
    return null
  }

  const recentErrors = recent.filter(h => h.has_issues).length
  const olderErrors = older.filter(h => h.has_issues).length
  
  const recentErrorRate = recentErrors / recent.length
  const olderErrorRate = olderErrors / older.length
  
  const improvement = olderErrorRate - recentErrorRate

  const repeatedErrors = findRepeatedErrors(recent)
  const hasRecentError = recent[0]?.has_issues

  let status = 'stable'
  let message = 'Mantendo desempenho estável'
  
  if (hasRecentError && repeatedErrors.length > 0) {
    status = 'repeated_errors'
    message = `Atenção: repetindo erros em ${repeatedErrors[0]}`
  } else if (improvement > 0.25) {
    status = 'improving'
    message = 'Excelente! Menos erros que antes'
  } else if (improvement > 0.1) {
    status = 'improving'
    message = 'Progredindo bem, continue assim'
  } else if (improvement < -0.25) {
    status = 'regressing'
    message = 'Taxa de erros aumentou recentemente'
  } else if (improvement < -0.1) {
    status = 'regressing'
    message = 'Mais erros nas últimas análises'
  }

  const progress = Math.max(10, Math.min(100, 50 + (improvement * 150)))

  return {
    status,
    message,
    progress: Math.round(progress),
    shouldShow: true
  }
}

const findRepeatedErrors = (history) => {
  if (history.length < 4) return []
  
  const recentCategories = history
    .slice(0, 4)
    .filter(h => h.has_issues && h.category)
    .map(h => h.category)
  
  const categoryCount = {}
  recentCategories.forEach(cat => {
    categoryCount[cat] = (categoryCount[cat] || 0) + 1
  })

  return Object.entries(categoryCount)
    .filter(([_, count]) => count >= 2)
    .map(([category]) => category)
}

export const getLearningTrend = () => {
  const history = getHistory()
  
  if (history.length < 10) return []

  const chunks = []
  const chunkSize = 5

  for (let i = 0; i < Math.min(history.length, 30); i += chunkSize) {
    const chunk = history.slice(i, i + chunkSize)
    const errorRate = chunk.filter(h => h.has_issues).length / chunk.length
    chunks.push({
      index: chunks.length,
      errorRate: Math.round(errorRate * 100)
    })
  }

  return chunks.reverse()
}