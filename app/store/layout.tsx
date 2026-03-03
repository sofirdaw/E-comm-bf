// app/store/layout.tsx
import { Navbar } from '@/components/store/Navbar'
import { Footer } from '@/components/store/Footer'
import { CartSidebar } from '@/components/store/CartSidebar'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartSidebar />
    </div>
  )
}
