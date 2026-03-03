export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Politique de confidentialité</h1>
      
      {/* Header avec date et entreprise */}
      <div className="mb-12 bg-[#d4920c]/10 rounded-xl p-6 border border-[#d4920c]/20">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <p className="text-white font-semibold">e-comm-bf</p>
            <p className="text-gray-300 text-sm">Votre partenaire technologique de confiance</p>
          </div>
          <div className="text-right">
            <p className="text-gray-300 text-sm">Dernière mise à jour :</p>
            <p className="text-white font-medium">{new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      </div>

      {/* Collecte des informations */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          📌 1. Collecte des informations
        </h2>
        <div className="bg-[#1a1a1f] rounded-xl p-6 border border-white/5">
          <p className="text-gray-300 mb-6">
            Nous collectons uniquement les informations nécessaires pour traiter vos commandes et améliorer votre expérience.
          </p>
          <p className="text-gray-300 mb-4 font-medium">Les données collectées peuvent inclure :</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Nom et prénom</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Numéro de téléphone</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Adresse de livraison</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Adresse email</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Informations de paiement (sécurisées)</span>
            </li>
          </ul>
          <p className="text-gray-300 mt-6 font-medium text-[#d4920c]">
            Nous ne collectons aucune donnée inutile.
          </p>
        </div>
      </div>

      {/* Protection de vos données */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          🔒 2. Protection de vos données
        </h2>
        <div className="bg-gradient-to-r from-[#1a1a1f] to-[#2a2a2f] rounded-xl p-6 border border-white/5">
          <p className="text-gray-300 mb-6">
            Vos informations sont protégées et sécurisées.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-[#d4920c] text-xl">🔐</span>
              <div>
                <p className="text-white font-semibold">Connexion sécurisée</p>
                <p className="text-gray-300">HTTPS / SSL</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#d4920c] text-xl">🛡️</span>
              <div>
                <p className="text-white font-semibold">Accès limité</p>
                <p className="text-gray-300">Aux données</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#d4920c] text-xl">💳</span>
              <div>
                <p className="text-white font-semibold">Paiement sécurisé</p>
                <p className="text-gray-300">Plateformes certifiées</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#d4920c] text-xl">🚫</span>
              <div>
                <p className="text-white font-semibold">Aucune revente</p>
                <p className="text-gray-300">De vos données</p>
              </div>
            </div>
          </div>
          <p className="text-gray-300 mt-6 font-medium">
            Nous respectons la confidentialité de chaque client.
          </p>
        </div>
      </div>

      {/* Utilisation des informations */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          📦 3. Utilisation des informations
        </h2>
        <div className="bg-[#1a1a1f] rounded-xl p-6 border border-white/5">
          <p className="text-gray-300 mb-4">Les données collectées servent à :</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Traiter vos commandes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Organiser la livraison</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Vous contacter en cas de besoin</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Améliorer nos services</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Envoyer des offres promotionnelles (si vous acceptez)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Cookies */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          🍪 4. Cookies
        </h2>
        <div className="bg-gradient-to-r from-[#1a1a1f] to-[#2a2a2f] rounded-xl p-6 border border-white/5">
          <p className="text-gray-300 mb-4">Notre site peut utiliser des cookies pour :</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Améliorer la navigation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Analyser le trafic</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Sauvegarder vos préférences</span>
            </li>
          </ul>
          <p className="text-gray-300 mt-4">
            Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.
          </p>
        </div>
      </div>

      {/* Vos droits */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          📞 5. Vos droits
        </h2>
        <div className="bg-[#d4920c]/10 rounded-xl p-6 border border-[#d4920c]/20">
          <p className="text-gray-300 mb-4">Vous avez le droit de :</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Consulter vos données</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Modifier vos informations</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Demander la suppression de vos données</span>
            </li>
          </ul>
          <p className="text-gray-300 mt-4">
            Pour toute demande, contactez notre service client.
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          📍 6. Contact
        </h2>
        <div className="bg-[#1a1a1f] rounded-xl p-6 border border-white/5">
          <p className="text-gray-300 mb-4">Pour toute question concernant la confidentialité :</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[#d4920c">📞</span>
              <span className="text-gray-300">Téléphone : <span className="text-white">+226 66 19 34 24</span></span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#d4920c">📧</span>
              <span className="text-gray-300">Email : <span className="text-white">contact@ecommbf.com</span></span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#d4920c">📍</span>
              <span className="text-gray-300">Adresse : <span className="text-white">Ouagadougou, Burkina Faso</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Mentions légales et crédibilité */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          💡 Mentions légales
        </h2>
        <div className="bg-gradient-to-r from-[#d4920c] to-[#e8aa1f] rounded-xl p-6 border border-[#d4920c]/30">
          <div className="space-y-4">
            <div>
              <p className="text-white font-semibold mb-2">Informations professionnelles</p>
              <p className="text-gray-300">e-comm-bf - Commerce en ligne d'équipements informatiques</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-2">Liens utiles</p>
              <div className="space-y-2">
                <a href="/store/terms" className="text-gray-300 hover:text-white transition-colors block">
                  → Conditions générales d'utilisation
                </a>
                <a href="/store/shipping" className="text-gray-300 hover:text-white transition-colors block">
                  → Politique de livraison et retours
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
