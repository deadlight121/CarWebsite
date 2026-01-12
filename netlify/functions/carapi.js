
import fetch from 'node-fetch'

export default async (req, context) => {
  try {
    // Пример: клиент вызывает /api/makes?year=2020
    const url = new URL(req.url)
    const path = url.pathname.replace(/^\/api/, '') // '/makes' или '/models'
    const query = url.search || ''                   // '?year=2020' и т.п.

    // Читаем JWT из переменных окружения Netlify
    const token = process.env.CAR_API_JWT
    if (!token) {
      return new Response(JSON.stringify({ error: 'Missing CAR_API_JWT' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Проксируем запрос на CarAPI
    const carApiUrl = `https://carapi.app/api${path}${query}`
    const carRes = await fetch(carApiUrl, {
      method: req.method, // обычно GET
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    // Пробрасываем результат
    const body = await carRes.text()
    return new Response(body, {
      status: carRes.status,
      headers: {
        'Content-Type': carRes.headers.get('content-type') || 'application/json',
        // Разрешаем CORS для твоего фронта (тот же домен на Netlify)
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
``
