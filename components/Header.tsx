"use client"
 
import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, Plus, User, X, LogOut, ChevronDown } from "lucide-react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"
 
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuth()
 
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev)
  }, [])
 
  const toggleCategories = useCallback(() => {
    setIsCategoriesOpen((prev) => !prev)
  }, [])
 
  return (
    <header className="bg-white py-4 relative z-50 rounded-lg mt-4">
      <div className="w-full px-4">
        <div className="grid grid-cols-3 items-center">
          {/* Colonne gauche - Menu burger */}
          <div className="flex justify-start">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
 
          {/* Colonne centrale - Logo */}
<div className="flex justify-center items-center">
  <Link href="/" className="flex items-center">
    <div className="w-14 h-14 rounded-full overflow-hidden shadow-md border border-gray-200">
      <img
        src="/img/logo.png"
        alt="Logo"
        className="w-full h-full object-cover"
      />
    </div>
  </Link>
</div>
 
          {/* Colonne droite - Boutons d'action */}
          <div className="flex justify-end items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/create-quiz">
                  <Button variant="ghost" size="icon" className="border border-gray-300 rounded-md">
                    <Plus className="h-5 w-5" />
                  </Button>
                </Link>
 
                <Link href="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/signup">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
 
      {/* Menu de navigation avec animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full z-50 overflow-hidden px-4">
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-white shadow-lg rounded-b-lg border-t overflow-hidden"
            >
              <nav className="space-y-2 py-4 px-4">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                >
                  <Link href="/" className="block p-2 hover:bg-gray-100 rounded">
                    Accueil
                  </Link>
                </motion.div>
 
                {/* Catégories avec sous-menu */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.2 }}
                >
                  <div>
                    <button
                      onClick={toggleCategories}
                      className="flex justify-between items-center w-full p-2 hover:bg-gray-100 rounded"
                    >
                      <span>Catégories</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`} />
                    </button>
 
                    <AnimatePresence>
                      {isCategoriesOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="pl-4 pt-2 space-y-1"
                        >
                          <Link href="/categories?tab=sport" className="block p-2 text-sm hover:bg-gray-100 rounded">
                            Sport
                          </Link>
                          <Link href="/categories?tab=musique" className="block p-2 text-sm hover:bg-gray-100 rounded">
                            Musique
                          </Link>
                          <Link href="/categories?tab=jeux-video" className="block p-2 text-sm hover:bg-gray-100 rounded">
                            Jeux-vidéos
                          </Link>
                          <Link href="/categories?tab=informatique" className="block p-2 text-sm hover:bg-gray-100 rounded">
                            Informatique
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
 
                {isAuthenticated && (
                  <>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.2 }}
                    >
                      <Link href="/profile" className="block p-2 hover:bg-gray-100 rounded">
                        Profil
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.25, duration: 0.2 }}
                    >
                      <Link href="/create-quiz" className="block p-2 hover:bg-gray-100 rounded">
                        Créer un quiz
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.2 }}
                    >
                      <button
                        onClick={logout}
                        className="flex items-center w-full text-left p-2 hover:bg-gray-100 rounded text-red-500"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </button>
                    </motion.div>
                  </>
                )}
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  )
}
 
 