"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Triangle, Circle } from "lucide-react"

interface Category {
  id: number
  title: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simuler le chargement des données
    const loadCategories = async () => {
      setIsLoading(true)

      // Simuler un délai réseau
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Simuler des données de catégories
      const mockCategories: Category[] = Array(8)
        .fill(null)
        .map((_, i) => ({
          id: i + 1,
          title: `titre quiz`,
        }))

      setCategories(mockCategories)
      setIsLoading(false)
    }

    loadCategories()
  }, [])

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

  // Diviser les catégories en deux lignes
  const firstRow = categories.slice(0, 4)
  const secondRow = categories.slice(4, 8)

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm p-6 mt-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 className="text-xl font-medium text-center mb-8" variants={itemVariants}>
        titre de la categorie
      </motion.h1>

      {/* Première ligne de catégories */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6" variants={containerVariants}>
        {firstRow.map((category, index) => (
          <motion.div key={category.id} variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href={`/category/${category.id}`}>
              <div className="flex flex-col items-center">
                <div className="w-full aspect-square bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                  <div className="relative">
                    <Triangle className="h-8 w-8 text-gray-400" />
                    <Circle className="h-4 w-4 text-gray-400 absolute bottom-0 right-0" />
                  </div>
                </div>
                <div className="bg-white rounded-full py-2 px-4 w-full text-center border border-gray-200">
                  <p className="text-sm">{category.title}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Deuxième ligne de catégories */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10" variants={containerVariants}>
        {secondRow.map((category, index) => (
          <motion.div key={category.id} variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href={`/category/${category.id}`}>
              <div className="flex flex-col items-center">
                <div className="w-full aspect-square bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                  <div className="relative">
                    <Triangle className="h-8 w-8 text-gray-400" />
                    <Circle className="h-4 w-4 text-gray-400 absolute bottom-0 right-0" />
                  </div>
                </div>
                <div className="bg-white rounded-full py-2 px-4 w-full text-center border border-gray-200">
                  <p className="text-sm">{category.title}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
