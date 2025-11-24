import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { useRuntimeConfig } from '#imports'

function createApi(): AxiosInstance {
    const config = useRuntimeConfig()
    const BASE_URL = config.public?.apiBase || process.env.API_BASE_URL || ''
    return axios.create({
        baseURL: BASE_URL,
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
    })
}

export interface UserPayload {
    name: string
    age: number
}

export interface User extends UserPayload {
    id: number
}

export async function getUsers(): Promise<User[]> {
    const api = createApi()
    const res = await api.get('/api/user')
    const body = res.data as { code: number; data: User[]; message?: string }
    return body.data ?? []
}

export async function createUser(payload: UserPayload): Promise<User> {
    const api = createApi()
    const res = await api.post('/api/user', payload)
    const body = res.data as { code: number; data: User; message?: string }
    return body.data
}

export async function updateUser(id: number, payload: Partial<UserPayload>): Promise<User> {
    const bodyPayload = { id, ...(payload as any) }
    const api = createApi()
    try {
        if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.debug('[api] PUT /api/user', bodyPayload)
        }
        const res = await api.put(`/api/user`, bodyPayload)
        const body = res.data as { code: number; data: User; message?: string }
        if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.debug('[api] PUT /api/user response', res.status, body)
        }
        return body.data
    } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('[api] updateUser error', err?.response?.status, err?.response?.data)
        throw err
    }
}

export async function deleteUser(id: number): Promise<void> {
    const api = createApi()
    await api.delete('/api/user', { data: { id } })
}

export default { getUsers, createUser, updateUser, deleteUser }
