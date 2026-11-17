import React from 'react'
import Loading from '../../components/ui/Loading'
import Card from '../../components/layout/Card/Card'
import Table from '../../components/layout/Table/Table'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import SearchInput from '../../components/ui/SearchInput'
import comprasService from '../../services/comprasService'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BsPencilFill, BsTrashFill } from 'react-icons/bs'

const PurchasesList = () => {
  const [loading, setLoading] = React.useState(true)
  const [compras, setCompras] = React.useState([])
  const [modalOpen, setModalOpen] = React.useState(false)
  const [compraId, setCompraId] = React.useState(null)
  const [search, setSearch] = React.useState("")

  // Formata valores monetários
  const formatarMoeda = (valor) => {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  // Calcula subtotal de cada produto
  const calcularSubtotal = (produto) => {
    return Number(produto.PRECO_UNIT) * Number(produto.QTDE)
  }

  // Calcula total da compra
  const calcularTotal = (produtos) => {
    return produtos.reduce((total, produto) => {
      return total + calcularSubtotal(produto)
    }, 0)
  }

  // Carrega as compras
  const carregarLista = async (busca) => {
    try {
      setLoading(true)

      const dados = busca
        ? await comprasService.getBySearch(busca)
        : await comprasService.getAll()

      if (!dados || !dados.data || dados.data.length === 0) {
        setCompras([])
        return
      }

      setCompras(dados.data)

    } catch (error) {
      setCompras([])
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Remove compra
  const handleDelete = async () => {
    try {
      setLoading(true)

      const response = await comprasService.delete(compraId)

      if (response.status === 'error') {
        toast.error(response.message)
      } else {
        toast.success(response.message)
      }

    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
      setModalOpen(false)
      carregarLista(search)
    }
  }

  // Pesquisa com debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      carregarLista(search)
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  const columns = [
    {
      header: "Código",
      accessor: "ID_COMPRA",
      render: (row) => (
        <span className="font-semibold">
          #{row.ID_COMPRA}
        </span>
      )
    },
    {
      header: "Data",
      accessor: "DATA",
    },
    {
      header: "Fornecedor",
      accessor: "FORNECEDOR",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {row.FORNECEDOR?.RAZAO_SOCIAL || row.FORNECEDOR?.NOME_FANTASIA}
          </span>
          <span className="text-gray-400 dark:text-gray-500 text-xs">
            CNPJ: {row.FORNECEDOR?.CNPJ}
          </span>
        </div>
      )
    },
    {
      header: "Produtos",
      accessor: "PRODUTOS",
      render: (row) => (
        <div className="flex flex-col gap-2 min-w-[280px]">
          {row.PRODUTOS?.map((produto, index) => (
            <div
              key={produto.ID_PRODUTO || index}
              className="flex flex-col gap-1 border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0 last:pb-0"
            >
              <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                {produto.PRODUTO}
              </span>
              <div className="flex flex-wrap gap-x-3 text-xs text-gray-500 dark:text-gray-400">
                <span>Qtde: {produto.QTDE}</span>
                <span>Unit.: {formatarMoeda(produto.PRECO_UNIT)}</span>
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Subtotal: {formatarMoeda(calcularSubtotal(produto))}
                </span>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      header: "Pagamento",
      accessor: "FORMA_PGTO",
    },
    {
      header: "Total",
      accessor: "TOTAL",
      render: (row) => (
        <span className="font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
          {formatarMoeda(calcularTotal(row.PRODUTOS || []))}
        </span>
      )
    },
    {
      header: "Status",
      accessor: "STATUS",
      render: (row) => (
        <span className={`
          px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap
          ${row.STATUS === 'Finalizada'
            ? 'bg-green-100 text-green-700'
            : row.STATUS === 'Cancelada'
              ? 'bg-red-100 text-red-700'
              : 'bg-yellow-100 text-yellow-700'
          }
        `}>
          {row.STATUS}
        </span>
      )
    },
    {
      header: "Ações",
      accessor: "acoes",
      render: (row) => (
        <div className="flex gap-2">
          <Link to={`/compras/edit/${row.ID_COMPRA}`}>
            <Button className="text-blue-600 bg-none">
              <BsPencilFill />
            </Button>
          </Link>
          <Button
            onClick={() => {
              setCompraId(row.ID_COMPRA)
              setModalOpen(true)
            }}
            className="text-red-600"
          >
            <BsTrashFill />
          </Button>
        </div>
      )
    }
  ]

  return (
    <Card title="Lista de Compras" button="compras">
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Pesquisar por fornecedor, produto, marca ou código da compra..."
      />

      {loading ? (
        <Loading />
      ) : (
        <Table
          data={compras}
          columns={columns}
        />
      )}

      <Modal
        open={modalOpen}
        onConfirm={handleDelete}
        onCancel={() => setModalOpen(false)}
      />
    </Card>
  )
}

export default PurchasesList
