import api from "./api"

const comprasService = {
    getAll: async () => {
        return await api.get(`/compras/`)
    },
    getById: async (id) => {
        return await api.get(`/compras/?id=${id}`)
    },
    getByProduct: async (produto) => {
        return await api.get(`/compras/?produto=${produto}`)
    },
    getByBrand: async (marca) => {
        return await api.get(`/compras/?marca=${marca}`)
    },
    getBySupplier: async (fornecedor) => {
        return await api.get(`/compras/?fornecedor=${fornecedor}`)
    },
    getBySearch: async (search) => {
        return await api.get(`/compras/?search=${search}`)
    },
    create: async (dados) => {
        return await api.post(`/compras/`, dados)
    },
    update: async (id, dados) => {
        return await api.put(`/compras/?id=${id}`, dados)
    },
    delete: async (id) => {
        return await api.delete(`/compras/?id=${id}`)
    },
}

export default comprasService;
