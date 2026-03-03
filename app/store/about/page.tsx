export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">À propos</h1>
      
      {/* Introduction */}
      <div className="mb-12">
        <p className="text-gray-300 text-lg leading-relaxed">
          Bienvenue à <span className="text-[#d4920c] font-semibold">e-comm-bf</span>, votre partenaire technologique de confiance.
        </p>
        <p className="text-gray-300 mt-4 leading-relaxed">
          Nous accompagnons les étudiants ambitieux, les entrepreneurs visionnaires et les entreprises exigeantes dans leur réussite digitale. Notre mission est simple : vous fournir des équipements informatiques performants, fiables et durables pour transformer vos idées en résultats concrets.
        </p>
        <p className="text-gray-300 mt-4 leading-relaxed">
          Nous sélectionnons avec rigueur des ordinateurs, imprimantes, appareils audio et appareils informatiques répondant aux plus hauts standards de qualité, de performance et de sécurité. Chaque produit est choisi pour optimiser votre productivité et soutenir votre croissance.
        </p>
      </div>

      {/* Notre engagement */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          🎯 Notre engagement
        </h2>
        <div className="bg-[#1a1a1f] rounded-xl p-6 border border-white/5">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Des équipements puissants et dernière génération</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Des solutions adaptées aux étudiants, freelances et entreprises</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Des prix compétitifs sans compromis sur la qualité</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Une livraison rapide et sécurisée</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d4920c] mt-1">•</span>
              <span className="text-gray-300">Un service client professionnel et réactif</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Pour les étudiants */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          💼 Pour les étudiants
        </h2>
        <div className="bg-gradient-to-r from-[#1a1a1f] to-[#2a2a2f] rounded-xl p-6 border border-white/5">
          <p className="text-gray-300 leading-relaxed">
            Parce que votre avenir se construit aujourd'hui, nous vous proposons des solutions fiables et accessibles pour réussir vos études et vos projets. Nos équipements sont spécialement sélectionnés pour vous accompagner dans votre parcours académique avec performance et fiabilité.
          </p>
        </div>
      </div>

      {/* Pour les entrepreneurs */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          🚀 Pour les entrepreneurs
        </h2>
        <div className="bg-gradient-to-r from-[#1a1a1f] to-[#2a2a2f] rounded-xl p-6 border border-white/5">
          <p className="text-gray-300 leading-relaxed">
            Votre performance dépend de vos outils. Nous vous aidons à travailler plus vite, plus efficacement et avec une technologie à la hauteur de vos ambitions. Libérez votre potentiel avec des équipements qui font la différence.
          </p>
        </div>
      </div>

      {/* Pour les entreprises */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          🏢 Pour les entreprises
        </h2>
        <div className="bg-gradient-to-r from-[#1a1a1f] to-[#2a2a2f] rounded-xl p-6 border border-white/5">
          <p className="text-gray-300 leading-relaxed">
            Optimisez vos infrastructures avec des équipements professionnels conçus pour la productivité, la sécurité et la continuité de vos activités. Des solutions sur mesure pour répondre aux exigences de votre entreprise.
          </p>
        </div>
      </div>

      {/* Pourquoi nous choisir */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          ✨ Pourquoi nous choisir ?
        </h2>
        <div className="bg-[#d4920c]/10 rounded-xl p-6 border border-[#d4920c]/20">
          <p className="text-gray-300 leading-relaxed mb-4">
            Nous ne sommes pas simplement un site e-commerce.
          </p>
          <p className="text-gray-300 leading-relaxed mb-4">
            Nous sommes un partenaire stratégique qui comprend vos besoins technologiques et vous accompagne dans votre évolution.
          </p>
          <p className="text-xl font-bold text-white text-center mt-6">
            e-comm-bf, la performance rencontre l'excellence.
          </p>
        </div>
      </div>
    </div>
  )
}
