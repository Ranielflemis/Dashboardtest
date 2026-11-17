
import React from 'react'
import Card from '../../components/layout/Card/Card'
import Table from '../../components/layout/Table/Table'
import fornecedoresService from '../../services/fornecedoresService'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from "../../components/ui/Loading"
import Modal from "../../components/ui/Modal"
import Button from "../../components/ui/Button"
import SearchInput from "../../components/ui/SearchInput"
import { BsPencilFill, BsTrashFill } from "react-icons/bs"

const SuppliersList = () => {
  const [fornecedores, setFornecedores] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [fornecedoresId, setFornecedoresId] = React.useState(null)
  const [search, setSearch] = React.useState("")

  
  const carregarLista = async (busca) => {
    try {
      setLoading(true)

      const dados = busca
        ? await fornecedoresService.getBySearch(busca)
        : await fornecedoresService.getAll()

      console.log("Fornecedores => ", dados)

      
      if (dados === null || !dados.data) {
        setFornecedores([])
        toast.info("Nenhum registro encontrado")
      } else {
        setFornecedores(dados.data)
      }

    } catch (error) {
      setFornecedores([])
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  
  React.useEffect(() => {
    carregarLista()
  }, [])

  
  const handleDelete = async () => {
    try {
      setLoading(true)

      const response = await fornecedoresService.delete(fornecedoresId)
      const { status, message } = response

      if (status === "error") {
        toast.error(message)
        return
      }

      toast.success(message || "Fornecedor removido com sucesso!")

      setModalOpen(false)
      setFornecedoresId(null)

      // Atualizar lista após excluir
      await carregarLista(search)

    } catch (error) {
      toast.error(error.message || "Erro ao remover fornecedor")
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      header: "Código",
      accessor: "id_fornecedor",
    },
    {
      header: "Razão Social",
      accessor: "razao_social",
    },
    {
      header: "Nome fantasia",
      accessor: "nome_fantasia",
    },
    {
      header: "CNPJ",
      accessor: "cnpj",
    },
    {
      header: "Ações",
      accessor: "acoes",
      render: (row) => (
        <div className="flex gap-2">
          <Link to={`/fornecedores/edit/${row.id_fornecedor}`}>
            <Button
              className="
                text-blue-600
                bg-none
              "
            >
              <BsPencilFill />
            </Button>
          </Link>

          <Button
            onClick={() => {
  setFornecedoresId(row.id_fornecedor)
  setModalOpen(true)
  console.log("Id => ", row.id_fornecedor)
}}
            className="
              text-red-600
            "
          >
            <BsTrashFill />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <Card title="Lista de fornecedores" button="fornecedores">

      <SearchInput
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          carregarLista(e.target.value)
        }}
        placeholder="Pesquisar fornecedor por nome fantasia, CNPJ..."
      />

      {loading ? (
        <Loading />
      ) : (
        <Table data={fornecedores} columns={columns} />
      )}

      <Modal
        open={modalOpen}
        onConfirm={handleDelete}
        onCancel={() => {
          setModalOpen(false)
          setFornecedoresId(null)
        }}
      />

    </Card>
  )
}

export default SuppliersList
