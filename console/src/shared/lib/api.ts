// Placeholder for API client configuration
// You can use axios or fetch wrapper here

export const apiClient = {
    get: async (url: string) => {
        console.log(`GET ${url}`)
        return Promise.resolve({})
    },
    post: async (url: string, data: unknown) => {
        console.log(`POST ${url}`, data)
        return Promise.resolve({})
    }
}

