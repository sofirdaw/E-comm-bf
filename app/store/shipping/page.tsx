export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Livraison & retours</h1>
      
      {/* Livraison rapide et sécurisée */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          🚚 Livraison rapide et sécurisée
        </h2>
        <div className="bg-[#1a1a1f] rounded-xl p-6 border border-white/5">
          <p className="text-gray-300 mb-6 text-lg">
            Nous assurons une livraison rapide partout au Burkina Faso.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-[#d4920c] text-xl">📍</span>
              <div>
                <p className="text-white font-semibold">Livraison à Ouagadougou</p>
                <p className="text-gray-300">24h à 48h</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#d4920c] text-xl">📦</span>
              <div>
                <p className="text-white font-semibold">Livraison en province</p>
                <p className="text-gray-300">2 à 5 jours ouvrables</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#d4920c] text-xl">🔐</span>
              <div>
                <p className="text-white font-semibold">Emballage sécurisé</p>
                <p className="text-gray-300">Produits soigneusement emballés</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#d4920c] text-xl">📲</span>
              <div>
                <p className="text-white font-semibold">Suivi de commande</p>
                <p className="text-gray-300">Par téléphone ou WhatsApp</p>
              </div>
            </div>
          </div>
          <p className="text-gray-300 mt-6 text-sm italic">
            Nos partenaires logistiques garantissent un transport fiable et sécurisé.
          </p>
        </div>
      </div>

      {/* Politique de retours simple */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          🔄 Politique de retours simple
        </h2>
        <div className="bg-gradient-to-r from-[#1a1a1f] to-[#2a2a2f] rounded-xl p-6 border border-white/5">
          <p className="text-gray-300 mb-6 text-lg">
            Votre satisfaction est notre priorité.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-[#d4920c] text-xl">🔁</span>
              <div>
                <p className="text-white font-semibold">Retour possible</p>
                <p className="text-gray-300">Sous 7 jours après réception</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#d4920c] text-xl">💰</span>
              <div>
                <p className="text-white font-semibold">Remboursement</p>
                <p className="text-gray-300">Ou échange rapide</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#d4920c] text-xl">🛠️</span>
              <div>
                <p className="text-white font-semibold">Assistance technique</p>
                <p className="text-gray-300">En cas de produit défectueux</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#d4920c] text-xl">📞</span>
              <div>
                <p className="text-white font-semibold">Service client</p>
                <p className="text-gray-300">Réactif et disponible</p>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-[#d4920c]/10 rounded-lg border border-[#d4920c]/20">
            <p className="text-gray-300 font-medium">
              <span className="text-white">Conditions :</span> Le produit doit être retourné dans son emballage d'origine et en bon état.
            </p>
          </div>
        </div>
      </div>

      {/* Garantie & Confiance */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          🔒 Garantie & Confiance
        </h2>
        <div className="bg-[#d4920c]/10 rounded-xl p-6 border border-[#d4920c]/20">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <span className="text-[#d4920c] text-xl">✅</span>
              <div>
                <p className="text-white font-semibold">Produits authentiques</p>
                <p className="text-gray-300">100% garantis</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#d4920c] text-xl">🛡️</span>
              <div>
                <p className="text-white font-semibold">Paiement sécurisé</p>
                <p className="text-gray-300">Transactions protégées</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#d4920c] text-xl">📞</span>
              <div>
                <p className="text-white font-semibold">Assistance client</p>
                <p className="text-gray-300">Disponible 7j/7</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#d4920c] text-xl">⭐</span>
              <div>
                <p className="text-white font-semibold">Service professionnel</p>
                <p className="text-gray-300">Transparent et fiable</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Astuce crédibilité */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          💡 Astuce crédibilité
        </h2>
        <div className="bg-gradient-to-r from-[#d4920c] to-[#e8aa1f] rounded-xl p-6 border border-[#d4920c]/30">
          <p className="text-white text-lg font-medium text-center leading-relaxed">
            La confiance se construit par la transparence et la qualité de service. 
            Chaque commande est une opportunité de vous prouver notre engagement 
            envers votre satisfaction.
          </p>
        </div>
      </div>
    </div>
  )
}
