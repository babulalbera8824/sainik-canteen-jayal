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
  {id:"1", name_hi:"Aata 5kg", price:250, mrp:280, cat:"Aata", emoji:"🌾", image:"https://images.unsplash.com/photo-1599599810694-1bb0f45f5d18?w=300&h=300&fit=crop"},
  {id:"2", name_hi:"Toor Dal 1kg", price:180, mrp:200, cat:"Dal", emoji:"🫘", image:"https://images.unsplash.com/photo-1599599810694-1bb0f45f5d18?w=300&h=300&fit=crop"},
  {id:"3", name_hi:"Chawal 5kg", price:350, mrp:400, cat:"Chawal", emoji:"🍚", image:"https://images.unsplash.com/photo-1599599810694-1bb0f45f5d18?w=300&h=300&fit=crop"},
  {id:"4", name_hi:"Sarson Tel 1L", price:170, mrp:190, cat:"Tel", emoji:"🛢️", image:"https://images.unsplash.com/photo-1599599810694-1bb0f45f5d18?w=300&h=300&fit=crop"},
  {id:"5", name_hi:"Haldi 200g", price:60, mrp:70, cat:"Masala", emoji:"🌶️", image:"https://images.unsplash.com/photo-1599599810694-1bb0f45f5d18?w=300&h=300&fit=crop"},
  {id:"6", name_hi:"Parle-G", price:30, mrp:30, cat:"Biscuit", emoji:"🍪", image:"https://images.unsplash.com/photo-1599599810694-1bb0f45f5d18?w=300&h=300&fit=crop"},
  {id:"7", name_hi:"Tata Salt 1kg", price:28, mrp:30, cat:"Masala", emoji:"🧂", image:"https://images.unsplash.com/photo-1599599810694-1bb0f45f5d18?w=300&h=300&fit=crop"},
  {id:"8", name_hi:"Chai Patti 250g", price:120, mrp:140, cat:"Masala", emoji:"☕", image:"https://images.unsplash.com/photo-1599599810694-1bb0f45f5d18?w=300&h=300&fit=crop"},
]

interface Toast {
  id: string
  message: string
  type: 'success' | 'info' | 'error'
}

interface OrderItem {
  id: string
  name_hi: string
  qty: number
  price: number
  total: number
  timestamp: number
}

export default function HomePage(){
  const [products,setProducts]=useState<any[]>(MOCK)
  const [search,setSearch]=useState("")
  const [cat,setCat]=useState("All")
  const [cart,setCart]=useState<any[]>([])
  const [showCart,setShowCart]=useState(false)
  const [wishlist,setWishlist]=useState<string[]>([])
  const [showOrders,setShowOrders]=useState(false)
  const [orders,setOrders]=useState<OrderItem[]>([])
  const [loading,setLoading]=useState(true)
  const [toasts,setToasts]=useState<Toast[]>([])

  useEffect(()=>{
    setLoading(true)
    supabase.from('products').select('*').eq('is_available',true).then(r=>{
      if(r.data && r.data.length>0) {
        setProducts(r.data.map((p:any)=>({...p, emoji:"🛒", cat: p.name_hi.includes("Aata")?"Aata":p.name_hi.includes("Dal")?"Dal":"All", mrp:p.price+30, image:`https://images.unsplash.com/photo-1599599810694-1bb0f45f5d18?w=300&h=300&fit=crop&t=${p.id}`})))
      }
      setLoading(false)
    })
    // Load wishlist from localStorage
    const saved = localStorage.getItem('wishlist')
    if(saved) setWishlist(JSON.parse(saved))
    // Load order history from localStorage
    const orderHist = localStorage.getItem('orders')
    if(orderHist) setOrders(JSON.parse(orderHist))
  },[])

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, {id, message, type}])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }

  const filtered = products.filter(p=> (cat==="All"||p.cat===cat||p.name_hi.toLowerCase().includes(cat.toLowerCase())) && p.name_hi.toLowerCase().includes(search.toLowerCase()))

  const add = (p:any)=>{
    const e=cart.find(c=>c.id===p.id)
    if(e) setCart(cart.map(c=>c.id===p.id?{...c,qty:c.qty+1}:c))
    else setCart([...cart,{...p,qty:1}])
    addToast(`${p.name_hi} को कार्ट में जोड़ा गया`, 'success')
    setShowCart(true)
  }

  const remove = (id: string) => {
    setCart(cart.filter(c => c.id !== id))
    addToast('कार्ट से हटाया गया', 'info')
  }

  const updateQty = (id: string, qty: number) => {
    if(qty <= 0) {
      remove(id)
      return
    }
    setCart(cart.map(c => c.id === id ? {...c, qty} : c))
  }

  const toggleWishlist = (id: string) => {
    const newWishlist = wishlist.includes(id) 
      ? wishlist.filter(w => w !== id)
      : [...wishlist, id]
    setWishlist(newWishlist)
    localStorage.setItem('wishlist', JSON.stringify(newWishlist))
    addToast(wishlist.includes(id) ? 'विशलिस्ट से हटाया गया' : 'विशलिस्ट में जोड़ा गया', 'info')
  }

  const total = cart.reduce((s,c)=>s+c.price*c.qty,0)

  const orderWA = ()=>{
    let msg=`*सैनिक कैंटीन जायाल - नया Order*%0A%0A`
    cart.forEach(c=>{msg+=`${c.name_hi} x ${c.qty} = ₹${c.price*c.qty}%0A`})
    msg+=`%0A*Total: ₹${total}*%0AFree Delivery in Jayal%0A%0AAddress:`
    
    // Save to order history
    const newOrder: OrderItem[] = cart.map(c => ({
      id: c.id,
      name_hi: c.name_hi,
      qty: c.qty,
      price: c.price,
      total: c.price * c.qty,
      timestamp: Date.now()
    }))
    const updatedOrders = [...orders, ...newOrder]
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    
    setCart([])
    setShowCart(false)
    addToast('WhatsApp पर ऑर्डर भेजा जा रहा है...', 'success')
    window.open(`https://wa.me/919549062946?text=${msg}`,'_blank')
  }

  return(
    <main className="min-h-screen bg-[#FFF8E7] font-sans">
      <div className="bg-[#0F3D2E] text-white text-center text-xs py-1.5">🚚 Jayal me 2 Ghante me Free Delivery | 📞 +919549062946</div>
      <header className="sticky top-0 z-40 bg-[#0F3D2E] text-white p-4 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <h1 className="font-black text-lg whitespace-nowrap">🛡️ सैनिक कैंटीन</h1>
          <div className="flex-1 relative">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Aata, Dal, Tel search..." className="w-full rounded-full pl-4 pr-10 py-2.5 text-black outline-none focus:ring-2 focus:ring-[#D4AF37]" />
            <span className="absolute right-3 top-2.5">🔍</span>
          </div>
          <button onClick={()=>setShowOrders(true)} className="bg-white/10 text-white px-4 py-2.5 rounded-full font-bold hover:bg-white/20 transition">📋 Orders</button>
          <button onClick={()=>setShowCart(true)} className="bg-[#D4AF37] text-black px-4 py-2.5 rounded-full font-bold relative hover:bg-yellow-300 transition">🛒{cart.length>0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cart.length}</span>}</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto">
        <div className="m-4 bg-gradient-to-br from-[#0F3D2E] via-[#164a38] to-[#0F3D2E] rounded-[24px] p-6 md:p-10 text-white grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black leading-tight">जयाल की अपनी<br/>दुकान</h2>
            <p className="opacity-80 mt-2">Fresh • Sasta • Tez Delivery • Home Delivery Available</p>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>document.getElementById('products')?.scrollIntoView({behavior:'smooth'})} className="bg-[#D4AF37] text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-300 transition">Abhi Order Karo</button>
              <a href="/admin" className="bg-white/10 px-6 py-3 rounded-full font-bold hover:bg-white/20 transition">Admin</a>
            </div>
          </div>
          <div className="bg-white/10 rounded-[20px] p-6 text-center backdrop-blur">
            <div className="text-6xl">🛒</div>
            <p className="mt-3 font-bold">100+ Products • Best Price in Jayal</p>
          </div>
        </div>

        <div className="px-4 flex gap-2 overflow-x-auto pb-2">
          {CATS.map(c=>(
            <button key={c.id} onClick={()=>setCat(c.id)} className={`px-5 py-2.5 rounded-full whitespace-nowrap font-bold flex items-center gap-2 transition-all ${cat===c.id?'bg-[#0F3D2E] text-white shadow-lg':' bg-white text-[#0F3D2E] hover:shadow-md'}`}>
              <span>{c.icon}</span>{c.name}
            </button>
          ))}
        </div>

        <div id="products" className="p-4">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-[20px] p-4 shadow animate-pulse">
                  <div className="h-28 bg-gray-300 rounded-[14px]"></div>
                  <div className="h-4 bg-gray-300 mt-3 rounded"></div>
                  <div className="h-3 bg-gray-200 mt-2 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filtered.map(p=>(
                <div key={p.id} className="bg-white rounded-[20px] p-4 shadow hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative">
                  <button onClick={() => toggleWishlist(p.id)} className={`absolute top-3 right-3 z-10 text-xl transition ${wishlist.includes(p.id) ? 'text-red-500' : 'text-gray-300 hover:text-red-500'}`}>
                    {wishlist.includes(p.id) ? '❤️' : '🤍'}
                  </button>
                  <div className="relative">
                    <img 
                      src={p.image} 
                      alt={p.name_hi}
                      className="h-28 w-full bg-[#FFF8E7] rounded-[14px] object-cover group-hover:scale-110 transition"
                    />
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">{Math.round((1-p.price/p.mrp)*100)}% OFF</span>
                  </div>
                  <h3 className="font-bold mt-3 text-[#0F3D2E] text-[15px] line-clamp-1">{p.name_hi}</h3>
                  <p className="text-xs opacity-60">500g • Fresh</p>
                  <div className="flex items-center justify-between mt-2">
                    <div><span className="text-[#D4AF37] font-black">₹{p.price}</span> <span className="text-xs line-through opacity-50">₹{p.mrp}</span></div>
                    <button onClick={()=>add(p)} className="bg-[#0F3D2E] text-white w-8 h-8 rounded-full font-bold hover:bg-black transition">+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {filtered.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-2xl">😔</p>
              <p className="text-gray-600 mt-2">कोई उत्पाद नहीं मिला</p>
            </div>
          )}
        </div>

        <div className="m-4 bg-white rounded-[20px] p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div><div className="text-2xl">🚚</div><p className="font-bold text-sm mt-1">Free Delivery</p><p className="text-xs opacity-60">₹500+ par free</p></div>
          <div><div className="text-2xl">🌿</div><p className="font-bold text-sm mt-1">Fresh Products</p><p className="text-xs opacity-60">Roz fresh stock</p></div>
          <div><div className="text-2xl">💰</div><p className="font-bold text-sm mt-1">Best Price</p><p className="text-xs opacity-60">Jayal me sabse sasta</p></div>
          <div><div className="text-2xl">📞</div><p className="font-bold text-sm mt-1">24/7 Support</p><p className="text-xs opacity-60">+919549062946</p></div>
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div key={toast.id} className={`px-4 py-3 rounded-full text-white font-bold shadow-lg animate-bounce ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' :
            'bg-blue-500'
          }`}>
            {toast.message}
          </div>
        ))}
      </div>

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-[60] bg-black/50" onClick={()=>setShowCart(false)}>
          <div className="absolute right-0 top-0 h-full w-[92%] max-w-[380px] bg-white p-6 shadow-2xl overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center sticky top-0 bg-white pb-4">
              <h2 className="font-black text-xl">🛒 आपका कार्ट</h2>
              <button onClick={()=>setShowCart(false)} className="text-2xl hover:text-gray-600">×</button>
            </div>
            <div className="mt-5 space-y-3">
              {cart.length===0?(
                <p className="text-center py-8 text-gray-500">कार्ट खाली है</p>
              ):(
                cart.map(c=>(
                  <div key={c.id} className="bg-[#FFF8E7] p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-[#0F3D2E]">{c.name_hi}</p>
                        <p className="text-xs opacity-60">₹{c.price} प्रति item</p>
                      </div>
                      <button onClick={() => remove(c.id)} className="text-red-500 hover:text-red-700">🗑️</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1">
                        <button onClick={() => updateQty(c.id, c.qty-1)} className="w-6 h-6 flex items-center justify-center font-bold hover:bg-gray-100 rounded">−</button>
                        <span className="w-6 text-center font-bold">{c.qty}</span>
                        <button onClick={() => updateQty(c.id, c.qty+1)} className="w-6 h-6 flex items-center justify-center font-bold hover:bg-gray-100 rounded">+</button>
                      </div>
                      <b className="text-[#D4AF37]">₹{c.price*c.qty}</b>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length>0 && (
              <div className="mt-6 space-y-3 sticky bottom-0 bg-white pt-4">
                <div className="border-t pt-3">
                  <div className="font-black text-lg flex justify-between">
                    <span>कुल:</span>
                    <span>₹{total}</span>
                  </div>
                  {total>=500 && <span className="text-green-600 text-xs block mt-1">✓ Free Delivery के लिए योग्य</span>}
                  {total<500 && <span className="text-orange-600 text-xs block mt-1">Free Delivery के लिए ₹{500-total} अधिक जोड़ें</span>}
                </div>
                <button onClick={orderWA} className="w-full bg-gradient-to-r from-[#0F3D2E] to-green-700 text-white py-3 rounded-full font-black hover:shadow-lg transition">
                  💬 WhatsApp पर भेजें
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order History Drawer */}
      {showOrders && (
        <div className="fixed inset-0 z-[60] bg-black/50" onClick={()=>setShowOrders(false)}>
          <div className="absolute right-0 top-0 h-full w-[92%] max-w-[380px] bg-white p-6 shadow-2xl overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center sticky top-0 bg-white pb-4">
              <h2 className="font-black text-xl">📋 ऑर्डर हिस्ट्री</h2>
              <button onClick={()=>setShowOrders(false)} className="text-2xl hover:text-gray-600">×</button>
            </div>
            <div className="mt-5 space-y-3">
              {orders.length===0?(
                <p className="text-center py-8 text-gray-500">कोई ऑर्डर नहीं</p>
              ):(
                orders.map((order, idx) => (
                  <div key={idx} className="bg-[#FFF8E7] p-4 rounded-xl">
                    <p className="font-bold text-[#0F3D2E]">{order.name_hi}</p>
                    <div className="flex justify-between text-sm mt-2">
                      <span>मात्रा: {order.qty}</span>
                      <span className="font-bold">₹{order.total}</span>
                    </div>
                    <p className="text-xs opacity-60 mt-2">{new Date(order.timestamp).toLocaleDateString('hi-IN')}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="bg-[#0F1E18] text-white/70 p-8 text-center text-sm mt-8">📍 Jayal, Nagaur, Rajasthan 341023 • 📞 +919549062946 • 🕘 7AM-9PM Daily</footer>
    </main>
  )
}
