"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"

// Définir le type pour un utilisateur
export interface User {
  [x: string]: any
  id: number
  username: string
  email: string
}

// Définir le type pour le contexte d'authentification
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

// Créer le contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  isAuthenticated: false,
})

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext)

// Fournisseur du contexte d'authentification
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    try {
      // Récupérer les informations utilisateur du localStorage
      const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur:", error)
      if (typeof window !== "undefined") {
        localStorage.removeItem("user")
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Rediriger l'utilisateur si nécessaire
  useEffect(() => {
    if (!isLoading) {
      const protectedRoutes = ["/create-quiz", "/profile", "/quiz/"]
      const authRoutes = ["/login", "/signup"]

      // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
      if (!user && protectedRoutes.some((route) => pathname?.startsWith(route))) {
        router.push("/login")
      }

      // Si l'utilisateur est connecté et essaie d'accéder à une route d'authentification
      if (user && authRoutes.includes(pathname || "")) {
        router.push("/")
      }
    }
  }, [user, isLoading, pathname, router])

  // Fonction de connexion
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      // Simuler un délai de réseau
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Simuler un utilisateur connecté
      const mockUser: User = {
        id: 1,
        username: email.split("@")[0],
        email: email,
      }

      // Stocker l'utilisateur dans le localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(mockUser))
      }
      setUser(mockUser)
      return true
    } catch (error) {
      console.error("Erreur de connexion:", error)
      return false
    }
  }, [])

  // Fonction d'inscription
  const signup = useCallback(async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      // Simuler un délai de réseau
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Simuler un utilisateur inscrit
      const mockUser: User = {
        id: Date.now(),
        username,
        email,
      }

      // Stocker l'utilisateur dans le localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(mockUser))
      }
      setUser(mockUser)
      return true
    } catch (error) {
      console.error("Erreur d'inscription:", error)
      return false
    }
  }, [])

  // Fonction de déconnexion
  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
    setUser(null)
    router.push("/")
  }, [router])

  // Valeur du contexte
  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
