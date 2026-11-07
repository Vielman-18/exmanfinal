import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { recipeService } from '../services/recipeService'
import { getErrorMessage } from '../utils/errorHandler'
import type { Recipe, ListFilters, RecipesResponse } from '../types'

export function useRecipes(filters: ListFilters) {
  return useQuery<RecipesResponse, unknown>({
    queryKey: ['recipes', filters],
    queryFn: () => recipeService.list(filters),
    placeholderData: keepPreviousData,
  })
}

export function useRecipe(id: number) {
  return useQuery<Recipe, unknown>({
    queryKey: ['recipe', id],
    queryFn: () => recipeService.getById(id),
    retry: false,
    enabled: !!id,
  })
}

export function useCreateRecipe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: FormData) => recipeService.create(body),
    onSuccess: () => {
      toast.success('Receta creada con éxito')
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => recipeService.remove(id),
    onSuccess: () => {
      toast.success('Receta eliminada')
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}