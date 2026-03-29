export async function onRequestPost({ request, env }) {
  // CORS preflight
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  const apiKey = env.REMOVE_BG_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }

  let file
  try {
    const formData = await request.formData()
    file = formData.get('image_file')
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to parse form data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }

  if (!file) {
    return new Response(JSON.stringify({ error: 'No image file provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }

  const removeBgForm = new FormData()
  removeBgForm.append('image_file', file)
  removeBgForm.append('size', 'auto')

  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': apiKey },
    body: removeBgForm,
  })

  if (!response.ok) {
    const error = await response.text()
    return new Response(JSON.stringify({ error: `remove.bg error (${response.status}): ${error}` }), {
      status: response.status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }

  const imageBuffer = await response.arrayBuffer()
  return new Response(imageBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'no-store',
      ...corsHeaders,
    },
  })
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
