import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Triangle, Square, Circle } from "lucide-react"

interface QuizCardProps {
  id: number
  title: string
  rank: string
}

export default function QuizCard({ id, title, rank }: QuizCardProps) {
  return (
    <Link href={`/quiz/${id}`}>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
            <div className="flex">
              <Triangle className="h-8 w-8 text-gray-400" />
              <Square className="h-8 w-8 text-gray-400" />
              <Circle className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-medium">{title}</p>
            <span className="text-sm text-gray-500">{rank}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
