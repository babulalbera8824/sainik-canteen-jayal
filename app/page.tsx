'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  useEffect(() => {
    supabase.from('products').select('*').eq('is_available', true).limit(8).then(r=> { if(r.data) setProducts(r.data) })
  }, [])
  return (
    <main className="min-h-screen">
      <header className="bg-[#0F3D2E] text-white p-4 flex justify-between items-center">
        <h1 className="font-bold">🛡️ सैनिक कैंटीन जायाल</h1>
        <a href="/admin" className="bg-[#D4AF37] text-black px-3 py-1 rounded text-sm">Admin</a>
      </header>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-[#0F3D2E]">जयाल की अपनी दुकान</h2>
        <p className="text-gray-600">Home Delivery | Store Pickup | 8824612158</p>
        <div className="grid grid-cols-2 gap-4 mt-6">
          {products.length===0 ? <div className="bg-white p-6 rounded shadow col-span-2 text-center">Abhi product nahi hai, Admin me add karo</div> : products.map((p:any)=><div key={p.id} className="bg-white p-4 rounded shadow"><b>{p.name_hi}</b><br/>₹{p.price}</div>)}
        </div>
      </div>
    </main>
  )
}
