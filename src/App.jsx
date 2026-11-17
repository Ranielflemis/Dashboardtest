import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header/Header";
import Sidebar from "./components/layout/Sidebar/Sidebar";
import ClientsList from "./pages/clients/ClientsList";
import ClientsForm from "./pages/clients/ClientsForm";
import SuppliersForm from "./pages/suppliers/SuppliersForm"
import SuppliersList from "./pages/suppliers/SuppliersList"
import ProductsList from "./pages/products/ProductsList";
import ProductsForm from "./pages/products/ProductsForm";
import SalesList from "./pages/vendas/SalesList";
import SalesForm from "./pages/vendas/SalesForm";
import PurchasesList from "./pages/compras/PurchasesForm";
import PurchasesForm from "./pages/compras/PurchasesList";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import MainLayout from "./pages//MainLayout";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Routes>
        {/* Rotas para Login */}
        <Route path="/login" element={<Login />} />
        <Route element={<MainLayout />}>
          {/* Rota para Dashboard */}
          <Route path="/" element={<Dashboard />} />
          {/* Rotas para Clientes */}
          <Route path="/clientes" element={<ClientsList />} />
          <Route path="/clientes/novo" element={<ClientsForm />} />
          <Route path="/clientes/edit/:id" element={<ClientsForm />} />
          {/* Rotas para Fornecedores */}
          <Route path="/fornecedores" element={<SuppliersList />} />
          <Route path="/fornecedores/novo" element={<SuppliersForm />} />
          <Route path="/fornecedores/edit/:id" element={<SuppliersForm />} />
          {/* Rotas para Produtos */}
          <Route path="/produtos" element={<ProductsList />} />
          <Route path="/produtos/novo" element={<ProductsForm />} />
          <Route path="/produtos/edit/:id" element={<ProductsForm />} />
          {/* Rotas para Vendas */}
          <Route path="/vendas" element={<SalesList />} />
          <Route path="/vendas/novo" element={<SalesForm />} />
          <Route path="/vendas/edit/:id" element={<SalesForm />} />
          {/* Rotas para Compras */}
          <Route path="/compras" element={<PurchasesList />} />
          <Route path="/compras/novo" element={<PurchasesForm />} />
          <Route path="/compras/edit/:id" element={<PurchasesForm />} />
        </Route>
      </Routes>
      {/*    */}
    </>
  );
}

export default App;
