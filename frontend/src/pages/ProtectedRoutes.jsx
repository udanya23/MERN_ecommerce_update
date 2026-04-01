import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

export default function ProtectedRoute({ children, roles }) {

    const { user, loading } = useContext(AuthContext)

    // wait until auth is restored
    if (loading) {
        return <h3>Loading...</h3>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />
    }

    return children
}

export const Unauthorized = () => {
    return <h2 className="text-center mt-5">You are Unauthorized</h2>
}