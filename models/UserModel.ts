// Modèle pour les utilisateurs
export interface User {
  id: number
  username: string
  email: string
  password: string // Dans une vraie application, ce serait un hash
}

// Simuler une base de données
const users: User[] = []

export const UserModel = {
  // Obtenir tous les utilisateurs
  getAll: () => {
    return users.map(({ password, ...user }) => user) // Ne pas renvoyer les mots de passe
  },

  // Obtenir un utilisateur par ID
  getById: (id: number) => {
    const user = users.find((user) => user.id === id)
    if (user) {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    }
    return null
  },

  // Obtenir un utilisateur par nom d'utilisateur
  getByUsername: (username: string) => {
    return users.find((user) => user.username === username)
  },

  // Obtenir un utilisateur par email
  getByEmail: (email: string) => {
    return users.find((user) => user.email === email)
  },

  // Créer un nouvel utilisateur
  create: (user: Omit<User, "id">) => {
    const newUser = {
      ...user,
      id: users.length + 1,
    }
    users.push(newUser)
    const { password, ...userWithoutPassword } = newUser
    return userWithoutPassword
  },

  // Mettre à jour un utilisateur
  update: (id: number, user: Partial<User>) => {
    const index = users.findIndex((u) => u.id === id)
    if (index !== -1) {
      users[index] = { ...users[index], ...user }
      const { password, ...userWithoutPassword } = users[index]
      return userWithoutPassword
    }
    return null
  },

  // Supprimer un utilisateur
  delete: (id: number) => {
    const index = users.findIndex((u) => u.id === id)
    if (index !== -1) {
      users.splice(index, 1)
      return true
    }
    return false
  },

  // Authentifier un utilisateur
  authenticate: (email: string, password: string) => {
    const user = users.find((u) => u.email === email && u.password === password)
    if (user) {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    }
    return null
  },
}
