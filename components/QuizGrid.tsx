"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Edit } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface Quiz {
  id: number
  title: string
  rank: string
  imageUrl?: string
  createdBy?: string
}

interface QuizGridProps {
  quizzes: Quiz[]
  showEditButton?: boolean
}

export default function QuizGrid({ quizzes, showEditButton = false }: QuizGridProps) {
  const { user } = useAuth()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {quizzes.map((quiz, index) => (
        <motion.div
          key={quiz.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.05,
            ease: "easeOut",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative">
            <Link href={`/quiz/${quiz.id}`} className="block">
              <div className="bg-gray-200 rounded-lg p-2">
                <div className="relative aspect-square bg-gray-300 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                  <Image
                    src={quiz.imageUrl || "/placeholder.svg?height=200&width=200&query=quiz"}
                    alt={`Quiz ${quiz.title}`}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-2 left-2 flex items-center">
                    <div className="w-6 h-6 bg-gray-400"></div>
                    <span className="text-xs text-gray-500 ml-1">{quiz.rank}</span>
                  </div>
                </div>
                <div className="bg-white rounded-full py-2 px-4 text-center">
                  <p className="text-sm">{quiz.title}</p>
                </div>
              </div>
            </Link>

            {/* Bouton d'édition (visible uniquement sur la page de profil et si l'utilisateur est le créateur) */}
            {showEditButton && quiz.createdBy === user?.username && (
              <Link href={`/edit-quiz/${quiz.id}`} className="absolute top-2 right-2">
                <motion.div
                  className="bg-white p-2 rounded-full shadow-md"
                  whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Edit className="h-4 w-4 text-purple-500" />
                </motion.div>
              </Link>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
