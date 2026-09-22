import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import process from 'node:process'
import { getUljinWeather } from './server/kma-weather.js'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    vueDevTools(),
    {
      name: 'local-uljin-api',
      configureServer(server) {
        const env = loadEnv(mode, process.cwd(), '')
        server.middlewares.use('/api/uljin-weather', async (req, res) => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          if (req.method !== 'GET') {
            res.statusCode = 405
            res.end(JSON.stringify({ error: 'GET 요청만 지원합니다.' }))
            return
          }
          try {
            const data = await getUljinWeather(new URL(req.url, 'http://localhost').searchParams, {
              apiKey: env.KMA_API_KEY,
            })
            res.end(JSON.stringify(data))
          } catch (error) {
            res.statusCode = error.status || 502
            res.end(
              JSON.stringify({
                error: error.status
                  ? error.message
                  : '기상청 자료를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
              }),
            )
          }
        })
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
