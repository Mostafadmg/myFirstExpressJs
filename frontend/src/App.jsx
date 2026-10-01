import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar.jsx";
import { Footer } from "./components/layout/Footer.jsx";
import { ProtectedRoute } from "./components/common/ProtectedRoute.jsx";

import { LoginPage } from "./pages/auth/LoginPage.jsx";
import { RegisterPage } from "./pages/auth/RegisterPage.jsx";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage.jsx";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage.jsx";

import { HomeFeedPage } from "./pages/listings/HomeFeedPage.jsx";
import { ListingDetailPage } from "./pages/listings/ListingDetailPage.jsx";
import { CreateListingPage } from "./pages/listings/CreateListingPage.jsx";
import { EditListingPage } from "./pages/listings/EditListingPage.jsx";

import { CartPage } from "./pages/cart/CartPage.jsx";
import { CheckoutPage } from "./pages/cart/CheckoutPage.jsx";

import { OrderHistoryPage } from "./pages/orders/OrderHistoryPage.jsx";
import { OrderDetailPage } from "./pages/orders/OrderDetailPage.jsx";

import { BookingCalendarPage } from "./pages/bookings/BookingCalendarPage.jsx";
import { MyBookingsPage } from "./pages/bookings/MyBookingsPage.jsx";

import { MyProfilePage } from "./pages/profile/MyProfilePage.jsx";
import { PublicProfilePage } from "./pages/profile/PublicProfilePage.jsx";

import { InboxPage } from "./pages/messages/InboxPage.jsx";
import { ConversationPage } from "./pages/messages/ConversationPage.jsx";

import { NotificationsPage } from "./pages/notifications/NotificationsPage.jsx";

import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage.jsx";
import { ManageUsersPage } from "./pages/admin/ManageUsersPage.jsx";
import { ManageListingsPage } from "./pages/admin/ManageListingsPage.jsx";

import { NotFoundPage } from "./pages/NotFoundPage.jsx";

// Every <Route> here is a page that will eventually be backed by one or
// more Express endpoints. Routes wrapped in <ProtectedRoute> require a
// logged-in user on the client; the matching Express route must enforce
// that same rule server-side too (see ProtectedRoute.jsx's comment).
function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<HomeFeedPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route path="/listings/new" element={<CreateListingPage />} />
          <Route path="/listings/:id" element={<ListingDetailPage />} />
          <Route path="/listings/:id/edit" element={<ProtectedRoute><EditListingPage /></ProtectedRoute>} />

          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />

          <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />

          <Route path="/bookings/new" element={<ProtectedRoute><BookingCalendarPage /></ProtectedRoute>} />
          <Route path="/bookings/mine" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />

          <Route path="/profile/:id" element={<ProtectedRoute><MyProfilePage /></ProtectedRoute>} />
          <Route path="/users/:id" element={<PublicProfilePage />} />

          <Route path="/messages" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
          <Route path="/messages/:id" element={<ProtectedRoute><ConversationPage /></ProtectedRoute>} />

          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><ManageUsersPage /></ProtectedRoute>} />
          <Route path="/admin/listings" element={<ProtectedRoute><ManageListingsPage /></ProtectedRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
