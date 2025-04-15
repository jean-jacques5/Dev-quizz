import { type Category, CategoryModel } from "@/models/CategoryModel"

export const CategoryController = {
  // Obtenir toutes les catégories
  getAllCategories: () => {
    return CategoryModel.getAll()
  },

  // Obtenir une catégorie par ID
  getCategoryById: (id: number) => {
    return CategoryModel.getById(id)
  },

  // Créer une nouvelle catégorie
  createCategory: (category: Omit<Category, "id">) => {
    return CategoryModel.create(category)
  },

  // Mettre à jour une catégorie
  updateCategory: (id: number, category: Partial<Category>) => {
    return CategoryModel.update(id, category)
  },

  // Supprimer une catégorie
  deleteCategory: (id: number) => {
    return CategoryModel.delete(id)
  },
}
