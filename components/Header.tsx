"use client"
 
import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, Plus, User, X, LogOut, ChevronDown, Search } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
 
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
 
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prevState) => !prevState)
  }, [])
 
  const toggleCategories = useCallback(() => {
    setIsCategoriesOpen((prevState) => !prevState)
  }, [])

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prevState) => !prevState)
    if (!isSearchOpen) {
      // Reset query when opening
      setSearchQuery("")
    }
  }, [isSearchOpen])

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/recherche?title=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
    }
  }, [searchQuery, router])
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
            <Button variant="ghost" size="icon" onClick={toggleSearch} className="border border-gray-300 rounded-md">
              <Search className="h-5 w-5" />
            </Button>

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
      
      {/* Menu latéral */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={toggleMenu}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-80 bg-white p-6 shadow-xl overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold">Menu</h2>
                  <Button variant="ghost" size="icon" onClick={toggleMenu}>
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                
                <nav className="space-y-6 flex-1">
                  <div className="space-y-2">
                    <Link href="/" onClick={toggleMenu}>
                      <div className={`py-2 px-4 rounded-md hover:bg-gray-100 ${pathname === "/" ? "bg-gray-100 font-medium" : ""}`}>
                        Accueil
                      </div>
                    </Link>
                    
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-between py-2 px-4 rounded-md hover:bg-gray-100"
                        onClick={toggleCategories}
                      >
                        Catégories
                        <ChevronDown className={`h-4 w-4 transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`} />
                      </Button>
                      
                      <AnimatePresence>
                        {isCategoriesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 space-y-1">
                              <Link href="/categories/sport" onClick={toggleMenu}>
                                <div className="py-2 px-4 rounded-md hover:bg-gray-100">Sport</div>
                              </Link>
                              <Link href="/categories/musique" onClick={toggleMenu}>
                                <div className="py-2 px-4 rounded-md hover:bg-gray-100">Musique</div>
                              </Link>
                              <Link href="/categories/informatique" onClick={toggleMenu}>
                                <div className="py-2 px-4 rounded-md hover:bg-gray-100">Informatique</div>
                              </Link>
                              <Link href="/categories/jeux-videos" onClick={toggleMenu}>
                                <div className="py-2 px-4 rounded-md hover:bg-gray-100">Jeux vidéos</div>
                              </Link>
                              <Link href="/categories" onClick={toggleMenu}>
                                <div className="py-2 px-4 rounded-md hover:bg-gray-100 text-purple-600">Toutes les catégories</div>
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <Link href="/recherche" onClick={toggleMenu}>
                      <div className={`py-2 px-4 rounded-md hover:bg-gray-100 ${pathname.startsWith("/recherche") ? "bg-gray-100 font-medium" : ""}`}>
                        Rechercher
                      </div>
                    </Link>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    {isAuthenticated ? (
                      <>
                        <Link href="/profile" onClick={toggleMenu}>
                          <div className={`py-2 px-4 rounded-md hover:bg-gray-100 ${pathname === "/profile" ? "bg-gray-100 font-medium" : ""}`}>
                            Mon profil
                          </div>
                        </Link>
                        <Link href="/create-quiz" onClick={toggleMenu}>
                          <div className={`py-2 px-4 rounded-md hover:bg-gray-100 ${pathname === "/create-quiz" ? "bg-gray-100 font-medium" : ""}`}>
                            Créer un quiz
                          </div>
                        </Link>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start py-2 px-4 rounded-md hover:bg-gray-100 text-red-500"
                          onClick={() => {
                            logout();
                            toggleMenu();
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Se déconnecter
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" onClick={toggleMenu}>
                          <div className={`py-2 px-4 rounded-md hover:bg-gray-100 ${pathname === "/login" ? "bg-gray-100 font-medium" : ""}`}>
                            Se connecter
                          </div>
                        </Link>
                        <Link href="/signup" onClick={toggleMenu}>
                          <div className={`py-2 px-4 rounded-md hover:bg-gray-100 ${pathname === "/signup" ? "bg-gray-100 font-medium" : ""}`}>
                            S'inscrire
                          </div>
                        </Link>
                      </>
                    )}
                  </div>
                </nav>
                
                <div className="mt-8 text-center text-sm text-gray-500">
                  <p>&copy; 2025 QuizApp</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Boite de dialogue de recherche */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rechercher un quiz</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSearch} className="flex w-full gap-2 items-center pt-4">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre..."
              className="flex-1"
              autoFocus
            />
            <Button type="submit" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </form>
          <div className="text-sm text-muted-foreground mt-2">
            Recherchez parmi nos quiz disponibles par titre.
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
