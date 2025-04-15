"use client"

import QuizGrid from "@/components/QuizGrid"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, Plus } from "lucide-react"
import Link from "next/link"

export default function Profile() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  // Rediriger si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Simuler des données utilisateur
  const quizzes = Array(6)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      title: "titre quiz",
      rank: "1st",
      imageUrl: "/placeholder.svg?key=rbpww",
      createdBy: user?.username || "unknown",
    }))

  // Variants d'animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  // Si l'utilisateur n'est pas authentifié, ne pas afficher le contenu
  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm p-6 mt-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="flex items-center justify-between mb-8" variants={itemVariants}>
        <div className="flex items-center space-x-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Avatar className="h-16 w-16">
              <AvatarImage src="/vibrant-street-market.png" alt={user.username} />
              <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/create-quiz">
              <Button className="flex items-center space-x-2 bg-transparent text-purple-500 border-2 border-purple-500 hover:bg-purple-500 hover:text-white hover:border-white active:opacity-50 transition-all duration-200">
                <Plus className="h-4 w-4" />
                <span>Créer un quiz</span>
              </Button>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={logout}
              variant="outline"
              className="flex items-center space-x-2 text-red-500 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div className="mt-8" variants={itemVariants}>
        <motion.h2 className="text-xl font-bold mb-6" variants={itemVariants}>
          Vos quiz:
        </motion.h2>
        <QuizGrid quizzes={quizzes} showEditButton={true} />
      </motion.div>
    </motion.div>
  )
}
