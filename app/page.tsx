// ... imports
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
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const carouselImages = [
    {
      id: 1,
      bgColor: "bg-gray-200",
      elements: (
        <div className="w-full h-[400px] overflow-hidden rounded-lg">
          <Image
            src="/images/sport/footC.jpg"
            alt="Football"
            width={1200}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      id: 2,
      bgColor: "bg-gray-200",
      elements: (
        <div className="w-full h-[400px] overflow-hidden rounded-lg">
          <Image
            src="/images/Musique/musicC.jpg"
            alt="Music"
            width={1200}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      id: 3,
      bgColor: "bg-gray-200",
      elements: (
        <div className="w-full h-[400px] overflow-hidden rounded-lg">
          <Image
            src="/images/sport/basket.jpg"
            alt="Basketball"
            width={1200}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
  ];
  

  const extendedSlides = [...carouselImages, carouselImages[0]]

  const nextSlide = useCallback(() => {
    if (isTransitioning) return

    if (currentSlide === carouselImages.length - 1) {
      setCurrentSlide(currentSlide + 1)

      setTimeout(() => {
        setIsTransitioning(true)
        if (carouselRef.current) {
          carouselRef.current.style.transition = "none"
        }
        setCurrentSlide(0)

        setTimeout(() => {
          if (carouselRef.current) {
            carouselRef.current.style.transition = "transform 500ms ease-in-out"
          }
          setIsTransitioning(false)
        }, 50)
      }, 500)
    } else {
      setCurrentSlide(currentSlide + 1)
    }
  }, [currentSlide, isTransitioning, carouselImages.length])

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [nextSlide])

  // ✅ IMAGES RÉALISTES POUR LES QUIZZ
  const topQuizzes = [
    {
      id: 1,
      title: "Quiz Informatique",
      rank: "1st",
      imageUrl: "/images/informatique/1.jpg",
    },
    {
      id: 2,
      title: "Quiz Informatique",
      rank: "2nd",
      imageUrl: "/images/informatique/th.jpg",
    },
    {
      id: 3,
      title: "Quiz Sport",
      rank: "3rd",
      imageUrl: "/images/sport/1.jpg",
    },
    {
      id: 4,
      title: "Quiz Musique",
      rank: "4th",
      imageUrl: "/images/musique/th.jpg",
    },
    {
      id: 5,
      title: "Quiz Musique",
      rank: "5th",
      imageUrl: "/images/musique/th (1).jpg",
    },
    {
      id: 6,
      title: "Quiz Jeux-vidéos",
      rank: "6th",
      imageUrl: "/images/jeux vidéos/1.jpg",
    },
    {
      id: 7,
      title: "Quiz Jeux-vidéos",
      rank: "7th",
      imageUrl: "/images/jeux vidéos/1_1.jpg",
    },
    {
      id: 8,
      title: "Quiz Sport",
      rank: "8th",
      imageUrl: "/images/sport/foot.png",
    },
    {
      id: 9,
      title: "Quiz Musique",
      rank: "9th",
      imageUrl: "/images/sport/time.jpg",
    },
    {
      id: 10,
      title: "Quiz Sport",
      rank: "10th",
      imageUrl: "/images/sport/quiz.jpg",
    },
  ]


  const categories = [
    { id: 1, title: "Title", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
    { id: 2, title: "Title", description: "Description de la catégorie 2" },
    { id: 3, title: "Title", description: "Description de la catégorie 3" },
    { id: 4, title: "Title", description: "Description de la catégorie 4" },
  ]

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
                      src={quiz.imageUrl}
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
              </div>
            </motion.div>
          ))}
        </div>

        {/* Auth Modal */}
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
