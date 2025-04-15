// Modèle pour les quiz
export interface Quiz {
  id: number
  title: string
  questionCount: number
  coverImage?: string
  questions: Question[]
  createdBy: string
  rank?: string
}

export interface Question {
  id: number
  text: string
  answer: boolean
}

// Simuler une base de données
const quizzes: Quiz[] = []

export const QuizModel = {
  // Obtenir tous les quiz
  getAll: () => {
    return [...quizzes]
  },

  // Obtenir un quiz par ID
  getById: (id: number) => {
    return quizzes.find((quiz) => quiz.id === id)
  },

  // Obtenir les quiz par utilisateur
  getByUser: (username: string) => {
    return quizzes.filter((quiz) => quiz.createdBy === username)
  },

  // Créer un nouveau quiz
  create: (quiz: Omit<Quiz, "id">) => {
    const newQuiz = {
      ...quiz,
      id: quizzes.length + 1,
    }
    quizzes.push(newQuiz)
    return newQuiz
  },

  // Mettre à jour un quiz
  update: (id: number, quiz: Partial<Quiz>) => {
    const index = quizzes.findIndex((q) => q.id === id)
    if (index !== -1) {
      quizzes[index] = { ...quizzes[index], ...quiz }
      return quizzes[index]
    }
    return null
  },

  // Supprimer un quiz
  delete: (id: number) => {
    const index = quizzes.findIndex((q) => q.id === id)
    if (index !== -1) {
      quizzes.splice(index, 1)
      return true
    }
    return false
  },
}
