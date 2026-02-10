import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/app/layout/Layout'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { UsersPage } from '@/features/users/pages/UsersPage'
import { DentistsPage } from '@/features/dentists/pages/DentistsPage'
import { ProductsPage } from '@/features/products/pages/ProductsPage'
import { InsurancesPage } from '@/features/insurances/pages/InsurancesPage'

export function AppRoutes() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/dentists" element={<DentistsPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/insurances" element={<InsurancesPage />} />
                {/* <Route path="/inquiries" element={<div>Inquiries Page</div>} /> */}
            </Route>
        </Routes>
    )
}
