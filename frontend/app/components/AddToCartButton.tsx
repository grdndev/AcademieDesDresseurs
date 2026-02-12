import { Plus } from "lucide-react";

export default function AddToCartButton({addToCart}: {addToCart: () => void}) {
    return <button className="flex items-center gap-1 rounded-full bg-white border border-gray-200 px-3 py-1 text-sm shadow-md hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 active:brightness-125 cursor-pointer"
        onClick={addToCart} >
        <span>Ajouter</span>
        <Plus className="w-4 h-4" />
    </button>
}