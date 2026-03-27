import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const apiKey = process.env.REMOVE_BG_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  const formData = await request.formData()
  const file = formData.get('image_file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
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
    return NextResponse.json({ error: `remove.bg API error: ${error}` }, { status: response.status })
  }

  const imageBuffer = await response.arrayBuffer()
  return new NextResponse(imageBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'no-store',
    },
  })
}
