import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default function Categories() {
  // Simuler des données de catégories
  const categories = [
    { id: 1, title: "Title", description: "Lorem ipsum dolor sit amet" },
    { id: 2, title: "Title", description: "Lorem ipsum dolor sit amet" },
    { id: 3, title: "Title", description: "Lorem ipsum dolor sit amet" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/category/${category.id}`}>
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-2">{category.title}</h3>
              <p className="text-gray-600 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque illo quod impedit...
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
