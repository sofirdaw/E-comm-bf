#!/bin/bash

echo "🚀 Démarrage rapide d'E-Comm BF avec optimisations..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

# Démarrer Redis
echo "📦 Démarrage Redis..."
if ! redis-cli ping &> /dev/null; then
    if command -v docker &> /dev/null; then
        docker start redis-cache 2>/dev/null || docker run -d -p 6379:6379 --name redis-cache redis:latest
        echo "✅ Redis démarré avec Docker"
    else
        echo "❌ Docker non trouvé. Veuillez installer Redis manuellement"
        exit 1
    fi
else
    echo "✅ Redis déjà en cours d'exécution"
fi

# Attendre que Redis soit prêt
sleep 3

# Installer les dépendances
echo "📚 Installation des dépendances..."
npm ci

# Démarrer l'application
echo "🌟 Démarrage de l'application optimisée..."
echo "📍 URL: http://localhost:3000"
echo "🔧 Admin: http://localhost:3000/admin"
echo "📊 Performance monitoring activé"
echo ""

npm run dev
