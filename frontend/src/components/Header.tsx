import { Link } from "react-router-dom"

function Header () {
    return (
        <>
            <div className="flex flex-row w-screen h-15 sticky bg-black justify-center mx-auto">
                <div className="flex flex-row justify-between gap-4 my-auto">
                <Link to="/" className="text-white hover:text-blue-300 hover:font-semibold">Home</Link>
                <Link to="/fav" className="text-white hover:text-blue-300 hover:font-semibold">Favourite</Link>
                <Link to="/about" className="text-white hover:text-blue-300 hover:font-semibold">About</Link>
                <Link to="/login" className="text-white hover:text-blue-300 hover:font-semibold">Login</Link>
                </div>
            </div>
        </>
    )

}

export default Header