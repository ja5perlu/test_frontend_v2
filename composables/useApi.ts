import { Configuration, UserApi } from '~/api/generated'
import type {
    MainGetUserInfoResp,
    MainCreateUserInfoReq,
    MainUpdateUserInfoReq,
    MainDeleteUserInfoReq,
} from '~/api/generated'

export const useApi = () => {
    const config = useRuntimeConfig()

    const configuration = new Configuration({
        basePath: config.public.apiBase as string,
    })

    const userApi = new UserApi(configuration)

    return {
        // 取得用戶列表
        async getUsers() {
            const response = await userApi.getUserInfo()
            return response.data.data as MainGetUserInfoResp[]
        },

        // 創建用戶
        async createUser(data: MainCreateUserInfoReq) {
            const response = await userApi.createUserInfo({ request: data })
            return response.data.data
        },

        // 更新用戶
        async updateUser(data: MainUpdateUserInfoReq) {
            const response = await userApi.updateUserInfo({ request: data })
            return response.data
        },

        // 刪除用戶
        async deleteUser(data: MainDeleteUserInfoReq) {
            const response = await userApi.deleteUserInfo({ request: data })
            return response.data
        },
    }
}
