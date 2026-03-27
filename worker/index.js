/**
 * Cloudflare Worker - remove.bg API Proxy
 * 
 * 部署步骤：
 * 1. 安装 wrangler: npm install -g wrangler
 * 2. 设置 secret: wrangler secret put REMOVE_BG_API_KEY
 * 3. 部署: wrangler deploy
 */

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 })
    }

    const url = new URL(request.url)
    if (url.pathname !== '/api/remove-bg') {
      return new Response('Not Found', { status: 404 })
    }

    const apiKey = env.REMOVE_BG_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const formData = await request.formData()
    const file = formData.get('image_file')
    if (!file) {
      return new Response(JSON.stringify({ error: 'No image file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const removeBgForm = new FormData()
    removeBgForm.append('image_file', file)
    removeBgForm.append('size', 'auto')

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: removeBgForm,
    })

    if (!response.ok) {
      const error = await response.text()
      return new Response(JSON.stringify({ error: `remove.bg API error: ${error}` }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    const imageBuffer = await response.arrayBuffer()
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      },
    })
  },
}
