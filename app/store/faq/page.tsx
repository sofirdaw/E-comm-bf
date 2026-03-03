'use client'

import { useState } from 'react'

export default function FAQPage() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null)

  const faqItems = [
    {
      question: "Comment naviguer sur le site e-comm-bf ?",
      answer: "La navigation est simple : utilisez le menu principal pour accéder aux produits, votre compte, ou le panier. Vous pouvez filtrer les produits par catégorie, prix ou marque. Le footer contient des liens rapides vers les pages importantes comme À propos, Livraison, et Conditions.",
      category: "Navigation"
    },
    {
      question: "Comment créer un compte sur e-comm-bf ?",
      answer: "Cliquez sur 'Se connecter' en haut à droite, puis 'Créer un compte'. Remplissez vos informations (nom, email, téléphone, mot de passe). Vous recevrez une confirmation par email. Un compte vous permet de suivre vos commandes, sauvegarder vos préférences et accéder à votre liste de souhaits.",
      category: "Compte"
    },
    {
      question: "Comment trouver et acheter un produit ?",
      answer: "Utilisez la barre de recherche ou naviguez par catégorie. Cliquez sur un produit pour voir les détails, photos et avis. Choisissez vos options (couleur, quantité), cliquez sur 'Ajouter au panier', puis finalisez votre commande dans le panier.",
      category: "Achat"
    },
    {
      question: "Quels sont les modes de paiement acceptés ?",
      answer: "Nous acceptons les paiements sécurisés via nos partenaires de confiance : Mobile Money (Orange Money, Wave, MoMo), cartes bancaires, et paiement à la livraison. Toutes les transactions sont cryptées et sécurisées.",
      category: "Paiement"
    },
    {
      question: "Comment fonctionne la livraison au Burkina Faso ?",
      answer: "Nous livrons partout au Burkina Faso : 24-48h à Ouagadougou, 2-5 jours en province. Vous serez notifié par téléphone/WhatsApp lors de la livraison. Les frais de livraison sont calculés automatiquement selon votre localisation.",
      category: "Livraison"
    },
    {
      question: "Puis-je retourner un produit ?",
      answer: "Oui, vous pouvez retourner un produit sous 7 jours après réception. Le produit doit être dans son emballage d'origine et en bon état. Contactez notre service client pour initier un retour. Nous proposons remboursement ou échange.",
      category: "Retours"
    },
    {
      question: "Comment utiliser ma liste de souhaits ?",
      answer: "Connectez-vous à votre compte, cliquez sur l'icône ❤️ sur n'importe quel produit pour l'ajouter à votre liste de souhaits. Vous pouvez consulter votre liste dans votre compte pour suivre les produits ou les acheter plus tard.",
      category: "Fonctionnalités"
    },
    {
      question: "Pourquoi faire confiance à e-comm-bf ?",
      answer: "Nous sommes une entreprise locale spécialisée en équipements informatiques. Tous nos produits sont 100% authentiques avec garantie. Paiements sécurisés, livraison rapide, service client réactif 7j/7. Des centaines de clients satisfaits au Burkina Faso.",
      category: "Confiance"
    },
    {
      question: "Comment suivre ma commande ?",
      answer: "Après validation, vous recevrez un email de confirmation. Notre équipe vous contactera par téléphone/WhatsApp pour organiser la livraison. Vous pouvez aussi vérifier le statut dans votre compte sous 'Mes commandes'.",
      category: "Commande"
    },
    {
      question: "Quelle garantie sur les produits ?",
      answer: "Tous nos produits bénéficient de la garantie fabricant (généralement 1-2 ans). En cas de problème sous garantie, contactez notre service technique. Nous vous assisterons pour réparation ou remplacement selon les conditions.",
      category: "Garantie"
    },
    {
      question: "Comment contacter le service client ?",
      answer: "Notre service client est disponible 7j/7 : 📞 +226 66 19 34 24, 📧 contact@ecommbf.com, ou via le formulaire de contact. Nous répondons généralement sous quelques heures pour toute question ou problème.",
      category: "Support"
    },
    {
      question: "Les prix affichés incluent-ils les taxes ?",
      answer: "Oui, tous nos prix sont en FCFA (XOF) et incluent toutes les taxes applicables. Aucun frais caché - le prix que vous voyez est le prix que vous payez, hors frais de livraison optionnels.",
      category: "Prix"
    }
  ]

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Questions Fréquemment Posées</h1>
      
      {/* Introduction */}
      <div className="mb-12 bg-[#d4920c]/10 rounded-xl p-6 border border-[#d4920c]/20">
        <p className="text-gray-300 leading-relaxed">
          Trouvez des réponses rapides à vos questions sur e-comm-bf. Si vous ne trouvez pas votre réponse ici, 
          n'hésitez pas à contacter notre service client disponible 7j/7.
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div key={`faq-${index}`} className="bg-[#1a1a1f] rounded-xl border border-white/5 overflow-hidden">
            <button
              onClick={() => toggleQuestion(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-[#d4920c] mt-1">Q{index + 1}</span>
                <div>
                  <p className="text-white font-medium">{item.question}</p>
                  <p className="text-[#d4920c] text-sm mt-1">{item.category}</p>
                </div>
              </div>
              <span className="text-[#d4920c] text-xl">
                {openQuestion === index ? '−' : '+'}
              </span>
            </button>
            
            {openQuestion === index && (
              <div className="px-6 pb-4 border-t border-white/5">
                <div className="pt-4 pl-8">
                  <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="mt-12 bg-gradient-to-r from-[#d4920c] to-[#e8aa1f] rounded-xl p-6 border border-[#d4920c]/30">
        <h3 className="text-white font-semibold mb-4">Pas trouvé votre réponse ?</h3>
        <p className="text-gray-300 mb-4">
          Notre service client est là pour vous aider avec toutes vos questions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="tel:+22666193424" className="flex items-center gap-2 text-white hover:underline">
            📞 +226 66 19 34 24
          </a>
          <a href="mailto:contact@ecommbf.com" className="flex items-center gap-2 text-white hover:underline">
            📧 contact@ecommbf.com
          </a>
        </div>
      </div>
    </div>
  )
}
