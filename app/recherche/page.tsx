"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Clock, ChevronLeft, User } from "lucide-react"
import { motion } from "framer-motion"
import { createClient } from "@/utils/supabase/client"

// Types pour les quiz selon votre structure
interface Quiz {
  id_quiz: number
  id_utilisateur: number
  titre_quiz: string
  date_creation: string
  nombre_participation: number
  id_categorie: number
  image_path: string
}

// Fonction pour récupérer les quiz depuis Supabase
const fetchQuizzes = async (searchTerm: string) => {
  const supabase = createClient()
  
  let query = supabase
    .from('quiz')
    .select('*')
  
  if (searchTerm) {
    // Recherche insensible à la casse avec ILIKE
    query = query.ilike('titre_quiz', `%${searchTerm}%`)
  }
  
  const { data, error } = await query.order('date_creation', { ascending: false })
  
  if (error) {
    console.error('Erreur lors de la récupération des quiz:', error)
    throw error
  }
  
  return data || []
}

// Fonction pour récupérer le nom de la catégorie
const getCategoryName = (categoryId: number) => {
  // Mapper les IDs aux noms de catégories
  const categories: Record<number, string> = {
    1: 'Sport',
    2: 'Musique',
    3: 'Jeux-vidéos',
    4: 'Informatique',
    // Ajoutez d'autres catégories selon votre base de données
  }
  
  return categories[categoryId] || 'Autre'
}

// Fonction pour déterminer la couleur basée sur la catégorie
const getCategoryColor = (categoryId: number) => {
  const categoryName = getCategoryName(categoryId).toLowerCase()
  
  switch (categoryName) {
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

export default function RechercheQuiz() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const titleQuery = searchParams.get("title") || ""
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(titleQuery)
  
  // Effet pour charger les quiz au chargement ou changement de recherche
  useEffect(() => {
    setSearchTerm(titleQuery)
    const fetchData = async () => {
      setLoading(true)
      try {
        const results = await fetchQuizzes(titleQuery)
        setQuizzes(results)
      } catch (error) {
        console.error("Erreur lors de la recherche:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [titleQuery])
  
  // Gérer la soumission du formulaire de recherche
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/recherche?title=${encodeURIComponent(searchTerm.trim())}`)
    }
  }
  
  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }
  
  // Récupérer le nombre de questions pour chaque quiz
  // Note: Dans un cas réel, vous devrez probablement faire une requête séparée ou joindre cette information
  const getQuestionsCount = (quizId: number) => {
    // Simulation - à remplacer par votre logique de récupération réelle
    return Math.floor(Math.random() * 10) + 1
  }
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={containerVariants}
        className="space-y-6"
      >
        {/* En-tête et barre de recherche */}
        <motion.div variants={itemVariants} className="flex flex-col items-start">
          <div className="w-full flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.back()}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold">Recherche de quiz</h1>
          </div>
          
          <form onSubmit={handleSearchSubmit} className="w-full mb-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Rechercher un quiz..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Button 
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 px-3 py-1 h-8"
                size="sm"
              >
                Rechercher
              </Button>
            </div>
          </form>
        </motion.div>
        
        {/* Résultats de recherche */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
          {titleQuery && (
            <div className="mb-6 border-b pb-4">
              <h2 className="text-xl font-semibold">
                Résultats pour "{titleQuery}"
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {quizzes.length} quiz{quizzes.length !== 1 ? 's' : ''} trouvé{quizzes.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat trouvé</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Nous n'avons trouvé aucun quiz correspondant à "{titleQuery}". 
                Essayez avec d'autres termes ou consultez nos quiz populaires.
              </p>
              <Link href="/">
                <Button>
                  Découvrir tous les quiz
                </Button>
              </Link>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={containerVariants}
            >
              {quizzes.map((quiz) => (
                <motion.div 
                  key={quiz.id_quiz}
                  variants={itemVariants}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <Link href={`/quiz/${quiz.id_quiz}`}>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(quiz.id_categorie)}`}>
                          {getCategoryName(quiz.id_categorie)}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(quiz.date_creation)}
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-lg mb-2 text-gray-900">{quiz.titre_quiz}</h3>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex space-x-3 text-sm text-gray-600">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {quiz.nombre_participation} participant{quiz.nombre_participation !== 1 ? 's' : ''}
                          </span>
                        </div>
                        
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
        </motion.div>
      </motion.div>
    </div>
  )
}
