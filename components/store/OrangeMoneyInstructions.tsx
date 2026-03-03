// components/store/OrangeMoneyInstructions.tsx
import { Smartphone, MessageCircle, Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { formatPrice } from '@/lib/utils'

export function OrangeMoneyInstructions({ orderNumber, amount, itemsTotal, shippingCost }: { 
  orderNumber: string;
  amount: string;
  itemsTotal: number;
  shippingCost: number;
}) {
  const [copied, setCopied] = useState(false)
  
  // Compute the numeric amount by summing items total and the
  // dynamically‑provided shipping cost (previously hard‑coded
  // to 1500 in earlier versions).
  const numericAmount = itemsTotal + shippingCost
  const ussdCode = "*144*2*1*66193424*" + numericAmount + "#"
  const whatsappUrl = "https://wa.me/22666193424"

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-[rgba(255,165,0,0.05)] border border-[rgba(255,165,0,0.2)] rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-[rgba(255,165,0,0.1)] border border-[rgba(255,165,0,0.3)] flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-orange-500" />
        </div>
        <h3 className="text-xl font-semibold text-[#ffa500] mb-2">
          📱 Paiement Orange Money
        </h3>
        <p className="text-sm text-[#9898a8]">
          Suivez ces étapes pour finaliser votre paiement
        </p>
      </div>

      {/* USSD Code */}
      <div className="bg-[#1a1a1f] rounded-lg p-4 border border-white/5">
        <h4 className="font-medium text-[#e8e8ec] mb-3 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-orange-500" />
          1. Composez ce code USSD :
        </h4>
        <div className="flex items-center gap-3">
          <code className="flex-1 bg-black/30 text-orange-400 px-3 py-2 rounded font-mono text-sm">
            {ussdCode}
          </code>
          <button
            onClick={() => copyToClipboard(ussdCode)}
            className="p-2 bg-[rgba(255,165,0,0.1)] hover:bg-[rgba(255,165,0,0.2)] text-orange-500 rounded transition-colors"
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-[#6e6e80] mt-2">
          Cliquez sur copier puis collez dans votre application téléphone
        </p>
      </div>

      {/* WhatsApp Contact */}
      <div className="bg-[#1a1a1f] rounded-lg p-4 border border-white/5">
        <h4 className="font-medium text-[#e8e8ec] mb-3 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-green-500" />
          2. Contactez-nous sur WhatsApp :
        </h4>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 px-4 py-3 rounded-lg transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">Ouvrir WhatsApp</span>
          <span className="text-sm opacity-75">+226 66 19 34 24</span>
        </a>
        <div className="mt-3 text-sm text-[#6e6e80] space-y-1">
          <p>• Envoyez votre numéro de commande : <span className="text-[#ffa500] font-mono">{orderNumber}</span></p>
          <p>• Joignez une capture d'écran du paiement</p>
          <p>• Nous validerons votre paiement dans les plus brefs délais</p>
        </div>
      </div>

      {/* Important Info */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <h4 className="font-medium text-yellow-500 mb-2">⚠️ Important</h4>
        <ul className="text-sm text-[#9898a8] space-y-1">
          <li>• Gardez votre preuve de paiement</li>
          <li>• Votre commande sera validée après confirmation du paiement</li>
          <li>• Vous recevrez un email de confirmation une fois le paiement validé</li>
        </ul>
      </div>

      {/* Order Summary */}
      <div className="bg-[#1a1a1f] rounded-lg p-4 border border-white/5">
        <h4 className="font-medium text-[#e8e8ec] mb-2">Récapitulatif</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#6e6e80]">Commande :</span>
            <span className="text-[#ffa500] font-mono">{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6e6e80]">Sous-total articles :</span>
            <span className="text-[#e8e8ec]">{formatPrice(itemsTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6e6e80]">Frais de livraison :</span>
            <span className="text-[#e8e8ec]">{formatPrice(shippingCost)}</span>
          </div>
          <div className="flex justify-between font-bold text-[#ffa500] pt-2 border-t border-white/5">
            <span>Total à payer :</span>
            <span>{formatPrice(numericAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
