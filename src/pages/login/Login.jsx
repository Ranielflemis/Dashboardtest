import React, { useState } from "react";
import {
  BsEnvelope,
  BsLock,
  BsEye,
  BsEyeSlash,
  BsShieldLock,
  BsBoxArrowInRight,
} from "react-icons/bs";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    senha: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(credentials);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 px-4">
      {/* Efeitos de fundo */}
      <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

      {/* Card Login */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
            <BsShieldLock
              size={35}
              className="text-white"
            />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-white">
            Bem-vindo
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            Faça login para acessar o sistema
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              E-mail
            </label>

            <div className="relative">
              <BsEnvelope
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="seuemail@empresa.com"
                autoComplete="email"
                className="
                  w-full rounded-xl border border-white/10
                  bg-white/5 py-3 pl-11 pr-4
                  text-white placeholder:text-slate-400
                  outline-none transition-all
                  focus:border-indigo-500
                  focus:ring-2 focus:ring-indigo-500
                "
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Senha
            </label>

            <div className="relative">
              <BsLock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="senha"
                value={credentials.senha}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className="
                  w-full rounded-xl border border-white/10
                  bg-white/5 py-3 pl-11 pr-12
                  text-white placeholder:text-slate-400
                  outline-none transition-all
                  focus:border-indigo-500
                  focus:ring-2 focus:ring-indigo-500
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute right-4 top-1/2
                  -translate-y-1/2 text-slate-400
                  transition hover:text-white
                "
              >
                {showPassword ? (
                  <BsEyeSlash size={18} />
                ) : (
                  <BsEye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Opções */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-slate-300">
              <input
                type="checkbox"
                className="rounded border-slate-500 bg-slate-800"
              />
              Lembrar-me
            </label>

            <button
              type="button"
              className="font-medium text-indigo-400 transition hover:text-indigo-300"
            >
              Esqueci minha senha
            </button>
          </div>

          {/* Botão Login */}
          <button
            type="submit"
            className="
              flex h-12 w-full items-center justify-center gap-2
              rounded-xl bg-indigo-600
              font-semibold text-white
              transition-all duration-300
              hover:scale-[1.02]
              hover:bg-indigo-500
              hover:shadow-lg
              hover:shadow-indigo-600/40
              active:scale-[0.98]
            "
          >
            <BsBoxArrowInRight size={18} />
            Entrar
          </button>
        </form>

        {/* Rodapé */}
        <div className="mt-8 border-t border-white/10 pt-5 text-center">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Sistema Dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;