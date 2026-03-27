'use client'

interface Props {
  onClose: () => void
}

const PLANS = [
  {
    name: '单次包',
    price: '¥1',
    desc: '额外 5 次处理',
    tag: '',
  },
  {
    name: '月度包',
    price: '¥9',
    desc: '当月无限次处理',
    tag: '推荐',
  },
]

export default function PaywallModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 relative">
        {/* 关闭 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="text-3xl mb-2">😅</div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">今日免费次数已用完</h2>
          <p className="text-sm text-gray-500">解锁更多次数，继续使用</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className="border-2 border-blue-100 rounded-2xl p-4 text-center hover:border-blue-400 cursor-pointer transition relative"
            >
              {plan.tag && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {plan.tag}
                </span>
              )}
              <div className="text-2xl font-bold text-blue-600">{plan.price}</div>
              <div className="text-sm font-semibold text-gray-800 mt-1">{plan.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">{plan.desc}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => alert('请扫描微信二维码联系付款\n\nWeChat: your_wechat_id')}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition"
        >
          联系微信付款
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 py-2 text-gray-400 hover:text-gray-600 text-sm transition"
        >
          明天再来（关闭）
        </button>
      </div>
    </div>
  )
}
