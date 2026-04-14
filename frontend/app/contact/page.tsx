"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ContactPage(){
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const router = useRouter()

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        // Placeholder behaviour: just navigate to home and log. Replace with API call when backend endpoint exists.
        console.log('Contact request', { email, message })
        router.push('/')
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow">
                <h1 className="text-2xl font-black mb-4">Contact</h1>
                <p className="text-gray-600 mb-6">Utilisez ce formulaire pour nous contacter. Ce formulaire est un placeholder et redirigera vers la page d'accueil.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="w-full border px-4 py-3 rounded-lg" placeholder="Votre email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    <textarea className="w-full border px-4 py-3 rounded-lg" placeholder="Votre message" value={message} onChange={e => setMessage(e.target.value)} />
                    <div className="text-right">
                        <button className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold">Envoyer</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
