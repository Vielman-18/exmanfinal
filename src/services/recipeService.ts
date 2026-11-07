import { api } from './api'
import type { Recipe, ListFilters, RecipesResponse } from '../types'

export const PAGE_SIZE = 8

export const recipeService = {
  list: async ({ page, q }: ListFilters): Promise<RecipesResponse> => {
    if (q && q.trim()) {
      const { data } = await api.get<RecipesResponse>('/auth/recipes/search', {
        params: { q, limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE },
      })
      return data
    }
    const { data } = await api.get<RecipesResponse>('/auth/recipes', {
      params: { limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE },
    })
    return data
  },

  getById: async (id: number): Promise<Recipe> => {
    const { data } = await api.get<Recipe>(`/auth/recipes/${id}`)
    return data
  },

  create: async (body: FormData): Promise<Recipe> => {
    const { data } = await api.post<Recipe>('/recipes/add', body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  remove: async (id: number): Promise<Recipe> => {
    const { data } = await api.delete<Recipe>(`/recipes/${id}`)
    return data
  },
}