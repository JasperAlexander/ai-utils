export function relativeTimeFormat(date: Date): string {
  const now = new Date()
  const msPerMinute = 60 * 1000
  const msPerHour = msPerMinute * 60
  const msPerDay = msPerHour * 24
  const msPerMonth = msPerDay * 30
  const msPerYear = msPerDay * 365

  const elapsed = now.getTime() - date.getTime()

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  if (elapsed < msPerMinute) {
    const seconds = Math.round(elapsed / 1000)
    return rtf.format(-seconds, 'second')
  } else if (elapsed < msPerHour) {
    const minutes = Math.round(elapsed / msPerMinute)
    return rtf.format(-minutes, 'minute')
  } else if (elapsed < msPerDay) {
    const hours = Math.round(elapsed / msPerHour)
    return rtf.format(-hours, 'hour')
  } else if (elapsed < msPerMonth) {
    const days = Math.round(elapsed / msPerDay)
    return rtf.format(-days, 'day')
  } else if (elapsed < msPerYear) {
    const months = Math.round(elapsed / msPerMonth)
    return rtf.format(-months, 'month')
  } else {
    const years = Math.round(elapsed / msPerYear)
    return rtf.format(-years, 'year')
  }
}
