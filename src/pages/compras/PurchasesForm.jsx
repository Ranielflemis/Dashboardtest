import React from "react";
import Card from "../../components/layout/Card/Card";
import { Link, useNavigate, useParams } from "react-router-dom";
import Input from "../../components/ui/Input";
import Label from "../../components/ui/Label";
import Button from "../../components/ui/Button";
import comprasService from "../../services/comprasService";
import fornecedoresService from "../../services/fornecedoresService";
import produtosService from "../../services/produtosService";
import { toast } from "react-toastify";
import Loading from "../../components/ui/Loading";

const PurchasesForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = React.useState(true);

    const [fornecedores, setFornecedores] = React.useState([]);
    const [produtos, setProdutos] = React.useState([]);

    const [compra, setCompra] = React.useState({
        ID_COMPRA: "",
        DATA: new Date().toISOString().split("T")[0],
        FORMA_PGTO: "Pix",
        STATUS: "Pendente",
        FORNECEDOR: {
            ID_FORNECEDOR: "",
        },
        PRODUTOS: [],
    });

    // Carregar fornecedores, produtos e compra
    React.useEffect(() => {
        const carregarDados = async () => {
            try {
                const [fornecedoresResponse, produtosResponse] =
                    await Promise.all([
                        fornecedoresService.getAll(),
                        produtosService.getAll(),
                    ]);

                setFornecedores(fornecedoresResponse.data || []);
                setProdutos(produtosResponse.data || []);

                // Se for edição, carregar compra
                if (id) {
                    const response = await comprasService.getById(id);
                    const dados = response.data[0];

                    setCompra({
                        ID_COMPRA: dados.ID_COMPRA,
                        DATA: dados.DATA.split("/").reverse().join("-"),
                        FORMA_PGTO: dados.FORMA_PGTO,
                        STATUS: dados.STATUS,
                        FORNECEDOR: {
                            ID_FORNECEDOR: dados.FORNECEDOR.ID_FORNECEDOR,
                        },
                        PRODUTOS: dados.PRODUTOS.map((produto) => {
                            const produtoCadastrado = (produtosResponse.data || []).find(
                                (item) => String(item.ID_PRODUTO) === String(produto.ID_PRODUTO)
                            );

                            return {
                                ID_PRODUTO: produto.ID_PRODUTO,
                                PRODUTO: produto.PRODUTO,
                                PRECO_UNIT: Number(
                                    produtoCadastrado?.PRECO_UNIT ?? produto.PRECO_UNIT ?? 0
                                ),
                                QTDE: Number(produto.QTDE),
                            };
                        }),
                    });
                }
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        carregarDados();
    }, [id]);

    // Atualizar dados da compra
    const handleChange = (campo, valor) => {
        setCompra((prev) => ({
            ...prev,
            [campo]: valor,
        }));
    };

    // Adicionar produto
    const adicionarProduto = () => {
        setCompra((prev) => ({
            ...prev,
            PRODUTOS: [
                ...prev.PRODUTOS,
                {
                    ID_PRODUTO: "",
                    PRODUTO: "",
                    PRECO_UNIT: 0,
                    QTDE: 1,
                },
            ],
        }));
    };

    // Selecionar produto
    const selecionarProduto = (index, idProduto) => {
        const produtoSelecionado = produtos.find(
            (produto) => String(produto.ID_PRODUTO) === String(idProduto)
        );

        if (!produtoSelecionado) return;

        const novosProdutos = [...compra.PRODUTOS];

        novosProdutos[index] = {
            ID_PRODUTO: produtoSelecionado.ID_PRODUTO,
            PRODUTO: produtoSelecionado.PRODUTO,
            PRECO_UNIT: Number(produtoSelecionado.PRECO_UNIT || 0),
            QTDE: 1,
        };

        setCompra((prev) => ({
            ...prev,
            PRODUTOS: novosProdutos,
        }));
    };

    // Alterar quantidade, permitindo somente números inteiros positivos
    const alterarQuantidade = (index, quantidade) => {
        const novosProdutos = [...compra.PRODUTOS];

        if (quantidade === "") {
            novosProdutos[index].QTDE = "";
        } else {
            novosProdutos[index].QTDE = Math.max(
                1,
                Math.floor(Number(quantidade))
            );
        }

        setCompra((prev) => ({
            ...prev,
            PRODUTOS: novosProdutos,
        }));
    };

    // Remover produto
    const removerProduto = (index) => {
        setCompra((prev) => ({
            ...prev,
            PRODUTOS: prev.PRODUTOS.filter((_, i) => i !== index),
        }));
    };

    // Calcular total
    const totalCompra = compra.PRODUTOS.reduce(
        (total, produto) =>
            total +
            Number(produto.PRECO_UNIT || 0) *
            Number(produto.QTDE || 0),
        0
    );

    // Salvar compra
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!compra.FORNECEDOR.ID_FORNECEDOR) {
            toast.error("Selecione um fornecedor.");
            return;
        }

        if (compra.PRODUTOS.length === 0) {
            toast.error("Adicione pelo menos um produto.");
            return;
        }

        if (
            compra.PRODUTOS.some(
                (produto) =>
                    !produto.ID_PRODUTO ||
                    !Number.isInteger(Number(produto.QTDE)) ||
                    Number(produto.QTDE) <= 0 ||
                    !Number.isFinite(Number(produto.PRECO_UNIT)) ||
                    Number(produto.PRECO_UNIT) < 0
            )
        ) {
            toast.error("Verifique os produtos, preços e quantidades.");
            return;
        }

        setLoading(true);

        try {
            // A API de Compras recebe os campos do JSON em letras minúsculas
            const dadosCompra = {
                data: compra.DATA,
                forma_pgto: compra.FORMA_PGTO,
                status: compra.STATUS,
                fornecedor: {
                    id_fornecedor: Number(compra.FORNECEDOR.ID_FORNECEDOR),
                },
                produtos: compra.PRODUTOS.map((produto) => ({
                    id_produto: Number(produto.ID_PRODUTO),
                    preco_unit: Number(produto.PRECO_UNIT),
                    qtde: Number(produto.QTDE),
                })),
            };

            let response;

            if (id) {
                response = await comprasService.update(id, dadosCompra);
            } else {
                response = await comprasService.create(dadosCompra);
            }

            if (response.status === "error") {
                toast.error(response.message);
                return;
            }

            toast.success(response.message);
            navigate("/compras");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <Card title="Informações de Compras">
            <form
                onSubmit={handleSubmit}
                className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                {/* Data */}
                <div>
                    <Label htmlFor="data" required>
                        Data da Compra
                    </Label>
                    <Input
                        type="date"
                        id="data"
                        required
                        value={compra.DATA}
                        onChange={(e) => handleChange("DATA", e.target.value)}
                    />
                </div>

                {/* Fornecedor */}
                <div>
                    <Label htmlFor="fornecedor" required>
                        Fornecedor
                    </Label>
                    <select
                        id="fornecedor"
                        required
                        value={compra.FORNECEDOR.ID_FORNECEDOR}
                        onChange={(e) =>
                            handleChange("FORNECEDOR", {
                                ID_FORNECEDOR: e.target.value,
                            })
                        }
                        className="w-full border border-gray-300 rounded-md p-2"
                    >
                        <option value="">Selecione um fornecedor</option>
                        {fornecedores.map((fornecedor) => (
                            <option
                                key={fornecedor.ID_FORNECEDOR}
                                value={fornecedor.ID_FORNECEDOR}
                            >
                                {fornecedor.RAZAO_SOCIAL || fornecedor.NOME_FANTASIA}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Forma de pagamento */}
                <div>
                    <Label htmlFor="forma_pgto" required>
                        Forma de Pagamento
                    </Label>
                    <select
                        id="forma_pgto"
                        required
                        value={compra.FORMA_PGTO}
                        onChange={(e) => handleChange("FORMA_PGTO", e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                    >
                        <option value="Pix">Pix</option>
                        <option value="Dinheiro">Dinheiro</option>
                        <option value="Crédito">Cartão de Crédito</option>
                        <option value="Débito">Cartão de Débito</option>
                    </select>
                </div>

                {/* Status */}
                <div>
                    <Label htmlFor="status" required>
                        Status
                    </Label>
                    <select
                        id="status"
                        required
                        value={compra.STATUS}
                        onChange={(e) => handleChange("STATUS", e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                    >
                        <option value="Pendente">Pendente</option>
                        <option value="Finalizada">Finalizada</option>
                        <option value="Cancelada">Cancelada</option>
                    </select>
                </div>

                {/* Produtos */}
                <div className="md:col-span-2 border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg">Produtos da Compra</h3>
                        <Button
                            type="button"
                            onClick={adicionarProduto}
                            className="bg-blue-800 hover:bg-blue-900 text-white"
                        >
                            Adicionar Produto
                        </Button>
                    </div>

                    {compra.PRODUTOS.map((produto, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-5 gap-4 border rounded-md p-4 mb-3"
                        >
                            {/* Produto */}
                            <div className="md:col-span-2">
                                <Label>Produto</Label>
                                <select
                                    required
                                    value={produto.ID_PRODUTO}
                                    onChange={(e) =>
                                        selecionarProduto(index, e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-md p-2"
                                >
                                    <option value="">Selecione um produto</option>
                                    {produtos.map((item) => (
                                        <option key={item.ID_PRODUTO} value={item.ID_PRODUTO}>
                                            {item.PRODUTO}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Preço unitário - preenchido pelo cadastro do produto */}
                            <div>
                                <Label>Preço Unitário</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={produto.PRECO_UNIT}
                                    readOnly
                                />
                            </div>

                            {/* Quantidade */}
                            <div>
                                <Label>Quantidade</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    step="1"
                                    required
                                    value={produto.QTDE}
                                    onChange={(e) => alterarQuantidade(index, e.target.value)}
                                />
                            </div>

                            {/* Subtotal */}
                            <div>
                                <Label>Subtotal</Label>
                                <p className="font-semibold text-blue-800 pt-2">
                                    {(Number(produto.PRECO_UNIT) * Number(produto.QTDE)).toLocaleString(
                                        "pt-BR",
                                        { style: "currency", currency: "BRL" }
                                    )}
                                </p>
                            </div>

                            {/* Remover */}
                            <div className="md:col-span-5 flex justify-end">
                                <Button
                                    type="button"
                                    onClick={() => removerProduto(index)}
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                    Remover
                                </Button>
                            </div>
                        </div>
                    ))}

                    {compra.PRODUTOS.length === 0 && (
                        <p className="text-gray-500 text-center py-4">
                            Nenhum produto adicionado.
                        </p>
                    )}
                </div>

                {/* Total */}
                <div className="md:col-span-2 flex justify-end border-t pt-4">
                    <div className="text-right">
                        <span className="text-gray-600">Total da Compra</span>
                        <p className="text-2xl font-bold text-blue-800">
                            {totalCompra.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            })}
                        </p>
                    </div>
                </div>

                {/* Botões */}
                <div className="md:col-span-2 flex gap-2 pt-2">
                    <Link to="/compras">
                        <Button
                            type="button"
                            className="bg-red-300 hover:bg-red-400 text-white"
                        >
                            Cancelar
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        className="bg-blue-800 hover:bg-blue-900 text-white"
                    >
                        Enviar
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default PurchasesForm;
