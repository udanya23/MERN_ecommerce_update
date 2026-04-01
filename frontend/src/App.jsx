import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navigation from "./pages/Navigation.jsx"
import ProtectedRoute from "./pages/ProtectedRoutes.jsx"
import RegisterSelection from "./pages/auth/RegisterSelection"
import LoginSelection from "./pages/auth/LoginSelection"
import SellerRegister from "./pages/Seller/SellerRegister"
import SellerLogin from "./pages/Seller/SellerLogin"
import SellerDashboard from "./pages/Seller/Sellerdashboard"
import AddProduct from "./pages/Seller/AddProduct"
import BuyerRegister from "./pages/Buyer/BuyerRegister"
import BuyerLogin from "./pages/Buyer/BuyerLogin"
import CartPage from "./pages/Buyer/CartPage.jsx"
import CheckoutPage from "./pages/Buyer/CheckoutPage"
import OrdersPage from "./pages/Buyer/OrdersPage"
import BuyerDashboard from "./pages/Buyer/BuyerDashboard"

import PaymentSuccess from "./pages/Buyer/PaymentSuccess"
import PaymentCancel from "./pages/Buyer/PaymentCancel"

import Home from "./pages/Home.jsx"

function App() {
  return (
    <BrowserRouter>
      <Navigation />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterSelection />} />
        <Route path="/login" element={<LoginSelection />} />
        <Route path="/seller/register" element={<SellerRegister />} />
        <Route path="/seller/login" element={<SellerLogin />} />

        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute roles={["seller"]}>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/add-product"
          element={
            <ProtectedRoute roles={["seller"]}>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route path="/buyer/register" element={<BuyerRegister />} />
        <Route path="/buyer/login" element={<BuyerLogin />} />

        <Route
          path="/buyer/cart"
          element={
            <ProtectedRoute roles={["buyer"]}>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/checkout"
          element={
            <ProtectedRoute roles={["buyer"]}>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/order"
          element={
            <ProtectedRoute roles={["buyer"]}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/dashboard"
          element={
            <ProtectedRoute roles={["buyer"]}>
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Stripe Redirect Pages */}
        <Route path="/payment-success" element={<PaymentSuccess/>}/>
        <Route path="/payment-cancel" element={<PaymentCancel/>}/>
      </Routes>

    </BrowserRouter>
  )
}

export default App