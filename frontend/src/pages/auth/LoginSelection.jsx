import { Link } from "react-router-dom"

const LoginSelection = () => {
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-5 text-center" style={{ width: "400px" }}>
                <h3 className="mb-4">Login As</h3>
                <Link
                    to="/seller/login"
                    className="btn btn-primary mb-3"
                >
                    Seller
                </Link>
                <Link
                    to="/buyer/login"
                    className="btn btn-success"
                >
                    Buyer
                </Link>
            </div>
        </div>
    )
}
export default LoginSelection