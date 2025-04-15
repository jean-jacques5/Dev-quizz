"use client"

import QuizGrid from "@/components/QuizGrid"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { Lock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Category({ params }: { params: { id: string } }) {
  const { isAuthenticated } = useAuth()

  // Simuler des données de catégorie
  const category = {
    id: params.id,
    title: "titre de la categorie",
    quizzes: Array(6)
      .fill(null)
      .map((_, i) => ({
        id: i + 1,
        title: "titre quiz",
        rank: "1st",
        imageUrl: "/placeholder.svg?key=qv39e",
      })),
  }

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

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm p-6 mt-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 className="text-2xl font-bold mb-8" variants={itemVariants}>
        {category.title}
      </motion.h1>

      {isAuthenticated ? (
        <motion.div variants={itemVariants}>
          <QuizGrid quizzes={category.quizzes} />
        </motion.div>
      ) : (
        <motion.div className="bg-gray-50 rounded-lg p-6 text-center" variants={itemVariants}>
          <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">Contenu réservé aux membres</h3>
          <p className="text-gray-500 mb-4">Connectez-vous pour accéder aux quiz de cette catégorie</p>
          <div className="flex justify-center space-x-4">
            <Link href="/signup">
              <Button className="bg-gray-300 hover:bg-gray-400 text-black rounded-full px-6">Inscription</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="rounded-full px-6">
                Connexion
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
