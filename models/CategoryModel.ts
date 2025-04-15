// Modèle pour les catégories
export interface Category {
  id: number
  title: string
  description?: string
}

// Simuler une base de données
const categories: Category[] = [
  { id: 1, title: "Title", description: "Lorem ipsum dolor sit amet" },
  { id: 2, title: "Title", description: "Lorem ipsum dolor sit amet" },
  { id: 3, title: "Title", description: "Lorem ipsum dolor sit amet" },
]

export const CategoryModel = {
  // Obtenir toutes les catégories
  getAll: () => {
    return [...categories]
  },

  // Obtenir une catégorie par ID
  getById: (id: number) => {
    return categories.find((category) => category.id === id)
  },

  // Créer une nouvelle catégorie
  create: (category: Omit<Category, "id">) => {
    const newCategory = {
      ...category,
      id: categories.length + 1,
    }
    categories.push(newCategory)
    return newCategory
  },

  // Mettre à jour une catégorie
  update: (id: number, category: Partial<Category>) => {
    const index = categories.findIndex((c) => c.id === id)
    if (index !== -1) {
      categories[index] = { ...categories[index], ...category }
      return categories[index]
    }
    return null
  },

  // Supprimer une catégorie
  delete: (id: number) => {
    const index = categories.findIndex((c) => c.id === id)
    if (index !== -1) {
      categories.splice(index, 1)
      return true
    }
    return false
  },
}
