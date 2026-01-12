
export async function handler(event, context) {
  try {
    const incomingPath = (event.path || '').replace(/^\/api/, '');
    const query = event.rawQuery ? `?${event.rawQuery}` : '';
    const carApiUrl = `https://carapi.app/api${incomingPath}${query}`;

    console.log('Proxying to:', carApiUrl); // <-- ВСТАВИТЬ СЮДА для проверки

    const token = process.env.CAR_API_JWT;
    if (!token) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing CAR_API_JWT env var' }),
      };
    }

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
