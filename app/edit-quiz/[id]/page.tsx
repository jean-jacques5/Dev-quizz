"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Question {
  id: number
  text: string
  answer: boolean
}

interface Quiz {
  id: number
  title: string
  questionCount: number
  coverImage?: string
  questions: Question[]
  createdBy: string
}

export default function EditQuiz({ params }: { params: { id: string } }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [questionCount, setQuestionCount] = useState(1)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [answers, setAnswers] = useState<Record<number, boolean>>({})
  const [showIndicator, setShowIndicator] = useState(false)
  const [title, setTitle] = useState("")
  const [questions, setQuestions] = useState<Record<number, string>>({})
  const maxQuestions = 10
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  // Charger les données du quiz
  useEffect(() => {
    const loadQuiz = async () => {
      if (!isAuthenticated) {
        router.push("/login")
        return
      }

      setIsLoading(true)

      try {
        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Simuler des données de quiz (à remplacer par un appel API réel)
        const mockQuiz: Quiz = {
          id: Number.parseInt(params.id),
          title: `Quiz #${params.id}`,
          questionCount: 5,
          coverImage: "/placeholder.svg?key=quiz-cover",
          createdBy: user?.username || "unknown",
          questions: [
            { id: 1, text: "La Terre est plate.", answer: false },
            { id: 2, text: "L'eau bout à 100°C au niveau de la mer.", answer: true },
            { id: 3, text: "Le soleil tourne autour de la Terre.", answer: false },
            { id: 4, text: "Les humains utilisent seulement 10% de leur cerveau.", answer: false },
            { id: 5, text: "La Grande Muraille de Chine est visible depuis l'espace.", answer: false },
          ],
        }

        // Vérifier si l'utilisateur est le créateur du quiz
        if (mockQuiz.createdBy !== user?.username) {
          router.push("/profile")
          return
        }

        setQuiz(mockQuiz)
        setTitle(mockQuiz.title)
        setQuestionCount(mockQuiz.questionCount)

        // Initialiser les questions et réponses
        const questionsObj: Record<number, string> = {}
        const answersObj: Record<number, boolean> = {}

        mockQuiz.questions.forEach((q) => {
          questionsObj[q.id] = q.text
          answersObj[q.id] = q.answer
        })

        setQuestions(questionsObj)
        setAnswers(answersObj)
      } catch (error) {
        console.error("Erreur lors du chargement du quiz:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadQuiz()
  }, [isAuthenticated, params.id, router, user?.username])

  // Rediriger si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }, [])

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value)
    setQuestionCount(newValue)
    setShowIndicator(true)

    // Masquer l'indicateur après 2 secondes
    setTimeout(() => {
      setShowIndicator(false)
    }, 2000)
  }, [])

  const handleAnswerChange = useCallback((questionNumber: number, isTrue: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionNumber]: isTrue,
    }))
  }, [])

  const handleQuestionChange = useCallback((questionNumber: number, text: string) => {
    setQuestions((prev) => ({
      ...prev,
      [questionNumber]: text,
    }))
  }, [])

  const handleSubmit = useCallback(() => {
    if (!title) {
      alert("Veuillez entrer un titre pour le quiz")
      return
    }

    setIsSaving(true)

    // Simuler la sauvegarde du quiz
    setTimeout(() => {
      setIsSaving(false)
      alert(`Quiz "${title}" mis à jour avec succès!`)
      router.push("/profile")
    }, 1500)
  }, [title, router])

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

  // Si l'utilisateur n'est pas authentifié ou si le quiz est en cours de chargement, afficher un loader
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mt-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Si le quiz n'a pas été trouvé
  if (!quiz) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mt-4 text-center">
        <p>Quiz non trouvé</p>
      </div>
    )
  }

  // Générer les questions en fonction du nombre sélectionné
  const renderQuestions = () => {
    const leftColumnQuestions = []
    const rightColumnQuestions = []

    for (let i = 1; i <= maxQuestions; i++) {
      const questionElement = (
        <motion.div
          key={i}
          className={i > questionCount ? "hidden" : "block"}
          variants={itemVariants}
          initial="hidden"
          animate={i <= questionCount ? "visible" : "hidden"}
          custom={i}
        >
          <label htmlFor={`question${i}`} className="block text-sm font-medium text-black mb-2">
            Question {i}
          </label>
          <Textarea
            id={`question${i}`}
            placeholder={`entrer la question ${i}`}
            className="w-full rounded-md"
            value={questions[i] || ""}
            onChange={(e) => handleQuestionChange(i, e.target.value)}
          />
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">Réponse question {i}</label>
            <div className="flex rounded-full overflow-hidden border border-gray-300">
              <button
                type="button"
                onClick={() => handleAnswerChange(i, true)}
                className={`w-1/2 py-2 flex items-center justify-center transition-colors ${
                  answers[i] === true ? "bg-purple-500 text-white font-medium" : "bg-white hover:bg-gray-100"
                } cursor-pointer`}
              >
                {answers[i] === true && <Check className="h-4 w-4 mr-1" />}
                <span>VRAI</span>
              </button>
              <button
                type="button"
                onClick={() => handleAnswerChange(i, false)}
                className={`w-1/2 py-2 flex items-center justify-center transition-colors ${
                  answers[i] === false ? "bg-purple-500 text-white font-medium" : "bg-white hover:bg-gray-100"
                } cursor-pointer`}
              >
                {answers[i] === false && <Check className="h-4 w-4 mr-1" />}
                <span>FAUX</span>
              </button>
            </div>
          </div>
        </motion.div>
      )

      if (i <= 5) {
        leftColumnQuestions.push(questionElement)
      } else {
        rightColumnQuestions.push(questionElement)
      }
    }

    return { leftColumnQuestions, rightColumnQuestions }
  }

  const { leftColumnQuestions, rightColumnQuestions } = renderQuestions()

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm p-6 mt-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 className="text-xl text-gray-500 mb-6 text-center" variants={itemVariants}>
        Modification du quiz
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Colonne gauche */}
        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <label htmlFor="title" className="block text-sm font-medium text-black mb-2">
              titre de votre quiz
            </label>
            <Input
              id="title"
              placeholder="Entrez le titre de votre quiz..."
              className="w-full rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-600 mb-2">Nombre de question</label>
            <div className="relative pt-6 pb-4">
              {/* Affichage du nombre actuel de questions */}
              <div
                className="absolute -top-1 transform -translate-y-full"
                style={{ left: `calc(${((questionCount - 1) / (maxQuestions - 1)) * 100}% - 12px)` }}
              >
                <motion.div
                  className={`bg-purple-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full border border-purple-200 shadow-sm transition-opacity duration-300 ${
                    showIndicator ? "opacity-100" : "opacity-0"
                  }`}
                  animate={{
                    scale: showIndicator ? 1 : 0.8,
                    opacity: showIndicator ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {questionCount}
                </motion.div>
              </div>

              {/* Slider personnalisé */}
              <div className="relative">
                <div className="absolute h-1 bg-gray-200 rounded-full w-full"></div>
                <motion.div
                  className="absolute h-1 bg-purple-300 rounded-full"
                  initial={{ width: `${((quiz.questionCount - 1) / (maxQuestions - 1)) * 100}%` }}
                  animate={{ width: `${((questionCount - 1) / (maxQuestions - 1)) * 100}%` }}
                  transition={{ duration: 0.3 }}
                ></motion.div>

                {/* Points de repère */}
                <div className="relative w-full h-1">
                  {Array.from({ length: maxQuestions }).map((_, index) => (
                    <motion.div
                      key={index}
                      className={`absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full ${
                        index < questionCount ? "bg-purple-500" : "bg-gray-300"
                      }`}
                      style={{ left: `calc(${(index / (maxQuestions - 1)) * 100}% - 6px)` }}
                      animate={{
                        scale: index < questionCount ? 1 : 0.8,
                        backgroundColor: index < questionCount ? "#a855f7" : "#d1d5db",
                      }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                  ))}
                </div>

                <input
                  type="range"
                  min="1"
                  max={maxQuestions}
                  value={questionCount}
                  onChange={handleSliderChange}
                  className="w-full h-1 appearance-none bg-transparent cursor-pointer absolute top-0 z-10"
                  style={{
                    WebkitAppearance: "none",
                    appearance: "none",
                    outline: "none",
                    opacity: 0,
                  }}
                />
              </div>

              {/* Étiquettes min/max */}
              <div className="flex justify-between mt-4 text-xs text-gray-500">
                <span>1</span>
                <span>{maxQuestions}</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-600 mb-2">Image de couverture actuelle</label>
            <div className="relative aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
              <Image
                src={quiz.coverImage || "/placeholder.svg?key=quiz-cover"}
                alt="Couverture du quiz"
                fill
                className="object-cover"
              />
            </div>

            <label className="block text-sm font-medium text-gray-600 mb-2">Changer l'image de couverture</label>
            <div className="flex items-center space-x-4">
              <motion.label
                htmlFor="coverImage"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer"
                whileHover={{ scale: 1.05, backgroundColor: "#e5e7eb" }}
                whileTap={{ scale: 0.95 }}
              >
                sélectionner image
              </motion.label>
              <input type="file" id="coverImage" accept="image/*" onChange={handleFileChange} className="hidden" />
              <span className="text-xs text-gray-500">
                {selectedFile ? selectedFile.name : "img uniquement (png, jpg etc)"}
              </span>
            </div>
          </motion.div>

          {/* Questions de la colonne gauche (1-5) */}
          <div className="space-y-8">{leftColumnQuestions}</div>
        </div>

        {/* Colonne droite */}
        <div className="space-y-8">
          {/* Questions de la colonne droite (6-10) */}
          {rightColumnQuestions}

          {/* Boutons d'action */}
          <motion.div className="flex justify-center mt-8 space-x-4" variants={itemVariants}>
            <Button onClick={() => router.push("/profile")} variant="outline" className="rounded-full px-6">
              Annuler
            </Button>

            <Button
              onClick={handleSubmit}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-8 py-2"
              disabled={isSaving || !title}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
