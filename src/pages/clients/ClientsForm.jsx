
import React from "react";
import Card from "../../components/layout/Card/Card";
import { Link, useNavigate, useParams } from "react-router-dom";
import Input from "../../components/ui/Input";
import Label from "../../components/ui/Label";
import Button from "../../components/ui/Button";
import clientesService from "../../services/clientesService";
import { toast } from 'react-toastify';
import Loading from "../../components/ui/Loading";

const ClientsForm = () => {
 
  const navigate = useNavigate();
   const { id } = useParams();
const [loading, setLoading] = React.useState(true);
  const [cliente, setCliente] = React.useState({
    id_cliente: "",
    nome: "",
    cpf: "",
    data_nascimento: "",
    whatsapp: "",
    email: "",
    endereco: {
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    },
  });

React.useEffect(() => {
    // Verifica se é Novo ou Edit
    if (!id) {
      setLoading(false);
      return;
    }
        // Função para carregar registros da tabela
        const carregarForm = async () => {
            const dados = await clientesService.getById(id);
            setCliente({
                id_cliente: dados.data[0]["id_cliente"],
                nome: dados.data[0]["nome"],
                cpf: dados.data[0]["cpf"],
                data_nascimento: dados.data[0]["data_nascimento"],
                whatsapp: dados.data[0]["whatsapp"],
                email: dados.data[0]["email"],
                endereco: {
                    logradouro: dados.data[0]["endereco"]["logradouro"] ?? "",
                    numero: dados.data[0]["endereco"]["numero"] ?? "",
                    complemento: dados.data[0]["endereco"]["complemento"] ?? "",
                    bairro: dados.data[0]["endereco"]["bairro"] ?? "",
                    cidade: dados.data[0]["endereco"]["cidade"] ?? "",
                    estado: dados.data[0]["endereco"]["estado"] ?? "",
                    cep: dados.data[0]["endereco"]["cep"] ?? "",
                },
            });
      // console.log("Cliente => ", dados.data[0]);
      setLoading(false);
    };
        // Executar função carregarForm()
        carregarForm();
    }, []);
  
   const handleSubmit = async (e) => {
    // Desativar função de mudar de página ao clicar no Salvar
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      // Se tiver variável ID, significa UPDATE
      if (id) {
        // UPDATE - PUT
        response = await clientesService.update(id, cliente);
      } else {
        // CREATE - POST
        response = await clientesService.create(cliente);
      }

      // Recuperar resposta da API
      const { status, message } = response;
      // Redicionar para lista principal
      navigate("/clientes");
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
    <Card title="Informações de Clientes">
      <form
        onSubmit={handleSubmit}
                className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
 
      >
        {/* Nome */}
        <div className="md:col-span-2">
          <Label htmlFor="NOME" required>
            Nome
          </Label>

          <Input
            id="NOME"
            name="NOME"
            placeholder="Digite seu nome completo"
            required
            value={cliente.NOME}
            onChange={(e) =>
              setCliente({ ...cliente, NOME: e.target.value })
            }
          />
        </div>

        {/* Data de nascimento */}
        <div>
          <Label htmlFor="DATA_NASCIMENTO">
            Data de Nascimento
          </Label>

          <Input
            type="date"
            id="DATA_NASCIMENTO"
            name="DATA_NASCIMENTO"
            value={cliente.DATA_NASCIMENTO}
            onChange={(e) =>
              setCliente({
                ...cliente,
                DATA_NASCIMENTO: e.target.value,
              })
            }
          />
        </div>

        {/* CPF */}
        <div>
          <Label htmlFor="CPF">
            CPF
          </Label>

          <Input
                type="text"
                id="cpf"
                name="cpf"
                placeholder="000.000.000-00"
                mask="999.999.999-99"
                value={cliente.CPF}
                onChange={(e) => {
                  setCliente({
                    ...cliente,
                    CPF: e.target.value,
                  });
                }}
              />
        </div>

        {/* WhatsApp */}
        <div>
          <Label htmlFor="WHATSAPP">
            WhatsApp
          </Label>

          <Input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                placeholder="(00) 00000-0000"
                mask="(99) 99999-9999"
                value={cliente.WHATSAPP}
                onChange={(e) => {
                  setCliente({
                    ...cliente,
                    WHATSAPP: e.target.value,
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
            id="EMAIL"
            name="EMAIL"
            placeholder="seu@email.com"
            value={cliente.EMAIL}
            onChange={(e) =>
              setCliente({ ...cliente, EMAIL: e.target.value })
            }
          />
        </div>

        {/* Logradouro */}
       <div className="md:col-span-2">
                    <Label htmlFor="logradouro">Logradouro</Label>

                    <Input
                        type="text"
                        id="logradouro"
                        name="logradouro"
                        placeholder="Rua, Avenida, etc."
                        value={cliente.endereco.logradouro}
                        onChange={(e) => {
                            setCliente({
                                ...cliente,
                                ENDERECO: {
                                    ...cliente.ENDERECO,
                                    LOGRADOURO: e.target.value
                                }
                            })
                        }}
                    />
                </div>

        {/* Número */}
        <div>
          <Label htmlFor="NUMERO">
            Número
          </Label>

          <Input
            type="text"
            id="NUMERO"
            name="NUMERO"
            placeholder="Número"
            value={cliente.endereco.numero}
                        onChange={(e) => {
                            setCliente({
                                ...cliente,
                                ENDERECO: {
                                    ...cliente.ENDERECO,
                                    NUMERO: e.target.value
                                }
                            })
                        }}
          />
        </div>

        {/* Complemento */}
        <div>
          <Label htmlFor="COMPLEMENTO">
            Complemento
          </Label>

          <Input
            type="text"
            id="COMPLEMENTO"
            name="COMPLEMENTO"
            placeholder="Apto, bloco, casa, etc."
            value={cliente.endereco.complemento}
                        onChange={(e) => {
                            setCliente({
                                ...cliente,
                                ENDERECO: {
                                    ...cliente.ENDERECO,
                                    COMPLEMENTO: e.target.value
                                }
                            })
                        }}
          />
        </div>

        {/* Bairro */}
        <div>
          <Label htmlFor="BAIRRO">
            Bairro
          </Label>

          <Input
            type="text"
            id="BAIRRO"
            name="BAIRRO"
            placeholder="Digite seu bairro"
            value={cliente.endereco.bairro}
                        onChange={(e) => {
                            setCliente({
                                ...cliente,
                                ENDERECO: {
                                    ...cliente.ENDERECO,
                                    BAIRRO: e.target.value
                                }
                            })
                        }}
          />
        </div>

        {/* Cidade */}
        <div>
          <Label htmlFor="CIDADE">
            Cidade
          </Label>

          <Input
            type="text"
            id="CIDADE"
            name="CIDADE"
            placeholder="Digite sua cidade"
            value={cliente.endereco.cidade}
                        onChange={(e) => {
                            setCliente({
                                ...cliente,
                                ENDERECO: {
                                    ...cliente.ENDERECO,
                                    CIDADE: e.target.value
                                }
                            })
                        }}
          />
        </div>

        {/* Estado */}
        <div>
          <Label htmlFor="ESTADO">
            Estado
          </Label>

          <Input
                type="text"
                id="estado"
                name="estado"
                placeholder="Digite seu estado"
                maxLength={2}
                value={cliente.endereco.estado}
                onChange={(e) => {
                  setCliente({
                    ...cliente,
                    endereco: {
                      ...cliente.endereco,
                      ESTADO: e.target.value,
                    },
                  });
                }}
              />
        </div>

        {/* CEP */}
        <div>
          <Label htmlFor="CEP">
            CEP
          </Label>

          <Input
            type="text"
            id="CEP"
            name="CEP"
            placeholder="00000-000"
            value={cliente.endereco.cep}
                        onChange={(e) => {
                            setCliente({
                                ...cliente,
                                endereco: {
                                    ...cliente.endereco,
                                    cep: e.target.value
                                }
                            })
                        }}
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

export default ClientsForm;
