import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { AuthProvider } from "@/contexts/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Quiz App",
  description: "Application de quiz interactive",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-gray-100">
            <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 bg-gray-100">
              <Header />
              <main className="flex-grow w-full">{children}</main>
              <Footer />
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}


import './globals.css'