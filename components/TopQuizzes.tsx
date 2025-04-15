import QuizGrid from "@/components/QuizGrid"

export default function TopQuizzes() {
  // Simuler des données de quiz
  const quizzes = Array(6)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      title: "titre quiz",
      rank: "1st",
      imageUrl: "/placeholder.svg?key=xw860",
    }))

  return <QuizGrid quizzes={quizzes} />
}
