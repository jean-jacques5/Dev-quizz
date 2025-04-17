"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth(); // Utiliser la fonction login du contexte

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email || !password) {
        setError("Veuillez remplir tous les champs");
        return;
      }

      setError("");
      setIsLoading(true);

      try {
        const success = await login(email, password); // Appeler la fonction login du contexte

        if (!success) {
          setError("Email ou mot de passe incorrect");
          return;
        }

        // Connexion réussie
        alert("Connexion réussie !");
        router.push("/"); // Rediriger vers la page d'accueil
      } catch (err) {
        setError("Une erreur est survenue lors de la connexion");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, login, router]
  );

  // Variants d'animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm p-6 mt-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="max-w-md mx-auto">
        <motion.div className="mb-8" variants={itemVariants}>
          <h2 className="text-xl font-medium">Email</h2>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-2 h-12 rounded-full"
            disabled={isLoading}
          />
        </motion.div>

        <motion.div className="mb-8" variants={itemVariants}>
          <h2 className="text-xl font-medium">Mot de passe</h2>
          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-2 h-12 rounded-full"
            disabled={isLoading}
          />
        </motion.div>

        {error && (
          <motion.div
            className="mb-4 text-red-500 text-sm text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <motion.div className="flex flex-col items-center space-y-4 mb-6" variants={itemVariants}>
          <Link href="/signup" className="text-sm hover:underline text-center">
            Pas encore de compte ? <br />
            <span className="font-medium">Créez-en un</span>
          </Link>
        </motion.div>

        <motion.div
          className="flex justify-center"
          variants={itemVariants}
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
        >
          <Button
            onClick={handleSubmit}
            className="bg-gray-300 hover:bg-gray-400 text-black rounded-full px-8 py-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              "Connexion"
            )}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}