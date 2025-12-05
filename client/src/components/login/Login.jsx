import React from 'react';
export default function Login() {
    return (
        <>
            <div className=" h-screen w-screen flex justify-center items-center bg-cover">
                <div className="rounded-2xl shadow-xl bg-white border border-gray-300 h-[380px] w-[420px] p-6">
                    <h1 className="text-3xl font-bold text-center mb-4 text-gray-800 tracking-wide">
                        Welcome Back
                    </h1>
                    <form className="font-sans tracking-wide space-y-4">



                        <div>
                            <label className="font-semibold text-gray-700">Enter Email</label>
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                className="mt-1 rounded-lg border border-gray-400 w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            />
                        </div>

                        <div>
                            <label className="font-semibold text-gray-700">Enter Password</label>
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                className="mt-1 rounded-lg border border-gray-400 w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-3 bg-blue-600 text-white p-2 rounded-lg font-semibold tracking-wider hover:bg-blue-700 transition-all shadow-md"
                        >
                            Login
                        </button>

                    </form>
                </div>
            </div>
        </>

    );
}