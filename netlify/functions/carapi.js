
// netlify/functions/carapi.js
// В Node 18+ на Netlify fetch доступен глобально — импорт не нужен.

export async function handler(event, context) {
  try {
    // Пример: вызов /api/makes?year=2020
    // event.path = "/api/makes"
    // event.rawQuery = "year=2020"

    const incomingPath = (event.path || '').replace(/^\/api/, ''); // -> "/makes" или "/models"
    const query = event.rawQuery ? `?${event.rawQuery}` : '';

    const token = process.env.CAR_API_JWT;
    if (!token) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing CAR_API_JWT env var' }),
      };
    }

    const carApiUrl = `https://carapi.app/api${incomingPath}${query}`;

    const apiRes = await fetch(carApiUrl, {
      method: event.httpMethod || 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const body = await apiRes.text();

    return {
      statusCode: apiRes.status,
      headers: {
        'Content-Type': apiRes.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message, stack: err.stack }),
    };
  }
}
