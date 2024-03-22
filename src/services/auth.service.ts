import axiosApiInstance from '../plugins/api'

interface LoginData {
    email: string
    password: string
}

export const refreshAccessToken = async () => {
    const refresh_token = localStorage.getItem('refresh_token')
    const data = {
        refreshToken: refresh_token,
    }
    return await axiosApiInstance.post('/auth/refresh-tokens', data)
}

export const loginApi = async (data: LoginData): Promise<any> => {
    return await axiosApiInstance.post('/auth/login', data)
}

export const loginGGApi = async (data: any): Promise<any> => {
    return await axiosApiInstance.post('/auth/login-gg', data)
}
