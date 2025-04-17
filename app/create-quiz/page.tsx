"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateQuiz() {
  const [questionCount, setQuestionCount] = useState(1);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [questions, setQuestions] = useState<Record<number, string>>({});
  const [showIndicator, setShowIndicator] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("");
  const maxQuestions = 10;

  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value);
    setQuestionCount(newValue);
    setShowIndicator(true);
    setTimeout(() => {
      setShowIndicator(false);
    }, 1000);
  }, []);

  const handleAnswerChange = useCallback((index: number, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  }, []);

  const handleQuestionChange = useCallback((index: number, value: string) => {
    setQuestions((prev) => ({ ...prev, [index]: value }));
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Vérifier que l'utilisateur est bien authentifié
      if (!user || !user.email) {
        setError("Vous devez être connecté pour créer un quiz");
        setLoading(false);
        return;
      }

      // Validation
      if (!title.trim()) {
        setError("Veuillez fournir un titre pour le quiz");
        setLoading(false);
        return;
      }

      if (!category) {
        setError("Veuillez sélectionner une catégorie");
        setLoading(false);
        return;
      }

      for (let i = 1; i <= questionCount; i++) {
        if (!questions[i] || questions[i].trim() === '') {
          setError(`La question ${i} ne peut pas être vide`);
          setLoading(false);
          return;
        }

        if (answers[i] === undefined) {
          setError(`Veuillez sélectionner une réponse pour la question ${i}`);
          setLoading(false);
          return;
        }
      }

      const supabase = createClient();
      
      // Récupérer l'ID de l'utilisateur depuis la table utilisateur en utilisant l'email
      const { data: userData, error: userError } = await supabase
        .from('utilisateur')
        .select('id_utilisateur')
        .eq('email', user.email)
        .single();
        
      if (userError) {
        console.error("Erreur lors de la récupération de l'utilisateur:", userError);
        setError(`Erreur utilisateur: ${JSON.stringify(userError)}`);
        setLoading(false);
        return;
      }
      
      if (!userData) {
        setError("Utilisateur introuvable. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }
      
      console.log("Utilisateur trouvé:", userData);
      
      // Préparation des données du quiz avec l'ID utilisateur correct
      const quizData = {
        titre_quiz: title,
        image_path: "img/logo.png",
        id_utilisateur: userData.id_utilisateur,
        id_categorie: parseInt(category),
        date_creation: new Date().toISOString(),
        nombre_participation: 0
      };
      
      console.log("Données du quiz à insérer:", quizData);
      
      // 1. Insertion du quiz
      const { data: quizData_inserted, error: quizError } = await supabase
        .from('quiz')
        .insert(quizData)
        .select();

      if (quizError) {
        console.error("Erreur lors de la création du quiz:", quizError);
        setError(`Erreur lors de la création du quiz: ${JSON.stringify(quizError)}`);
        setLoading(false);
        return;
      }
      
      if (!quizData_inserted || quizData_inserted.length === 0) {
        console.error("Aucune donnée retournée après insertion");
        setError("Erreur: Aucune donnée retournée après la création du quiz");
        setLoading(false);
        return;
      }

      console.log("Quiz créé avec succès:", quizData_inserted);
      const quizId = quizData_inserted[0].id_quiz;
      
      // 2. Insertion des questions et réponses
      for (let i = 1; i <= questionCount; i++) {
        // Préparation des données de question
        const questionData = {
          id_quiz: quizId,
          question: questions[i],
        };
        
        console.log(`Données de la question ${i} à insérer:`, questionData);
        
        // Insérer la question
        const { data: insertedQuestionData, error: questionError } = await supabase
          .from('question')
          .insert(questionData)
          .select();
          
        if (questionError) {
          console.error(`Erreur lors de l'ajout de la question ${i}:`, questionError);
          setError(`Erreur lors de l'ajout de la question: ${JSON.stringify(questionError)}`);
          setLoading(false);
          return;
        }
        
        if (!insertedQuestionData || insertedQuestionData.length === 0) {
          console.error(`Aucune donnée retournée après insertion de la question ${i}`);
          setError(`Erreur: Aucune donnée retournée après l'insertion de la question ${i}`);
          setLoading(false);
          return;
        }
        
        console.log(`Question ${i} créée:`, insertedQuestionData);
        const questionId = insertedQuestionData[0].id_question;
        
        // Préparation des données de réponse
        const responseData = {
          id_quiz: quizId,
          id_question: questionId,
          reponse: answers[i]
        };
        
        console.log(`Données de la réponse ${i} à insérer:`, responseData);
        
        // Insérer la réponse correspondante
        const { error: responseError } = await supabase
          .from('reponse_question')
          .insert(responseData);
          
        if (responseError) {
          console.error(`Erreur lors de l'ajout de la réponse pour la question ${i}:`, responseError);
          setError(`Erreur lors de l'ajout de la réponse: ${JSON.stringify(responseError)}`);
          setLoading(false);
          return;
        }
        
        console.log(`Réponse pour la question ${i} créée avec succès`);
      }

      console.log("Quiz complet créé avec succès!");
      
      // Redirection vers la page du quiz créé
      router.push(`/quiz/${quizId}`);
      
    } catch (error: any) {
      console.error("Erreur inattendue:", error);
      setError(`Une erreur inattendue s'est produite: ${error?.message || JSON.stringify(error)}`);
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto max-w-4xl py-10 px-4 sm:px-6">
      <motion.div
        className="space-y-8 bg-white p-8 rounded-2xl shadow-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="text-3xl font-bold">
          Créer un nouveau Quiz
        </motion.h1>
        
        <motion.div variants={itemVariants} className="space-y-4">
          <label htmlFor="title" className="block font-medium text-gray-700">
            Titre du Quiz
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entrez le titre de votre quiz"
            className="w-full"
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-4">
  <label htmlFor="category" className="block font-medium text-gray-700">
    Catégorie
  </label>
  <Select onValueChange={setCategory} value={category}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Sélectionnez une catégorie" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="1">Musique</SelectItem>
      <SelectItem value="2">Sport</SelectItem>
      <SelectItem value="3">Jeux-Video</SelectItem>
      <SelectItem value="4">Informatique</SelectItem>
    </SelectContent>
  </Select>
</motion.div>
        
        <motion.div variants={itemVariants} className="space-y-4">
          <label htmlFor="questions" className="block font-medium text-gray-700">
            Nombre de questions : {questionCount}
          </label>
          <div className="relative">
            <Input
              id="questions"
              type="range"
              min="1"
              max={maxQuestions}
              value={questionCount}
              onChange={handleSliderChange}
              className="w-full"
            />
            {showIndicator && (
              <span className="absolute -ml-2 -mt-10 bg-blue-500 text-white px-2 py-1 rounded-full">
                {questionCount}
              </span>
            )}
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>1</span>
              <span>{maxQuestions}</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-6">
          <h2 className="text-xl font-semibold border-b pb-2">Questions</h2>
          
          {Array.from({ length: questionCount }, (_, i) => {
            const index = i + 1;
            return (
              <div key={index} className="p-4 border rounded-lg bg-gray-50 space-y-4">
                <h3 className="font-medium">Question {index}</h3>
                <Textarea
                  value={questions[index] || ""}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  placeholder="Entrez votre question"
                  className="w-full"
                />
                
                <div className="mt-3">
                  <h4 className="font-medium mb-2">Réponse</h4>
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      className={`px-4 py-2 rounded ${answers[index] === true ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                      onClick={() => handleAnswerChange(index, true)}
                    >
                      {answers[index] === true && <Check className="mr-1 h-4 w-4" />}
                      Vrai
                    </Button>
                    <Button
                      type="button"
                      className={`px-4 py-2 rounded ${answers[index] === false ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                      onClick={() => handleAnswerChange(index, false)}
                    >
                      {answers[index] === false && <Check className="mr-1 h-4 w-4" />}
                      Faux
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {error && (
          <motion.div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p>{error}</p>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création en cours...
              </>
            ) : (
              "Créer le quiz"
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
