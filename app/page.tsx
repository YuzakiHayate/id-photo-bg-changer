'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import PaywallModal from '@/components/PaywallModal'
import UploadZone from '@/components/UploadZone'
import PreviewPanel from '@/components/PreviewPanel'
import ColorPicker from '@/components/ColorPicker'

const PRESET_COLORS = [
  { name: '红底', value: '#E60012', label: '红' },
  { name: '蓝底', value: '#2563EB', label: '蓝' },
  { name: '白底', value: '#FFFFFF', label: '白' },
]

const FREE_LIMIT = 2
const STORAGE_KEY = 'idphoto_usage'

function getTodayUsage(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return 0
    const data = JSON.parse(raw)
    const today = new Date().toDateString()
    if (data.date !== today) return 0
    return data.count || 0
  } catch {
    return 0
  }
}

function incrementUsage(): number {
  try {
    const count = getTodayUsage() + 1
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      date: new Date().toDateString(),
      count,
    }))
    return count
  } catch {
    return 1
  }
}

export default function HomePage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string>('')
  const [removedBgUrl, setRemovedBgUrl] = useState<string>('')
  const [composedUrl, setComposedUrl] = useState<string>('')
  const [bgColor, setBgColor] = useState('#E60012')
  const [customColor, setCustomColor] = useState('#E60012')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>('')
  const [showPaywall, setShowPaywall] = useState(false)
  const [todayUsage, setTodayUsage] = useState(0)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setTodayUsage(getTodayUsage())
  }, [])

  const remaining = Math.max(0, FREE_LIMIT - todayUsage)

  const handleFileSelect = useCallback(async (file: File) => {
    setError('')
    setRemovedBgUrl('')
    setComposedUrl('')
    setOriginalFile(file)
    setOriginalUrl(URL.createObjectURL(file))
    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append('image_file', file)

      const res = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `请求失败 (${res.status})`)
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setRemovedBgUrl(url)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '未知错误'
      setError(`抠图失败：${message}`)
    } finally {
      setIsProcessing(false)
    }
  }, [])

  // 当抠图完成或背景色变化时，重新合成图片
  useEffect(() => {
    if (!removedBgUrl) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      setComposedUrl(canvas.toDataURL('image/jpeg', 0.95))
    }
    img.src = removedBgUrl
  }, [removedBgUrl, bgColor])

  const handleDownload = () => {
    if (!composedUrl) return

    if (remaining <= 0) {
      setShowPaywall(true)
      return
    }

    const newCount = incrementUsage()
    setTodayUsage(newCount)

    const a = document.createElement('a')
    a.href = composedUrl
    a.download = `id-photo-${bgColor.replace('#', '')}.jpg`
    a.click()
  }

  const handleColorChange = (color: string) => {
    setBgColor(color)
    setCustomColor(color)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold">证</div>
          <span className="font-semibold text-gray-800 text-lg">证件照换底色</span>
          <span className="ml-auto text-sm text-gray-500">今日剩余免费次数：
            <span className={`font-bold ${remaining === 0 ? 'text-red-500' : 'text-blue-600'}`}>{remaining}</span>
            /{FREE_LIMIT}
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">证件照换底色，10秒搞定</h1>
          <p className="text-gray-500">支持红底 / 蓝底 / 白底，自动抠图，免费试用</p>
        </div>

        {/* 上传区 */}
        {!originalUrl && (
          <UploadZone onFileSelect={handleFileSelect} />
        )}

        {/* 错误提示 */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
            {error}
            <button className="ml-3 underline" onClick={() => setError('')}>关闭</button>
          </div>
        )}

        {/* 处理中 */}
        {isProcessing && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-700 px-6 py-4 rounded-2xl">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              正在抠图，请稍候…
            </div>
          </div>
        )}

        {/* 预览区 + 控制 */}
        {originalUrl && !isProcessing && (
          <div className="mt-6 space-y-6">
            <PreviewPanel
              originalUrl={originalUrl}
              composedUrl={composedUrl}
              isProcessing={isProcessing}
            />

            {/* 换色控制 */}
            {removedBgUrl && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700 mb-4">选择背景颜色</h2>
                <ColorPicker
                  presets={PRESET_COLORS}
                  selected={bgColor}
                  custom={customColor}
                  onChange={handleColorChange}
                />
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setOriginalFile(null)
                  setOriginalUrl('')
                  setRemovedBgUrl('')
                  setComposedUrl('')
                  setError('')
                }}
                className="px-5 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium transition"
              >
                重新上传
              </button>

              {composedUrl && (
                <button
                  onClick={handleDownload}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-sm"
                >
                  {remaining > 0 ? '⬇ 下载图片' : '下载（需付费）'}
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 隐藏 canvas 用于图像合成 */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 付费弹窗 */}
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}

      {/* 底部 */}
      <footer className="mt-20 py-6 border-t border-gray-200 text-center text-xs text-gray-400">
        <span>© 2026 证件照换底色</span>
        <span className="mx-2">·</span>
        <span>用户图片不会被存储，处理完即丢弃</span>
        <span className="mx-2">·</span>
        <span>联系我们</span>
      </footer>
    </div>
  )
}
