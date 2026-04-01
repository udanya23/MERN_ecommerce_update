import { useState, useEffect, createContext } from "react"
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        const storedToken = localStorage.getItem("token")
        console.log(storedUser, storedToken)
        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    function login(data) {
        setUser(data.user)
        localStorage.setItem("token", data.accessToken)
        localStorage.setItem("user", JSON.stringify(data.user))
    }

    function logout() {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}