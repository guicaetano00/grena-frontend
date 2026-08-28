import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { CarrinhoProvider } from "./context/CarrinhoContext";

import ProtectedRoute from "./components/Rotas/ProtectedRoute";

import PLogin from "./pages/PLogin/PLogin";
import PLoja from "./pages/PLoja/PLoja";
import PCarrinho from "./pages/PCarrinho/PCarrinho";
import PAdmin from "./pages/PAdmin/PAdmin";
import PPagamento from "./pages/PPagamento/PPagamento";

function App() {
  return (
    <CarrinhoProvider>
      <BrowserRouter>
        <Routes>

          {/* Loja pública */}
          <Route
            path="/"
            element={<Navigate to="/loja" replace />}
          />

          <Route
            path="/loja"
            element={<PLoja />}
          />

          <Route
            path="/login"
            element={<PLogin />}
          />

          {/* Carrinho exige login */}
          <Route
            path="/carrinho"
            element={
              <ProtectedRoute
                element={<PCarrinho />}
              />
            }
          />

          {/* Pagamento também exige login */}
          <Route
            path="/pagamento"
            element={
              <ProtectedRoute
                element={<PPagamento />}
              />
            }
          />

          {/* Painel administrativo exige admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                element={<PAdmin />}
                allowedRoles={["admin"]}
              />
            }
          />

          {/* Qualquer rota inválida volta para a loja */}
          <Route
            path="*"
            element={<Navigate to="/loja" replace />}
          />

        </Routes>
      </BrowserRouter>
    </CarrinhoProvider>
  );
}

export default App;