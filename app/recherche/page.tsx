"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Clock, ChevronLeft } from "lucide-react"
import { motion } from "framer-motion"

// Note: Ce composant simule une API - remplacer par votre appel API réel
const fetchQuizzes = async (titleQuery) => {
  // Simulation d'un délai réseau
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Exemple de données - remplacer par un appel API réel
  const mockData = [
    { id: 1, title_quiz: "Quiz sur le football européen", category: "Sport", questions_count: 10, created_at: "2025-04-10" },
    { id: 2, title_quiz: "Quiz sur l'histoire du rock", category: "Musique", questions_count: 15, created_at: "2025-04-12" },
    { id: 3, title_quiz: "Quiz sur les jeux vidéo des années 90", category: "Jeux-vidéos", questions_count: 12, created_at: "2025-04-14" },
    { id: 4, title_quiz: "Quiz sur les langages de programmation", category: "Informatique", questions_count: 8, created_at: "2025-04-15" },
    { id: 5, title_quiz: "Quiz sur l'histoire du football", category: "Sport", questions_count: 10, created_at: "2025-04-09" },
    { id: 6, title_quiz: "Quiz programmation avancée", category: "Informatique", questions_count: 20, created_at: "2025-04-08" },
  ]
  
  if (!titleQuery) return mockData
  
  // Filtrer les quiz qui contiennent le terme de recherche dans leur titre
  return mockData.filter(quiz => 
    quiz.title_quiz.toLowerCase().includes(titleQuery.toLowerCase())
  )
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const titleQuery = searchParams.get("title") || ""
  const [searchQuery, setSearchQuery] = useState(titleQuery)
  const [quizzes, setQuizzes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [noResults, setNoResults] = useState(false)
  
  useEffect(() => {
    const search = async () => {
      setIsLoading(true)
      try {
        const results = await fetchQuizzes(titleQuery)
        setQuizzes(results)
        setNoResults(results.length === 0)
      } catch (error) {
        console.error("Error fetching quizzes:", error)
        setQuizzes([])
        setNoResults(true)
      } finally {
        setIsLoading(false)
      }
    }
    
    search()
  }, [titleQuery])
  
  const handleSearch = (e) => {
    e.preventDefault()
    // Construire une nouvelle URL avec le paramètre de recherche
    const url = `/search?title=${encodeURIComponent(searchQuery.trim())}`
    // Rediriger vers la nouvelle URL (en utilisant window.location pour recharger la page)
    window.location.href = url
  }
  
  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'sport':
        return 'bg-blue-100 text-blue-800'
      case 'musique':
        return 'bg-purple-100 text-purple-800'
      case 'jeux-vidéos':
        return 'bg-green-100 text-green-800'
      case 'informatique':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  // Animation variants pour la liste
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="ghost" className="mr-4">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Retour
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Recherche de quiz</h1>
      </div>
      
      {/* Barre de recherche */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <form onSubmit={handleSearch} className="flex items-stretch">
          <input
            type="text"
            placeholder="Rechercher un quiz par titre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" className="rounded-l-none px-6">
            <Search className="h-5 w-5 mr-2" />
            Rechercher
          </Button>
        </form>
      </div>
      
      {/* Affichage des résultats */}
      <div className="bg-white rounded-lg shadow p-6">
        {titleQuery && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Résultats pour "{titleQuery}"
            </h2>
            {!isLoading && (
              <p className="text-gray-600">
                {quizzes.length} quiz{quizzes.length !== 1 ? 's' : ''} trouvé{quizzes.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : noResults ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat trouvé</h3>
            <p className="text-gray-600 mb-6">
              Aucun quiz ne correspond à votre recherche "{titleQuery}".
            </p>
            <Link href="/">
              <Button>
                Découvrir tous les quiz
              </Button>
            </Link>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {quizzes.map((quiz) => (
              <motion.div 
                key={quiz.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                variants={item}
              >
                <Link href={`/quiz/${quiz.id}`}>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(quiz.category)}`}>
                        {quiz.category}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(quiz.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900">{quiz.title_quiz}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {quiz.questions_count} question{quiz.questions_count !== 1 ? 's' : ''}
                      </span>
                      <Button size="sm" variant="outline">
                        Jouer
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}