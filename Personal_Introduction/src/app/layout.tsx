import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="bg-background text-text min-h-screen">
        {children}
      </body>
    </html>
  )
}