'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
export default function Admin(){
  const [hi,setHi]=useState(''); const [price,setPrice]=useState(''); const [msg,setMsg]=useState('')
  async function add(){
    const { error } = await supabase.from('products').insert({ name_hi: hi, name_en: hi, slug: hi.replace(/\s+/g,'-')+Date.now(), price: Number(price), is_available: true })
    setMsg(error ? error.message : '✅ Product add ho gaya!')
  }
  return <main className="p-6"><h1 className="text-xl font-bold">Admin - Product Add</h1><input value={hi} onChange={e=>setHi(e.target.value)} placeholder="Naam Hindi" className="border p-2 w-full mt-4 rounded"/><input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price" type="number" className="border p-2 w-full mt-2 rounded"/><button onClick={add} className="bg-[#0F3D2E] text-white p-2 w-full mt-3 rounded">Add Product</button><p className="mt-3">{msg}</p><a href="/" className="text-blue-600 underline">Home jao</a></main>
}
