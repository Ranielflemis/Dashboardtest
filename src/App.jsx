import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header/Header";
import Sidebar from "./components/layout/Sidebar/Sidebar";
import ClientsList from "./pages/clients/ClientsList";
import ClientsForm from "./pages/clients/ClientsForm";
import SuppliersForm from "./pages/suppliers/SuppliersForm"
import SuppliersList from "./pages/suppliers/SuppliersList"
import ProductsList from "./pages/products/ProductsList";
import ProductsForm from "./pages/products/ProductsForm";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="flex flex-col w-full h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 bg-gray-100 dark:bg-gray-900">
          <Routes>
            <Route path="/" element={<h1>Página Inicial</h1>} />
            <Route path="/Clientes" element={<ClientsList />} />
            <Route path="/Clientes/novo" element={<ClientsForm />} />
        <Route path="/Clientes/edit/:id" element={<ClientsForm />} />

        <Route path="/Fornecedores" element={<SuppliersList />} />
        <Route path="/Fornecedores/novo" element={<SuppliersForm />} />
        <Route path="/Fornecedores/edit/:id" element={<SuppliersForm />} />

        <Route path="/produtos" element={<ProductsList />} />
            <Route path="/produtos/novo" element={<ProductsForm />} />
            <Route path="/produtos/edit/:id" element={<ProductsForm />} />
          </Routes>
          <ToastContainer/>
        </main>
      </div>
    </div>
  );
}

export default App;
