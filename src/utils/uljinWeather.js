const DAY = 86400000

export const koreaToday = () => new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 10)
export const shiftDate = (date, amount) =>
  new Date(Date.parse(`${date}T00:00:00Z`) + amount * DAY).toISOString().slice(0, 10)
export const formatNumber = (value, digits = 1) =>
  !Number.isFinite(value) ? '—' : Number(value.toFixed(digits)).toLocaleString('ko-KR')
export const shortDate = (date) => `${Number(date.slice(5, 7))}.${Number(date.slice(8, 10))}`

const valid = (rows, field) => rows.map((row) => row[field]).filter(Number.isFinite)
const mean = (values) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null

export function dailyWeather(observations, from, to) {
  const groups = new Map()
  for (const row of observations) {
    const date = row.time.slice(0, 10)
    if (!groups.has(date)) groups.set(date, [])
    groups.get(date).push(row)
  }
  const days = []
  for (let date = from; date <= to; date = shiftDate(date, 1)) {
    const rows = groups.get(date) || []
    const temperatures = valid(rows, 'temperature')
    const rain = valid(rows, 'precipitation')
    days.push({
      date,
      rows,
      temperature: mean(temperatures),
      low: temperatures.length ? Math.min(...temperatures) : null,
      high: temperatures.length ? Math.max(...temperatures) : null,
      humidity: mean(valid(rows, 'humidity')),
      windSpeed: mean(valid(rows, 'windSpeed')),
      precipitation: rain.length ? rain.reduce((sum, value) => sum + value, 0) : null,
      incomplete: rows.length < 24 || temperatures.length < 24,
      rainIncomplete: rows.some((row) => row.precipitation === null) || rows.length < 24,
    })
  }
  return days
}
