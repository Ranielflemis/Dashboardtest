
import React from "react";
import Card from "../../components/layout/Card/Card";
import { Link, useNavigate, useParams } from "react-router-dom";
import Input from "../../components/ui/Input";
import Label from "../../components/ui/Label";
import Button from "../../components/ui/Button";
import fornecedoresService from "../../services/fornecedoresService";
import { toast } from 'react-toastify';
import Loading from "../../components/ui/Loading";

const SuppliersForm = () => {
 
  const navigate = useNavigate();
   const { id } = useParams();
const [loading, setLoading] = React.useState(true);
  const [fornecedor, setFornecedor] = React.useState({
    ID_FORNECEDOR: "",
    RAZAO_SOCIAL: "",
    NOME_FANTASIA: "",
    CNPJ: "",
    TELEFONE: "",
    EMAIL: "",
    
  });

React.useEffect(() => {
    // Verifica se é Novo ou Edit
    if (!id) {
      setLoading(false);
      return;
    }
        // Função para carregar registros da tabela
        const carregarForm = async () => {
            const dados = await fornecedoresService.getById(id);
            setFornecedor({
                id_fornecedor: dados.data[0]["id_fornecedor"],
                razao_social: dados.data[0]["razao_social"],
                nome_fantasia: dados.data[0]["nome_fantasia"],
                cnpj: dados.data[0]["cnpj"],
                telefone: dados.data[0]["telefone"],
                email: dados.data[0]["email"],
            });
      
      setLoading(false);
    };
    
        carregarForm();
    }, []);
  
   const handleSubmit = async (e) => {
    
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      
      if (id) {
        
        response = await fornecedoresService.update(id, fornecedor);
      } else {
        
        response = await fornecedoresService.create(fornecedor);
      }

      // Recuperar resposta da API
      const { status, message } = response;
      // Redicionar para lista principal
      navigate("/fornecedores");
      // Exibir mensagem de sucesso
      toast.success(message);
    } catch (error) {
      // Exibir mensagem de erro
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
    <Card title="Informações de Fornecedores">
      <form
        onSubmit={handleSubmit}
                className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
 
      >
    
        <div className="md:col-span-2">
          <Label htmlFor="nome_fantasia" required>
            Nome Fantasia
          </Label>

          <Input
            id="nome_fantasia"
            name="nome_fantasia"
            placeholder="Digite seu nome fantasia"
            required
            value={fornecedor.nome_fantasia}
            onChange={(e) =>
              setFornecedor({ ...fornecedor, nome_fantasia: e.target.value })
            }
          />
        </div>

        
        <div>
          <Label htmlFor="razao_social" required>
            Razão Social    
          </Label>

          <Input
            id="razao_social"
            name="razao_social"
            placeholder="Digite sua razão social"
            required
            value={fornecedor.razao_social}
            onChange={(e) =>
              setFornecedor({
                ...fornecedor,
                razao_social: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label htmlFor="CNPJ" required>
            CNPJ
          </Label>

          <Input
                type="text"
                id="cnpj"
                name="cnpj"
                placeholder="00.000.000/0000-00"
                mask="99.999.999/9999-99"
                value={fornecedor.cnpj}
                onChange={(e) => {
                  setFornecedor({
                    ...fornecedor,
                    cnpj: e.target.value,
                  });
                }}
              />
        </div>

        
        <div>
          <Label htmlFor="TELEFONE">
            Telefone
          </Label>

          <Input
                type="tel"
                id="telefone"
                name="telefone"
                placeholder="(00) 00000-0000"
                mask="(99) 99999-9999"
                value={fornecedor.telefone}
                onChange={(e) => {
                  setFornecedor({
                    ...fornecedor,
                    telefone: e.target.value,
                  });
                }}
              />
        </div>

        {/* E-mail */}
        <div>
          <Label htmlFor="EMAIL">
            E-mail
          </Label>

          <Input
            type="email"
            id="email"
            name="email"
            placeholder="seu@email.com"
            value={fornecedor.email}
            onChange={(e) =>
              setFornecedor({ ...fornecedor, email: e.target.value })
            }
          />
        </div>


        {/* Botões */}
        <div className="md:col-span-2 flex gap-2 pt-2">
          <Link to="/clientes">
            <Button
              type="button"
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

export default SuppliersForm;
