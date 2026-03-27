import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '证件照换底色 - 10秒搞定',
  description: '上传证件照，自动抠图，一键换红底/蓝底/白底，免费试用',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
