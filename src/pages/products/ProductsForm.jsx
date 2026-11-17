
import React from "react";
import Card from "../../components/layout/Card/Card";
import { Link, useNavigate, useParams } from "react-router-dom";
import Input from "../../components/ui/Input";
import Label from "../../components/ui/Label";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import ImageUpload from "../../components/ui/ImageUpload";
import marcasService from "../../services/marcasService";
import produtosService from "../../services/produtosService";
import { toast } from "react-toastify";
import Loading from "../../components/ui/Loading";

const ProductsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = React.useState(true);

  const [produto, setProduto] = React.useState({
    id_produto: "",
    produto: "",
    descricao: "",
    qtde: "",
    preco_unit: "",
    marca: {
      id_marca: "",
      marca: ""
    },
  });

  const [marcas, setMarcas] = React.useState([]);

  // Função para carregar as Marcas
  const carregarMarcas = async () => {
    const dados = await marcasService.getAll();
    setMarcas(dados.data || []);
  };

  const marcasOptions = marcas.map((item) => ({
    value: item.id_marca,
    label: item.marca,
  }));

  React.useEffect(() => {
    // Função para carregar registros da tabela
    const carregarForm = async () => {
      try {
        setLoading(true);

        // Carregar marcas
        await carregarMarcas();

        // Verifica se é Novo ou Edit
        if (!id) {
          return;
        }

        const dados = await produtosService.getById(id);
        const registro = dados.data[0];

        setProduto({
          id_produto: registro.id_produto,
          produto: registro.produto,
          descricao: registro.descricao,
          qtde: registro.qtde,
          preco_unit: registro.preco_unit,
          marca: {
            id_marca: registro.marca?.id_marca || "",
            marca: registro.marca?.marca || ""
          },
        });

      } catch (error) {
        toast.error(error.message || "Erro ao carregar produto");
      } finally {
        setLoading(false);
      }
    };

    carregarForm();
  }, [id]);

  const handleSubmit = async (e) => {
    // Desativar função de mudar de página ao clicar no Salvar
    e.preventDefault();
    setLoading(true);

    try {
      let response;

      // Se tiver variável ID, significa UPDATE
      if (id) {
        // UPDATE - PUT
        response = await produtosService.update(id, produto);
      } else {
        // CREATE - POST
        response = await produtosService.create(produto);
      }

      // Recuperar resposta da API
      const { status, message } = response;

      if (status === "error") {
        toast.error(message);
        return;
      }

      // Redirecionar para lista principal
      navigate("/produtos");

      // Exibir mensagem de sucesso
      toast.success(message || "Produto salvo com sucesso!");

    } catch (error) {
      toast.error(error.message || "Erro ao salvar produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Card title="Informações de Produto">
          <form
            onSubmit={handleSubmit}
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Produto */}
            <div>
              <Label htmlFor="produto" required>
                Produto
              </Label>
              <Input
                required={true}
                name="produto"
                placeholder="Produto"
                value={produto.produto}
                onChange={(e) => {
                  setProduto({
                    ...produto,
                    produto: e.target.value,
                  });
                }}
              />
            </div>

            {/* Marca */}
            <div>
              <Label htmlFor="marca" required>
                Marca
              </Label>
              <Select
                required
                name="marca"
                value={produto.marca.id_marca}
                onChange={(e) =>
                  setProduto({
                    ...produto,
                    marca: {
                      ...produto.marca,
                      id_marca: e.target.value,
                    },
                  })
                }
                options={marcasOptions}
                placeholder="Selecione uma marca"
              />
            </div>

            {/* Descrição */}
            <div className="col-span-2">
              <Label htmlFor="descricao" required>
                Descrição
              </Label>

              <Textarea
                required={true}
                id="descricao"
                name="descricao"
                value={produto.descricao}
                onChange={(e) => {
                  setProduto({
                    ...produto,
                    descricao: e.target.value,
                  });
                }}
                rows={5}
                maxLength={500}
              />
            </div>

            {/* QTDE */}
            <div>
              <Label htmlFor="qtde" required>
                QTDE
              </Label>

              <Input
                required={true}
                type="number"
                id="qtde"
                name="qtde"
                value={produto.qtde}
                onChange={(e) => {
                  setProduto({
                    ...produto,
                    qtde: e.target.value,
                  });
                }}
              />
            </div>

            {/* Preço unitário */}
            <div>
              <Label htmlFor="preco_unit">
                Preço unitário
              </Label>
              <Input
                type="number"
                id="preco_unit"
                name="preco_unit"
                placeholder="9999.99"
                value={produto.preco_unit}
                onChange={(e) => {
                  setProduto({
                    ...produto,
                    preco_unit: e.target.value,
                  });
                }}
              />
            </div>

            {/* Foto do produto */}
<div className="md:col-span-2">
  <Label htmlFor="imagem">
    Foto do produto
  </Label>

  <Input
    type="file"
    id="imagem"
    name="imagem"
    accept="image/*"
  />
</div>

            {/* Botões */}
            <div className="md:col-span-2 flex gap-2 pt-2">
              <Link to="/produtos">
                <Button
                  className="
                    bg-red-300
                    hover:bg-red-400
                    text-white
                  "
                >
                  Cancelar
                </Button>
              </Link>

              <Button
                type="submit"
                className="
                  bg-blue-800
                  hover:bg-blue-900
                  text-white
                "
              >
                Enviar
              </Button>
            </div>
          </form>
        </Card>
      )}
    </>
  );
};

export default ProductsForm;
