import api from "./api"

const fornecedoresService = {
    getAll: async () => {
        return await api.get(`/fornecedores/`)
    },
    getById: async (id) => {
        return await api.get(`/fornecedores/?id=${id}`)
    },
    getByrazaosocial: async (razao_social) => {
        return await api.get(`/fornecedores/?razao_social=${razao_social}`)
    },
    getBySearch: async (search) => {
        return await api.get(`/fornecedores/?search=${search}`)
    },
    create: async (dados) => {
        return await api.post(`/fornecedores/`, dados)
    },
    update: async (id, dados) => {
        return await api.put(`/fornecedores/?id=${id}`, dados)
    },
    delete: async (id) => {
        return await api.delete(`/fornecedores/?id=${id}`)
    },
}

export default fornecedoresService;