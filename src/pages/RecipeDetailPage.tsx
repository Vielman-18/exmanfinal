import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useRecipe } from '../hooks/useRecipes'
import { getErrorMessage } from '../utils/errorHandler'
import { fichaText } from '../utils/ficha'
import type { Recipe } from '../types'

async function downloadImage(item: Recipe) {
  try {
    const res = await axios.get(item.image, { responseType: 'blob' })
    const blob: Blob = res.data
    const ext = blob.type.split('/')[1] ?? 'webp'
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receta-${item.id}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    toast.error(getErrorMessage(err))
  }
}

function downloadFicha(item: Recipe) {
  const text = fichaText(item)
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `receta-${item.id}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

function RecipeDetailPage() {
  const { id } = useParams()
  const { data, isLoading, isError, error } = useRecipe(Number(id))

  return (
    <main className="mx-auto max-w-3xl p-4">
      <Link to="/recetas" className="text-sm font-medium text-brand-700 hover:underline">
        ← Volver al catálogo
      </Link>

      {isLoading && <p className="mt-8 text-center text-slate-500" role="status">Cargando…</p>}

      {isError && (
        <Alert variant="destructive" className="mt-6">
          <AlertDescription>{getErrorMessage(error)}</AlertDescription>
        </Alert>
      )}

      {data && (
        <article className="mt-4">
          <img src={data.image} alt={data.name} className="h-64 w-full rounded-xl object-cover" />
          <h1 className="mt-4 text-2xl font-bold text-slate-900">{data.name}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {data.cuisine} · {data.difficulty} · ★ {data.rating}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Preparación: {data.prepTimeMinutes} min · Cocción: {data.cookTimeMinutes} min · Porciones: {data.servings}
          </p>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => downloadImage(data)}>
              Descargar imagen
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadFicha(data)}>
              Descargar ficha
            </Button>
          </div>

          <section className="mt-6">
            <h2 className="font-semibold text-slate-900">Ingredientes</h2>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
              {data.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
          </section>

          <section className="mt-6">
            <h2 className="font-semibold text-slate-900">Instrucciones</h2>
            <ol className="mt-2 list-decimal pl-5 text-sm text-slate-700 space-y-2">
              {data.instructions.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </section>
        </article>
      )}
    </main>
  )
}

export default RecipeDetailPage