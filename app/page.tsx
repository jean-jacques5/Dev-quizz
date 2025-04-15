"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  // État pour le carousel
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Images du carousel
  const carouselImages = [
    {
      id: 1,
      bgColor: "bg-gray-200",
      elements: (
        <div className="flex flex-col items-center">
          <div className="w-32 h-16 bg-gray-400 transform rotate-180 skew-x-12"></div>
          <div className="w-24 h-24 bg-gray-400 mt-4 rounded-full"></div>
          <div className="w-24 h-16 bg-gray-400 mt-4"></div>
        </div>
      ),
    },
    {
      id: 2,
      bgColor: "bg-gray-300",
      elements: (
        <div className="flex items-center justify-center">
          <div className="w-32 h-32 bg-gray-500 rounded-full"></div>
          <div className="w-32 h-32 bg-gray-400 rounded-full ml-4"></div>
        </div>
      ),
    },
    {
      id: 3,
      bgColor: "bg-gray-200",
      elements: (
        <div className="grid grid-cols-3 gap-4">
          <div className="w-16 h-16 bg-gray-400 transform rotate-45"></div>
          <div className="w-16 h-16 bg-gray-500 rounded-lg"></div>
          <div className="w-16 h-16 bg-gray-400 transform rotate-12"></div>
        </div>
      ),
    },
  ]

  // Créer un tableau avec les slides originaux plus une copie du premier slide à la fin
  const extendedSlides = [...carouselImages, carouselImages[0]]

  // Navigation du carousel
  const nextSlide = useCallback(() => {
    if (isTransitioning) return

    if (currentSlide === carouselImages.length - 1) {
      // Si on est au dernier slide original, on passe à la copie du premier slide
      setCurrentSlide(currentSlide + 1)

      // Après la transition, on revient au premier slide sans animation
      setTimeout(() => {
        setIsTransitioning(true)
        if (carouselRef.current) {
          carouselRef.current.style.transition = "none"
        }
        setCurrentSlide(0)

        // Réactiver la transition après le changement
        setTimeout(() => {
          if (carouselRef.current) {
            carouselRef.current.style.transition = "transform 500ms ease-in-out"
          }
          setIsTransitioning(false)
        }, 50)
      }, 500)
    } else {
      // Navigation normale
      setCurrentSlide(currentSlide + 1)
    }
  }, [currentSlide, isTransitioning, carouselImages.length])

  // Changement automatique de slide toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [nextSlide])

  // Simuler des données de quiz
  const topQuizzes = Array(10)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      title: "titre quiz",
      rank: "1st",
      imageUrl: "/placeholder.svg?key=wf2m0",
    }))

  // Simuler des données de catégories
  const categories = [
    {
      id: 1,
      title: "Title",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Doloremque illo quod impedit, id Lorem ipsum dolor sit amet.",
    },
    { id: 2, title: "Title", description: "Description de la catégorie 2" },
    { id: 3, title: "Title", description: "Description de la catégorie 3" },
    { id: 4, title: "Title", description: "Description de la catégorie 4" },
  ]

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
      className="bg-white rounded-lg mt-4 p-4 md:p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Carousel */}
      <motion.div className="relative w-full h-36 rounded-lg mx-auto mb-6 overflow-hidden" variants={itemVariants}>
        <div
          ref={carouselRef}
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {extendedSlides.map((slide, index) => (
            <div
              key={`${slide.id}-${index}`}
              className={`flex-shrink-0 w-full h-full ${slide.bgColor} relative`}
              style={{ width: "100%" }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {slide.elements}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* TOP 10 des quiz */}
      <motion.div className="mb-8 relative" variants={itemVariants}>
        <motion.h2 className="text-lg font-medium mb-4" variants={itemVariants}>
          TOP 10 de nos quiz :
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {topQuizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: index * 0.05,
                    duration: 0.4,
                  },
                },
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <div
                className="block cursor-pointer"
                onClick={() => {
                  if (isAuthenticated) {
                    router.push(`/quiz/${quiz.id}`)
                  } else {
                    setShowAuthModal(true)
                  }
                }}
              >
                <div className="bg-gray-200 rounded-lg p-2">
                  <div className="relative aspect-square bg-gray-300 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                    <Image
                      src={quiz.imageUrl || "/placeholder.svg"}
                      alt={`Quiz ${quiz.title}`}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />

                    {/* Badge de classement */}
                    <div className="absolute bottom-2 left-2 flex items-center">
                      <div className="w-6 h-6 bg-gray-400"></div>
                      <span className="text-xs text-gray-500 ml-1">{quiz.rank}</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-full py-2 px-4 text-center">
                    <p className="text-sm">{quiz.title}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modale d'authentification */}
        {showAuthModal && !isAuthenticated && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 text-center shadow-lg max-w-md m-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Contenu réservé aux membres</h3>
              <p className="text-gray-500 mb-4">Connectez-vous pour accéder aux quiz</p>
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
        )}
      </motion.div>

      {/* Catégories */}
      <motion.div className="mb-8" variants={itemVariants}>
        <motion.h2 className="text-lg font-medium mb-4" variants={itemVariants}>
          Catégorie :
        </motion.h2>
        <Accordion type="single" collapsible className="space-y-2">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 0.3 + index * 0.1,
                    duration: 0.4,
                  },
                },
              }}
            >
              <AccordionItem value={`category-${category.id}`} className="border rounded-md overflow-hidden">
                <AccordionTrigger className="px-4 py-2 bg-gray-100 hover:bg-gray-100 hover:no-underline">
                  <span className="text-sm font-medium">{category.title}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-2 text-sm text-gray-600">{category.description}</AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>
    </motion.div>
  )
}
