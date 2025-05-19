import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useStateContext } from "../context"; // Adjust the import path

import { CustomButton } from ".";
import { menu, search } from "../assets";
import { navlinks } from "../constants";
import { IconHeartHandshake } from "@tabler/icons-react";

const Navbar = () => {
const navigate = useNavigate();
const [isActive, setIsActive] = useState("dashboard");
const [toggleDrawer, setToggleDrawer] = useState(false);
const { ready, authenticated, login, user, logout } = usePrivy();
const { fetchUsers, users, fetchUserRecords } = useStateContext();

const fetchUserInfo = useCallback(async () => {
    if (!user) return;

    try {
    await fetchUsers();
    const existingUser = users.find(
        (u) => u.createdBy === user.email.address,
    );
    if (existingUser) {
        await fetchUserRecords(user.email.address);
        }
    } catch (error) {
        console.error("Error fetching user info:", error);
    }
}, [user, fetchUsers, users, fetchUserRecords]);

useEffect(() => {
    if (authenticated && user) {
        fetchUserInfo();
    }
}, [authenticated, user, fetchUserInfo]);

const handleLoginLogout = useCallback(() => {
    if (authenticated) {
        logout();
    } else {
        login().then(() => {
        if (user) {
            fetchUserInfo();
            }
        });
    }
}, [authenticated, login, logout, user, fetchUserInfo]);

return (
    <div className="mb-[35px] flex flex-col-reverse justify-between gap-6 md:flex-row">
    <div className="flex h-[52px] max-w-[458px] flex-row rounded-[100px] bg-[#1c1c24] py-2 pl-4 pr-2 lg:flex-1">
        <input
            type="text"
            placeholder="Search for records"
            className="flex w-full bg-transparent font-epilogue text-[14px] font-normal text-white outline-none placeholder:text-[#4b5264]"
        />
        <div className="flex h-full w-[72px] cursor-pointer items-center justify-center rounded-[20px] bg-[#4acd8d]">
            <img
            src={search}
            alt="search"
            className="h-[15px] w-[15px] object-contain"
        />
        </div>
    </div>

    <div className="hidden flex-row justify-end gap-2 sm:flex">
        <CustomButton
            btnType="button"
            title={authenticated ? "Log Out" : "Log In"}
            styles={authenticated ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
            handleClick={handleLoginLogout}
        />
        </div>
    </div>
    );
};

export default Navbar;