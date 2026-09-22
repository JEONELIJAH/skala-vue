import { getUljinWeather } from '../server/kma-weather.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'GET 요청만 지원합니다.' })
  }
  try {
    const data = await getUljinWeather(new URL(req.url, 'http://localhost').searchParams)
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=600, stale-while-revalidate=300')
    return res.status(200).json(data)
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store')
    return res.status(error.status || 502).json({
      error: error.status
        ? error.message
        : '기상청 자료를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
    })
  }
}
