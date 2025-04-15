"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import Link from "next/link"

interface Question {
  id: number
  text: string
  answer: boolean
}

interface Quiz {
  id: number
  title: string
  description: string
  questionCount: number
  createdBy: string
  questions: Question[]
}

export default function QuizPage({ params }: { params: { id: string } }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Simuler le chargement des données du quiz
    const loadQuiz = async () => {
      setIsLoading(true)

      // Simuler un délai réseau
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Simuler des données de quiz
      const mockQuiz: Quiz = {
        id: Number.parseInt(params.id),
        title: `Quiz #${params.id}`,
        description: "Description du quiz avec des détails sur le contenu et la difficulté.",
        questionCount: 5,
        createdBy: "utilisateur_test",
        questions: [
          { id: 1, text: "La Terre est plate.", answer: false },
          { id: 2, text: "L'eau bout à 100°C au niveau de la mer.", answer: true },
          { id: 3, text: "Le soleil tourne autour de la Terre.", answer: false },
          { id: 4, text: "Les humains utilisent seulement 10% de leur cerveau.", answer: false },
          { id: 5, text: "La Grande Muraille de Chine est visible depuis l'espace.", answer: false },
        ],
      }

      setQuiz(mockQuiz)
      setIsLoading(false)
    }

    loadQuiz()
  }, [params.id])

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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mt-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <motion.div
        className="bg-white rounded-lg shadow-sm p-8 mt-4 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Lock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">Contenu réservé aux membres</h2>
          <p className="text-gray-500 mb-6">Vous devez être connecté pour accéder à ce quiz</p>

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
      </motion.div>
    )
  }

  if (!quiz) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mt-4 text-center">
        <p>Quiz non trouvé</p>
      </div>
    )
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm p-6 mt-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 className="text-2xl font-bold mb-2" variants={itemVariants}>
        {quiz.title}
      </motion.h1>

      <motion.div className="mb-6 text-gray-500" variants={itemVariants}>
        <p>{quiz.description}</p>
        <p className="mt-2">
          <span className="font-medium">{quiz.questionCount} questions</span> • Créé par {quiz.createdBy}
        </p>
      </motion.div>

      <motion.div className="space-y-6" variants={itemVariants}>
        <h2 className="text-xl font-medium mb-4">Questions:</h2>

        {quiz.questions.map((question, index) => (
          <motion.div
            key={question.id}
            className="bg-gray-50 p-4 rounded-lg"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.2 + index * 0.1,
                  duration: 0.4,
                },
              },
            }}
          >
            <p className="font-medium mb-2">
              Question {index + 1}: {question.text}
            </p>
            <p className="text-sm">
              Réponse:{" "}
              <span className={question.answer ? "text-green-600" : "text-red-600"}>
                {question.answer ? "VRAI" : "FAUX"}
              </span>
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="mt-8 flex justify-center" variants={itemVariants}>
        <Button onClick={() => router.push("/")} className="bg-gray-300 hover:bg-gray-400 text-black rounded-full px-8">
          Retour à l'accueil
        </Button>
      </motion.div>
    </motion.div>
  )
}
