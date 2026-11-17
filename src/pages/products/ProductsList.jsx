
import React from 'react'
import Loading from '../../components/ui/Loading'
import Card from '../../components/layout/Card/Card'
import Table from '../../components/layout/Table/Table'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import SearchInput from '../../components/ui/SearchInput'
import produtosService from '../../services/produtosService'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BsPencilFill, BsTrashFill } from 'react-icons/bs'

const ProductsList = () => {
  const [loading, setLoading] = React.useState(true);
  const [produtos, setProdutos] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [produtoId, setProdutoId] = React.useState(null);
  const [search, setSearch] = React.useState("");

  const handleDelete = async () => {
    try {
      setLoading(true);

      const response = await produtosService.delete(produtoId)
      const { status, message } = response

      if (status === "error") {
        toast.error(message)
        return
      }

      toast.success(message || "Produto removido com sucesso!")

    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
      setModalOpen(false)
      carregarLista(search)
    }
  }

  // Função para carregar registros da tabela
  const carregarLista = async (busca) => {
    try {
      setLoading(true);

      const dados = busca
        ? await produtosService.getBySearch(busca)
        : await produtosService.getAll()

      console.log("Produtos => ", dados)

      if (dados === null || !Array.isArray(dados.data)) {
        setProdutos([])
        toast.info("Nenhum registro encontrado")
      } else {
        setProdutos(dados.data)
      }

    } catch (error) {
      setProdutos([])
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    const timer = setTimeout(() => {
      carregarLista(search)
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  const columns = [
    {
      header: "Código",
      accessor: "id_produto",
    },
    {
      header: "Produto",
      accessor: "produto",
      render: (row) => (
        <div>
          <p>{row.produto}</p>
          <span className='text-gray-400 dark:text-gray-600 font-semibold text-sm'>
            {row.marca?.marca || "Sem marca"}
          </span>
        </div>
      )
    },
    {
      header: "Qtde",
      accessor: "qtde",
    },
    {
      header: "$ Preço",
      accessor: "preco_unit",
    },
    {
      header: "Ações",
      accessor: "acoes",
      render: (row) => (
        <div className="flex gap-2">
          <Link to={`/produtos/edit/${row.id_produto}`}>
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
              setProdutoId(row.id_produto)
              setModalOpen(true)
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
  ];

  return (
    <Card title="Lista de Produtos" button="produtos">
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Pesquisar produto por nome, marca ou preço..."
      />

      {loading ? (
        <Loading />
      ) : (
        <Table data={produtos} columns={columns} />
      )}

      <Modal
        open={modalOpen}
        onConfirm={handleDelete}
        onCancel={() => setModalOpen(false)}
      />
    </Card>
  )
}

export default ProductsList;
