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
import { createClient } from "@/utils/supabase/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateQuiz() {
  const [questionCount, setQuestionCount] = useState(1)
  // Commented out file selection
  // const [selectedFile, setSelectedFile] = useState<File | null>(null)
  // const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<number, boolean>>({})
  const [questions, setQuestions] = useState<Record<number, string>>({})
  const [showIndicator, setShowIndicator] = useState(false)
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState<string>("")
  const maxQuestions = 10
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Commented out file change handler
  /*
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
    }
  }, [])
  */

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value)
    setQuestionCount(newValue)
    setShowIndicator(true)
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

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value)
  }, [])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!title.trim()) {
        setError("Veuillez fournir un titre pour le quiz")
        setLoading(false)
        return
      }

      if (!category) {
        setError("Veuillez sélectionner une catégorie")
        setLoading(false)
        return
      }

      for (let i = 1; i <= questionCount; i++) {
        if (!questions[i] || questions[i].trim() === '') {
          setError(`La question ${i} ne peut pas être vide`)
          setLoading(false)
          return
        }
        if (answers[i] === undefined) {
          setError(`Veuillez sélectionner une réponse pour la question ${i}`)
          setLoading(false)
          return
        }
      }

      const supabase = createClient()
      
      // Debug your database schema
      console.log("Attempting to create quiz with data:", {
        titre_quiz: title,
        image_path: "img/logo.png",
        id_utilisateur: user?.id,
        id_categorie: parseInt(category)
      })
      
      // Try using a simpler quiz insert first
      const { data: quizData, error: quizError } = await supabase
        .from('quiz')
        .insert({
          titre_quiz: title,
          image_path: "img/logo.png",
          id_utilisateur: user?.id,
          id_categorie: parseInt(category)
        })
        .select()

      if (quizError) {
        console.error("Erreur détaillée lors de la création du quiz:", quizError)
        setError(`Erreur lors de la création du quiz: ${quizError.message || JSON.stringify(quizError)}`)
        setLoading(false)
        return
      }

      const quizId = quizData[0].id
      
      // Insert questions and responses according to new structure
      for (let i = 1; i <= questionCount; i++) {
        // First insert the question
        const { data: questionData, error: questionError } = await supabase
          .from('question')
          .insert({
            id_quiz: quizId,
            question: questions[i],
            is_reponse_question: 2 // Using 2 as default value based on your example
          })
          .select()

        if (questionError) {
          console.error(`Erreur lors de l'ajout de la question ${i}:`, questionError)
          setError(`Erreur lors de l'ajout de la question ${i}: ${questionError.message}`)
          // Don't delete the quiz on error, let's just report the issue
          setLoading(false)
          return
        }

        // Then insert the response for that question
        const questionId = questionData[0].id_question
        const { error: responseError } = await supabase
          .from('reponse_question')
          .insert({
            id_quiz: quizId,
            id_question: questionId,
            reponse: answers[i]
          })

        if (responseError) {
          console.error(`Erreur lors de l'ajout de la réponse ${i}:`, responseError)
          setError(`Erreur lors de l'ajout de la réponse ${i}: ${responseError.message}`)
          setLoading(false)
          return
        }
      }

      setError(null)
      setTimeout(() => {
        router.push("/")
      }, 1000)
    } catch (err) {
      console.error("Erreur inattendue:", err)
      setError(`Une erreur inattendue est survenue: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

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

  if (!isAuthenticated) return null

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
            value={questions[i] || ''}
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

      if (i <= 5) leftColumnQuestions.push(questionElement)
      else rightColumnQuestions.push(questionElement)
    }

    return { leftColumnQuestions, rightColumnQuestions }
  }

  const { leftColumnQuestions, rightColumnQuestions } = renderQuestions()

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm p-6 mt-4 mb-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 className="text-xl text-gray-500 mb-6 text-center" variants={itemVariants}>
        création de quiz
      </motion.h1>

      {error && (
        <motion.div
          className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

          {/* Replace file upload with category selection */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-black mb-2">
              catégorie du quiz
            </label>
            <Select onValueChange={handleCategoryChange} value={category}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Musique</SelectItem>
                <SelectItem value="2">Sport</SelectItem>
                <SelectItem value="3">Jeux-Video</SelectItem>
                <SelectItem value="4">Imformatique</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-black mb-2">
              nombre de questions
            </label>
            <input
              type="range"
              min={1}
              max={maxQuestions}
              value={questionCount}
              onChange={handleSliderChange}
              className="w-full"
            />
            {showIndicator && <p className="text-sm text-gray-500 mt-1">{questionCount} questions</p>}
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button onClick={handleSubmit} disabled={loading} className="w-full">
              {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
              {loading ? "Création..." : "Créer le quiz"}
            </Button>
          </motion.div>
        </div>

        <div className="space-y-6">{leftColumnQuestions}</div>
      </div>

      <div className="mt-10 space-y-6">{rightColumnQuestions}</div>
    </motion.div>
  )
}