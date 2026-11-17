
import React from 'react'
import Loading from '../../components/ui/Loading'
import Card from '../../components/layout/Card/Card'
import Table from '../../components/layout/Table/Table'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import SearchInput from '../../components/ui/SearchInput'
import vendasService from '../../services/vendasService'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BsPencilFill, BsTrashFill } from 'react-icons/bs'

const SalesList = () => {
  const [loading, setLoading] = React.useState(true)
  const [vendas, setVendas] = React.useState([])
  const [modalOpen, setModalOpen] = React.useState(false)
  const [vendaId, setVendaId] = React.useState(null)
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

  // Calcula total da venda
  const calcularTotal = (produtos) => {
    return produtos.reduce((total, produto) => {
      return total + calcularSubtotal(produto)
    }, 0)
  }

  // Carrega as vendas
  const carregarLista = async (busca) => {
    try {
      setLoading(true)

      const dados = busca
        ? await vendasService.getBySearch(busca)
        : await vendasService.getAll()

      if (!dados || !dados.data || dados.data.length === 0) {
        setVendas([])
        return
      }

      setVendas(dados.data)

    } catch (error) {
      setVendas([])
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Remove venda
  const handleDelete = async () => {
    try {
      setLoading(true)

      const response = await vendasService.delete(vendaId)

      toast.success(response.message)

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
      accessor: "ID_VENDA",
      render: (row) => (
        <span className="font-semibold">
          #{row.ID_VENDA}
        </span>
      )
    },
    {
      header: "Data",
      accessor: "DATA",
    },

    {
      header: "Cliente",
      accessor: "CLIENTE",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {row.CLIENTE?.NOME}
          </span>

          <span className="text-gray-400 dark:text-gray-500 text-xs">
            CPF: {row.CLIENTE?.CPF}
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
                <span>
                  Qtde: {produto.QTDE}
                </span>

                <span>
                  Unit.: {formatarMoeda(produto.PRECO_UNIT)}
                </span>

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
          ${row.STATUS === 'Finalizado'
            ? 'bg-green-100 text-green-700'
            : row.STATUS === 'Cancelado'
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
          <Link to={`/vendas/edit/${row.ID_VENDA}`}>
            <Button className="text-blue-600 bg-none">
              <BsPencilFill />
            </Button>
          </Link>

          <Button
            onClick={() => {
              setVendaId(row.ID_VENDA)
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
    <Card title="Lista de Vendas" button="vendas">

      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Pesquisar por cliente, CPF ou código da venda..."
      />

      {loading ? (
        <Loading />
      ) : (
        <Table
          data={vendas}
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

export default SalesList
