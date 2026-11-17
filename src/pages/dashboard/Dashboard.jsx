
import React from 'react'
import Card from '../../components/layout/Card/Card';
import StatsCard from '../../components/layout/StatsCard/StatsCard'
import { BsPerson, BsGift, BsBasket, BsTruck } from "react-icons/bs";
import clientesService from '../../services/clientesService';
import produtosService from '../../services/produtosService';
import vendasService from '../../services/vendasService';
import comprasService from '../../services/comprasService';

const Dashboard = () => {

    const [totalClientes, setTotalClientes] = React.useState(0);
    const [totalProdutos, setTotalProdutos] = React.useState(0);
    const [totalVendas, setTotalVendas] = React.useState(0);
    const [totalCompras, setTotalCompras] = React.useState(0);

    const carregarDados = async () => {
        try {
            const clientes = await clientesService.getAll();
            setTotalClientes(clientes?.total || 0);

            const produtos = await produtosService.getAll();
            setTotalProdutos(produtos?.total || 0);

            const vendas = await vendasService.getAll();
            setTotalVendas(vendas?.total || 0);

            const compras = await comprasService.getAll();
            setTotalCompras(compras?.total || 0);

        } catch (error) {
            console.error(error);
            setTotalClientes(0);
            setTotalProdutos(0);
            setTotalVendas(0);
            setTotalCompras(0);
        }
    }

    React.useEffect(() => {
        carregarDados();
    }, []);

    // Identificar o maior valor entre os indicadores
    const maiorTotal = Math.max(
        totalClientes,
        totalProdutos,
        totalVendas,
        totalCompras
    );

    return (
        <Card title="Dashboard">
            <div className="space-y-6">

                {/* Cabeçalho */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Visão geral
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Acompanhe os principais indicadores do seu sistema.
                    </p>
                </div>

                {/* Indicadores */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                    <StatsCard
                        title="Clientes"
                        value={totalClientes}
                        icon={BsPerson}
                        color="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                        barColor="bg-blue-400"
                        maxValue={maiorTotal}
                    />

                    <StatsCard
                        title="Produtos"
                        value={totalProdutos}
                        icon={BsGift}
                        color="bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300"
                        barColor="bg-red-400"
                        maxValue={maiorTotal}
                    />

                    <StatsCard
                        title="Compras"
                        value={totalCompras}
                        icon={BsTruck}
                        color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-300"
                        barColor="bg-yellow-400"
                        maxValue={maiorTotal}
                    />

                    <StatsCard
                        title="Vendas"
                        value={totalVendas}
                        icon={BsBasket}
                        color="bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300"
                        barColor="bg-green-400"
                        maxValue={maiorTotal}
                    />

                </div>

            </div>
        </Card>
    )
}

export default Dashboard
