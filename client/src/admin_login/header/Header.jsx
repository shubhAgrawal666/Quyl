import React from 'react';

export default function Header(){
    return(
        <>
            <header className="sticky top-0 z-50">
            {/* glassy background, soft border and shadow */}
            <nav className="bg-white/75 backdrop-blur-sm border-b border-gray-100 shadow-md">
                <div className="max-w-screen-xl mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* left: logo */}
                    <Link to="/" className="flex items-center gap-5">
                    <div className="px-4 py-2 bg-white/60 backdrop-blur-md rounded-xl border border-white">
                    <img src={logo} alt="Logo" className="h-[45px] w-[100px] object-contain"/>
                    </div>
                    </Link>

                    {/* center (optional space) */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        <ul className="flex flex-col justify-center items-center mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                            <NavLink to="/"
                                className={({ isActive }) => ` text-lg block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                }>      
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/signup"
                            className={({ isActive }) => `text-lg block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                            }>
                            Explore Courses
                        </NavLink>
                        </li>
                    </ul>
                    </div>

                    {/* right: actions */}
                    <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium border border-orange-200 text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
                        aria-label="Log in"
                    >
                        Log in
                    </Link>

                    <Link
                        to="/signup"
                        className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-700 text-white shadow-md hover:scale-[1.02] transform transition focus:outline-none focus:ring-4 focus:ring-orange-200"
                        aria-label="Sign up"
                    >
                        Sign Up
                    </Link>
                    </div>
                </div>
                </div>
            </nav>
            </header>
        </>
    )
}