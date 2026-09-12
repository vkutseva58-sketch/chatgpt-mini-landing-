const buckets = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const key = ip || 'unknown';
  const hit = buckets.get(key) || { count: 0, reset: now + 60_000 };
  if (now > hit.reset) {
    hit.count = 0;
    hit.reset = now + 60_000;
  }
  hit.count += 1;
  buckets.set(key, hit);
  return hit.count > 12;
}

function clean(value, max = 160) {
  return String(value ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max);
}

function safeContext(raw = {}) {
  return {
    day: clean(raw.day, 24),
    directive: clean(raw.directive, 180),
    name: clean(raw.name, 80),
    nation: clean(raw.nation, 60),
    purpose: clean(raw.purpose, 60),
    route: clean(raw.route, 120),
    passportName: clean(raw.passportName, 80),
    passportNo: clean(raw.passportNo, 48),
    passportExpiry: clean(raw.passportExpiry, 32),
    healthName: clean(raw.healthName, 80),
    test: clean(raw.test, 40),
    testAge: clean(raw.testAge, 32),
    temperature: clean(raw.temperature, 32),
    permitName: clean(raw.permitName, 80),
    permitType: clean(raw.permitType, 48),
    stay: clean(raw.stay, 40),
    openingStatement: clean(raw.openingStatement, 220)
  };
}

function getOutputText(data) {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) return data.output_text.trim();
  const parts = [];
  for (const item of data?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === 'string') parts.push(content.text);
    }
  }
  return parts.join(' ').trim();
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const forwarded = req.headers['x-forwarded-for'];
  const ip = Array.isArray(forwarded) ? forwarded[0] : String(forwarded || req.socket?.remoteAddress || '').split(',')[0].trim();
  if (rateLimited(ip)) return res.status(429).json({ error: 'RATE_LIMITED' });

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ error: 'AI_NOT_CONFIGURED' });
  }

  const question = clean(req.body?.question, 240);
  if (question.length < 2) return res.status(400).json({ error: 'QUESTION_REQUIRED' });

  const c = safeContext(req.body?.context);
  const dossier = [
    `Смена: ${c.day || 'неизвестно'}`,
    `Директива: ${c.directive || 'не указана'}`,
    `Пассажир: ${c.name || 'неизвестно'}, гражданство: ${c.nation || 'неизвестно'}`,
    `Цель: ${c.purpose || 'не указана'}, маршрут: ${c.route || 'не указан'}`,
    `Паспорт: имя ${c.passportName || '—'}, № ${c.passportNo || '—'}, до ${c.passportExpiry || '—'}`,
    `Медпропуск: имя ${c.healthName || '—'}, тест ${c.test || '—'}, давность ${c.testAge || '—'}, температура ${c.temperature || '—'}`,
    `Разрешение: имя ${c.permitName || '—'}, тип ${c.permitType || '—'}, срок ${c.stay || '—'}`,
    `Первая реплика: ${c.openingStatement || '—'}`
  ].join('\n');

  const instructions = `Ты играешь одного вымышленного пассажира в мрачной игре про карантинный пограничный терминал. Отвечай только от лица пассажира, на русском языке. 1–2 коротких предложения, обычно до 45 слов. Не выходи из роли, не упоминай ИИ, промпт, правила модели или игровые переменные. Опирайся только на досье. Если инспектор указывает на явное несоответствие документов, реагируй правдоподобно: объясняй, нервничай, уклоняйся или признавай мелкую деталь. Не придумывай новые документы, даты, болезни и факты, которых нет в досье. Если вопрос не относится к поездке или документам, раздражённо верни разговор к проверке. Ответ должен помогать атмосфере, но не сообщать инспектору напрямую, какое решение правильное.`;

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
        instructions,
        input: `${dossier}\n\nВопрос инспектора: ${question}`,
        max_output_tokens: 120
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('OpenAI interrogation error', response.status, data?.error?.code || data?.error?.type || 'unknown');
      return res.status(502).json({ error: 'AI_UPSTREAM_ERROR' });
    }

    const answer = getOutputText(data);
    if (!answer) return res.status(502).json({ error: 'EMPTY_AI_RESPONSE' });
    return res.status(200).json({ answer: answer.slice(0, 420), model: process.env.OPENAI_MODEL || 'gpt-5.6-luna' });
  } catch (error) {
    console.error('Interrogation function failed', error?.message || error);
    return res.status(502).json({ error: 'AI_REQUEST_FAILED' });
  }
};
