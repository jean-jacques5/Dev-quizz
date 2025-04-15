import { type Quiz, QuizModel } from "@/models/QuizModel"

export const QuizController = {
  // Obtenir tous les quiz
  getAllQuizzes: () => {
    return QuizModel.getAll()
  },

  // Obtenir les quiz populaires
  getTopQuizzes: (limit = 10) => {
    const quizzes = QuizModel.getAll()
    // Trier par popularité (simulé ici)
    return quizzes.slice(0, limit)
  },

  // Obtenir un quiz par ID
  getQuizById: (id: number) => {
    return QuizModel.getById(id)
  },

  // Obtenir les quiz d'un utilisateur
  getQuizzesByUser: (username: string) => {
    return QuizModel.getByUser(username)
  },

  // Créer un nouveau quiz
  createQuiz: (quiz: Omit<Quiz, "id">) => {
    return QuizModel.create(quiz)
  },

  // Mettre à jour un quiz
  updateQuiz: (id: number, quiz: Partial<Quiz>) => {
    return QuizModel.update(id, quiz)
  },

  // Supprimer un quiz
  deleteQuiz: (id: number) => {
    return QuizModel.delete(id)
  },
}
