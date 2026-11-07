import axios from 'axios'

export function getErrorMessage(error: unknown): string {
  if (!error) return 'Ocurrió un error desconocido'
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Sin conexión. Revise su red e intente de nuevo.'
    const status = error.response.status
    const msg = error.response.data?.message
    if (status === 400) return msg ?? 'Solicitud inválida. Verifique los datos ingresados.'
    if (status === 401) return msg ?? 'No autorizado. Inicie sesión nuevamente.'
    if (status === 403) return 'No tiene permiso para realizar esta acción.'
    if (status === 404) return msg ?? 'El recurso no fue encontrado.'
    if (status >= 500) return 'Error del servidor. Intente más tarde.'
    return msg ?? `Error inesperado (${status}).`
  }
  if (error instanceof Error) return error.message
  return 'Ocurrió un error inesperado.'
}