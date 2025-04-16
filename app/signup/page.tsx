"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validation des champs
      if (!username || !email || !password) {
        setError("Veuillez remplir tous les champs.");
        return;
      }

      if (password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
        return;
      }

      setError("");
      setIsLoading(true);

      try {
        const supabase = createClient();

        // Insérer l'utilisateur dans la table `utilisateur`
        const { error } = await supabase
          .from("utilisateur")
          .insert({
            nom_utilisateur: username,
            email: email,
            mot_de_passe: password,
            role: "utilisateur",
          });

        if (error) {
          console.error("Erreur Supabase :", error);
          setError("Une erreur est survenue lors de l'inscription.");
          return;
        }

        // Rediriger vers la page d'accueil après une inscription réussie
        router.push("/");
      } catch (err) {
        console.error("Erreur inattendue :", err);
        setError("Une erreur inattendue est survenue.");
      } finally {
        setIsLoading(false);
      }
    },
    [username, email, password, router]
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
          <h2 className="text-xl font-medium">Nom d&apos;utilisateur</h2>
          <Input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-2 h-12 rounded-full"
            disabled={isLoading}
          />
        </motion.div>

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

        <motion.div className="flex flex-col items-center mb-6" variants={itemVariants}>
          <Link href="/login" className="text-sm hover:underline text-center">
            Vous avez déjà un compte ? <br />
            <span className="font-medium">Connectez-vous</span>
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
                Inscription en cours...
              </>
            ) : (
              "Inscription"
            )}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}