export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Conditions d'utilisation</h1>
      
      {/* Acceptation des conditions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          📋 Acceptation des conditions
        </h2>
        <div className="bg-[#1a1a1f] rounded-xl p-6 border border-white/5">
          <p className="text-gray-300 leading-relaxed">
            En utilisant le site e-comm-bf, vous acceptez ces conditions d'utilisation. 
            Si vous n'acceptez pas ces termes, veuillez ne pas utiliser nos services.
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          🛍️ Services proposés
        </h2>
        <div className="bg-gradient-to-r from-[#1a1a1f] to-[#2a2a2f] rounded-xl p-6 border border-white/5">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Vente d'équipements informatiques et électroniques</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Livraison au Burkina Faso</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Service client et assistance technique</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Liste de souhaits et suivi de commandes</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Compte utilisateur */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          👤 Compte utilisateur
        </h2>
        <div className="bg-[#1a1a1f] rounded-xl p-6 border border-white/5">
          <p className="text-gray-300 mb-4">Pour utiliser certains services, vous devez créer un compte :</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Fournir des informations exactes et véridiques</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Protéger la sécurité de votre mot de passe</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Nous informer de toute utilisation non autorisée</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Données personnelles */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          🔒 Données personnelles
        </h2>
        <div className="bg-[#d4920c]/10 rounded-xl p-6 border border-[#d4920c]/20">
          <p className="text-gray-300 mb-4">Nous collectons et utilisons vos données selon notre politique de confidentialité :</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Informations de compte et de livraison</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Historique d'achats et préférences</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Données de navigation et utilisation</span>
            </li>
          </ul>
          <p className="text-gray-300 mt-4 text-sm">
            Vos données sont protégées et ne sont pas partagées sans votre consentement.
          </p>
        </div>
      </div>

      {/* Paiement */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          💳 Paiement
        </h2>
        <div className="bg-[#1a1a1f] rounded-xl p-6 border border-white/5">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Paiements sécurisés via nos partenaires</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Prix en FCFA (XOF) incluant taxes applicables</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Confirmation de commande après validation</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Propriété intellectuelle */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          ©️ Propriété intellectuelle
        </h2>
        <div className="bg-gradient-to-r from-[#1a1a1f] to-[#2a2a2f] rounded-xl p-6 border border-white/5">
          <p className="text-gray-300">
            Tout le contenu du site (textes, images, logos) est la propriété d'e-comm-bf. 
            Toute reproduction ou utilisation non autorisée est interdite.
          </p>
        </div>
      </div>

      {/* Limitation de responsabilité */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          ⚠️ Limitation de responsabilité
        </h2>
        <div className="bg-[#d4920c]/10 rounded-xl p-6 border border-[#d4920c]/20">
          <p className="text-gray-300">
            e-comm-bf n'est pas responsable des dommages indirects résultant de l'utilisation 
            du site ou des produits achetés. Nos produits sont garantis selon les conditions 
            du fabricant.
          </p>
        </div>
      </div>

      {/* Modifications */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          🔄 Modifications des conditions
        </h2>
        <div className="bg-[#1a1a1f] rounded-xl p-6 border border-white/5">
          <p className="text-gray-300">
            Nous nous réservons le droit de modifier ces conditions à tout moment. 
            Les modifications prendront effet dès leur publication sur le site.
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          📞 Contact
        </h2>
        <div className="bg-gradient-to-r from-[#d4920c] to-[#e8aa1f] rounded-xl p-6 border border-[#d4920c]/30">
          <p className="text-white text-center">
            Pour toute question sur ces conditions, contactez-nous :<br />
            📧 contact@ecommbf.com | 📱 +226 66 19 34 24
          </p>
        </div>
      </div>
    </div>
  )
}
