import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function AuthenticatedLayout() {
    return (
        <div className="authenticated-layout">
            <Navbar />
            <main className="authenticated-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AuthenticatedLayout;
