'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const CATS = [
  {id:"All", name:"All", icon:"🛒"},
  {id:"Aata", name:"Aata", icon:"🌾"},
  {id:"Dal", name:"Dal", icon:"🫘"},
  {id:"Chawal", name:"Chawal", icon:"🍚"},
  {id:"Tel", name:"Tel", icon:"🛢️"},
  {id:"Masala", name:"Masala", icon:"🌶️"},
  {id:"Biscuit", name:"Biscuit", icon:"🍪"},
]

const MOCK = [
  {id:"1", name_hi:"Aata 5kg", price:250, mrp:280, cat:"Aata", emoji:"🌾"},
  {id:"2", name_hi:"Toor Dal 1kg", price:180, mrp:200, cat:"Dal", emoji:"🫘"},
  {id:"3", name_hi:"Chawal 5kg", price:350, mrp:400, cat:"Chawal", emoji:"🍚"},
  {id:"4", name_hi:"Sarson Tel 1L", price:170, mrp:190, cat:"Tel", emoji:"🛢️"},
  {id:"5", name_hi:"Haldi 200g", price:60, mrp:70, cat:"Masala", emoji:"🌶️"},
  {id:"6", name_hi:"Parle-G", price:30, mrp:30, cat:"Biscuit", emoji:"🍪"},
  {id:"7", name_hi:"Tata Salt 1kg", price:28, mrp:30, cat:"Masala", emoji:"🧂"},
  {id:"8", name_hi:"Chai Patti 250g", price:120, mrp:140, cat:"Masala", emoji:"☕"},
]

export default function HomePage(){
  const [products,setProducts]=useState<any[]>(MOCK)
  const [search,setSearch]=useState("")
  const [cat,setCat]=useState("All")
  const [cart,setCart]=useState<any[]>([])
  const [showCart,setShowCart]=useState(false)

  useEffect(()=>{
    supabase.from('products').select('*').eq('is_available',true).then(r=>{
      if(r.data && r.data.length>0) setProducts(r.data.map((p:any)=>({...p, emoji:"🛒", cat: p.name_hi.includes("Aata")?"Aata":p.name_hi.includes("Dal")?"Dal":"All", mrp:p.price+30})))
    })
  },[])

  const filtered = products.filter(p=> (cat==="All"||p.cat===cat||p.name_hi.toLowerCase().includes(cat.toLowerCase())) && p.name_hi.toLowerCase().includes(search.toLowerCase()))

  const add = (p:any)=>{
    const e=cart.find(c=>c.id===p.id)
    if(e) setCart(cart.map(c=>c.id===p.id?{...c,qty:c.qty+1}:c))
    else setCart([...cart,{...p,qty:1}])
    setShowCart(true)
  }
  const total = cart.reduce((s,c)=>s+c.price*c.qty,0)

  const orderWA = ()=>{
    let msg=`*सैनिक कैंटीन जायाल - नया Order*%0A%0A`
    cart.forEach(c=>{msg+=`${c.name_hi} x ${c.qty} = ₹${c.price*c.qty}%0A`})
    msg+=`%0A*Total: ₹${total}*%0AFree Delivery in Jayal%0A%0AAddress:`
    window.open(`https://wa.me/918824612158?text=${msg}`,'_blank')
  }

  return(
    <main className="min-h-screen bg-[#FFF8E7] font-sans">
      <div className="bg-[#0F3D2E] text-white text-center text-xs py-1.5">🚚 Jayal me 2 Ghante me Free Delivery | 📞 +919549062946</div>
      <header className="sticky top-0 z-40 bg-[#0F3D2E] text-white p-4 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <h1 className="font-black text-lg whitespace-nowrap">🛡️ सैनिक कैंटीन</h1>
          <div className="flex-1 relative">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Aata, Dal, Tel search..." className="w-full rounded-full pl-4 pr-10 py-2.5 text-black outline-none focus:ring-[...]"/>
            <span className="absolute right-3 top-2.5">🔍</span>
          </div>
          <button onClick={()=>setShowCart(true)} className="bg-[#D4AF37] text-black px-4 py-2.5 rounded-full font-bold relative">🛒{cart.length>0 && <span className="absolute -top-1 -right-1 bg-red[...]"}</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto">
        <div className="m-4 bg-gradient-to-br from-[#0F3D2E] via-[#164a38] to-[#0F3D2E] rounded-[24px] p-6 md:p-10 text-white grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black leading-tight">जयाल की अपनी<br/>दुकान</h2>
            <p className="opacity-80 mt-2">Fresh • Sasta • Tez Delivery • Home Delivery Available</p>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>document.getElementById('products')?.scrollIntoView({behavior:'smooth'})} className="bg-[#D4AF37] text-black px-6 py-3 rounded-full font-bold">Abhi Order Karo</button>
              <a href="/admin" className="bg-white/10 px-6 py-3 rounded-full font-bold">Admin</a>
            </div>
          </div>
          <div className="bg-white/10 rounded-[20px] p-6 text-center backdrop-blur">
            <div className="text-6xl">🛒</div>
            <p className="mt-3 font-bold">100+ Products • Best Price in Jayal</p>
          </div>
        </div>

        <div className="px-4 flex gap-2 overflow-x-auto pb-2">
          {CATS.map(c=>(
            <button key={c.id} onClick={()=>setCat(c.id)} className={`px-5 py-2.5 rounded-full whitespace-nowrap font-bold flex items-center gap-2 transition-all ${cat===c.id?'bg-[#0F3D2E] text-wh[...]`}
          ))}
        </div>

        <div id="products" className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map(p=>(
            <div key={p.id} className="bg-white rounded-[20px] p-4 shadow hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="relative">
                <div className="h-28 bg-[#FFF8E7] rounded-[14px] grid place-items-center text-4xl group-hover:scale-110 transition">{p.emoji}</div>
                <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">{Math.round((1-p.price/p.mrp)*100)}% OFF</span>
              </div>
              <h3 className="font-bold mt-3 text-[#0F3D2E] text-[15px] line-clamp-1">{p.name_hi}</h3>
              <p className="text-xs opacity-60">500g • Fresh</p>
              <div className="flex items-center justify-between mt-2">
                <div><span className="text-[#D4AF37] font-black">₹{p.price}</span> <span className="text-xs line-through opacity-50">₹{p.mrp}</span></div>
                <button onClick={()=>add(p)} className="bg-[#0F3D2E] text-white w-8 h-8 rounded-full font-bold hover:bg-black">+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="m-4 bg-white rounded-[20px] p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div><div className="text-2xl">🚚</div><p className="font-bold text-sm mt-1">Free Delivery</p><p className="text-xs opacity-60">₹500+ par free</p></div>
          <div><div className="text-2xl">🌿</div><p className="font-bold text-sm mt-1">Fresh Products</p><p className="text-xs opacity-60">Roz fresh stock</p></div>
          <div><div className="text-2xl">💰</div><p className="font-bold text-sm mt-1">Best Price</p><p className="text-xs opacity-60">Jayal me sabse sasta</p></div>
          <div><div className="text-2xl">📞</div><p className="font-bold text-sm mt-1">24/7 Support</p><p className="text-xs opacity-60">+919549062946</p></div>
        </div>
      </div>

      {showCart && (
        <div className="fixed inset-0 z-[60] bg-black/50" onClick={()=>setShowCart(false)}>
          <div className="absolute right-0 top-0 h-full w-[92%] max-w-[380px] bg-white p-6 shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between"><h2 className="font-black text-xl">Cart</h2><button onClick={()=>setShowCart(false)} className="text-2xl">×</button></div>
            <div className="mt-5 space-y-3 max-h-[60vh] overflow-auto">
              {cart.length===0?<p>Cart khali hai</p>:cart.map(c=>(
                <div key={c.id} className="flex justify-between bg-[#FFF8E7] p-3 rounded-xl">
                  <span>{c.name_hi} x {c.qty}</span><b>₹{c.price*c.qty}</b>
                </div>
              ))}
            </div>
            {cart.length>0 && <><div className="mt-6 font-black">Total: ₹{total} {total>=500 && <span className="text-green-600 text-xs">+ Free Delivery</span>}</div><button onClick={orderWA} c[...]
          </div>
        </div>
      )}
      <footer className="bg-[#0F1E18] text-white/70 p-8 text-center text-sm mt-8">📍 Jayal, Nagaur, Rajasthan 341023 • 📞 +919549062946 • 🕘 7AM-9PM Daily</footer>
    </main>
  )
}
