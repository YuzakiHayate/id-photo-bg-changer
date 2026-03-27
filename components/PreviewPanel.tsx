'use client'

interface Props {
  originalUrl: string
  composedUrl: string
  isProcessing: boolean
}

export default function PreviewPanel({ originalUrl, composedUrl, isProcessing }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* 原图 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-xs text-gray-500 font-medium mb-3 text-center">原图</p>
        <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalUrl}
            alt="原图"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* 换色后 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-xs text-gray-500 font-medium mb-3 text-center">换色后</p>
        <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
          {isProcessing ? (
            <div className="text-gray-400 text-sm">处理中…</div>
          ) : composedUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={composedUrl}
              alt="换色后"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-gray-300 text-sm">等待抠图完成</div>
          )}
        </div>
      </div>
    </div>
  )
}
