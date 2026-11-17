import api from "./api"

const fornecedoresService = {
    getAll: async () => {
        return await api.get(`/Fornecedores/`)
    },
    getById: async (id) => {
        return await api.get(`/Fornecedores/?id=${id}`)
    },
    getByrazaosocial: async (razao_social) => {
        return await api.get(`/Fornecedores/?razao_social=${razao_social}`)
    },
    getBySearch: async (search) => {
        return await api.get(`/Fornecedores/?search=${search}`)
    },
    create: async (dados) => {
        return await api.post(`/Fornecedores/`, dados)
    },
    update: async (id, dados) => {
        return await api.put(`/Fornecedores/?id=${id}`, dados)
    },
    delete: async (id) => {
        return await api.delete(`/Fornecedores/?id=${id}`)
    },
}

export default fornecedoresService;