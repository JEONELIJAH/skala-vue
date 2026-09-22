import process from 'node:process'

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR
const cache = new Map()
const pending = new Map()

export function koreanDate(now = Date.now()) {
  return new Date(now + 9 * HOUR).toISOString().slice(0, 10)
}

function dateMillis(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN
  const time = Date.parse(`${value}T00:00:00+09:00`)
  return Number.isFinite(time) && koreanDate(time) === value ? time : NaN
}

export function resolveRange(search, now = Date.now()) {
  const today = koreanDate(now)
  const to = search.get('to') || today
  const toMillis = dateMillis(to)
  const from =
    search.get('from') || (Number.isFinite(toMillis) ? koreanDate(toMillis - 27 * DAY) : '')
  const start = dateMillis(from)
  const end = dateMillis(to)
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start > end ||
    end > dateMillis(today) ||
    end - start >= 31 * DAY
  ) {
    const error = new Error('오늘까지의 기간을 최대 31일 이내로 선택해 주세요.')
    error.status = 400
    throw error
  }
  return { from, to }
}

const number = (value, min, max) => {
  const result = Number(value)
  return value !== undefined &&
    value !== '-' &&
    Number.isFinite(result) &&
    result >= min &&
    result <= max
    ? result
    : null
}

export function parseObservations(text) {
  const rows = new Map()
  for (const line of text.split(/\r?\n/)) {
    if (!/^\d{12}\s/.test(line)) continue
    const cells = line.trim().split(/\s+/)
    if (cells.length < 46 || cells[1] !== '130') continue
    const stamp = cells[0]
    const time = `${stamp.slice(0, 4)}-${stamp.slice(4, 6)}-${stamp.slice(6, 8)}T${stamp.slice(8, 10)}:${stamp.slice(10, 12)}:00+09:00`
    if (!Number.isFinite(Date.parse(time))) continue
    const rainPeriodHours = [11, 12, 1, 2, 3].includes(Number(stamp.slice(4, 6))) ? 3 : 1
    const rainReported = number(cells[15], 0, 3000)
    // IR=3은 기상청이 명시한 무강수. 그 외 음수 강수값은 결측으로 유지한다.
    const precipitation = rainReported ?? (cells[44] === '3' ? 0 : null)
    rows.set(time, {
      time,
      temperature: number(cells[11], -90, 65),
      humidity: number(cells[13], 0, 100),
      windSpeed: number(cells[3], 0, 150),
      windDirection: number(cells[2], 0, 36),
      pressure: number(cells[8], 800, 1100),
      cloudCover: number(cells[25], 0, 10),
      precipitation,
      rainPeriodHours,
    })
  }
  return [...rows.values()].sort((a, b) => a.time.localeCompare(b.time))
}

export async function getUljinWeather(
  search,
  { apiKey = process.env.KMA_API_KEY, now = Date.now(), fetcher = fetch } = {},
) {
  const range = resolveRange(search, now)
  if (!apiKey) {
    const error = new Error('기상청 데이터 연결을 준비하고 있습니다. 잠시 후 다시 확인해 주세요.')
    error.status = 503
    throw error
  }
  const cacheKey = `${range.from}:${range.to}`
  const saved = cache.get(cacheKey)
  if (saved && now - saved.savedAt < 10 * 60 * 1000) return saved.data
  if (pending.has(cacheKey)) return pending.get(cacheKey)

  const request = (async () => {
    const url = new URL('https://apihub.kma.go.kr/api/typ01/url/kma_sfctm3.php')
    const currentHour = new Date(now + 9 * HOUR).toISOString().slice(11, 13)
    url.search = new URLSearchParams({
      tm1: `${range.from.replaceAll('-', '')}0000`,
      tm2: `${range.to.replaceAll('-', '')}${range.to === koreanDate(now) ? currentHour : '23'}00`,
      stn: '130',
      help: '0',
      authKey: apiKey,
    })
    const response = await fetcher(url, { signal: AbortSignal.timeout(20000) })
    if (!response.ok) throw new Error('기상청 응답을 받지 못했습니다. 잠시 후 다시 시도해 주세요.')
    const text = new TextDecoder('euc-kr').decode(await response.arrayBuffer())
    if (!text.includes('#START7777') || !text.includes('#7777END')) {
      throw new Error('기상청 자료를 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.')
    }
    const observations = parseObservations(text)
    const data = {
      station: { id: 130, name: '울진', provider: '기상청 ASOS' },
      range,
      fetchedAt: new Date(now).toISOString(),
      observations,
    }
    if (cache.size >= 20) cache.delete(cache.keys().next().value)
    cache.set(cacheKey, { savedAt: now, data })
    return data
  })()
  pending.set(cacheKey, request)
  try {
    return await request
  } finally {
    pending.delete(cacheKey)
  }
}
