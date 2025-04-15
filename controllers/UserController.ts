import { type User, UserModel } from "@/models/UserModel"

export const UserController = {
  // Obtenir tous les utilisateurs
  getAllUsers: () => {
    return UserModel.getAll()
  },

  // Obtenir un utilisateur par ID
  getUserById: (id: number) => {
    return UserModel.getById(id)
  },

  // Obtenir un utilisateur par nom d'utilisateur
  getUserByUsername: (username: string) => {
    return UserModel.getByUsername(username)
  },

  // Créer un nouvel utilisateur (inscription)
  registerUser: (user: Omit<User, "id">) => {
    // Vérifier si l'email existe déjà
    const existingEmail = UserModel.getByEmail(user.email)
    if (existingEmail) {
      throw new Error("Cet email est déjà utilisé")
    }

    // Vérifier si le nom d'utilisateur existe déjà
    const existingUsername = UserModel.getByUsername(user.username)
    if (existingUsername) {
      throw new Error("Ce nom d'utilisateur est déjà utilisé")
    }

    // Créer l'utilisateur
    return UserModel.create(user)
  },

  // Authentifier un utilisateur (connexion)
  loginUser: (email: string, password: string) => {
    const user = UserModel.authenticate(email, password)
    if (!user) {
      throw new Error("Email ou mot de passe incorrect")
    }
    return user
  },

  // Mettre à jour un utilisateur
  updateUser: (id: number, user: Partial<User>) => {
    return UserModel.update(id, user)
  },

  // Supprimer un utilisateur
  deleteUser: (id: number) => {
    return UserModel.delete(id)
  },
}
