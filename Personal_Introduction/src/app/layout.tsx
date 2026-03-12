import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="dark" suppressHydrationWarning>
      <body className="bg-background text-text min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}