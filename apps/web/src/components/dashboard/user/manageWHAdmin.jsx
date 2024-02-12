import { Card, Typography } from "@material-tailwind/react";
import { AddWHAdminButton } from "./addWHAdminButton";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Axios } from "../../../lib/api";
import { PaginationButton } from "../../paginationButton";
import { FaArrowUpShortWide, FaArrowDownShortWide, FaArrowDownUpAcrossLine } from "react-icons/fa6";
import { Search } from "../search";
import { FilterByGender } from "./filterByGender";
import { AssignWHAdmin } from "./assignWHAdmin";
import { EditWHAdmin } from "./editWHAdmin";

export function ManageWHAdmin() {
    const adminToken = localStorage.getItem('adminToken');
    const [userList, setUserList] = useState([]);
    const [userUpdate, setUserUpdate] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const tableHead = ["Admin", "Warehouse", ""];

    const handleUserUpdate = () => {
        setUserUpdate(true)
    }

    const handleSort = (field) => {
        if (field === "" || field === " ") {
            return;
        }
        
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
        setCurrentPage(1);
    }

    const fetchUser = async (page) => {
        const config = {
            headers: { Authorization: `Bearer ${adminToken}` },
            params: { page: currentPage, sortBy, sortOrder, searchTerm, gender: genderFilter, role: roleFilter }
        }
        try {
            const response = await Axios.get("admins/warehouse-admin", config)
            setUserList(response.data.users)
            setTotalPages(response.data.totalPages);
            toast.success("Success getting users data!")
        } catch (error) {
            if (error.response.status == 400) {
                toast.error('Error Token')
            } else if (error.response.status == 401) {
                toast.error('Unauthorize (Super Admin only)!')
            } else {
                toast.error("Failed getting user data!")
            } 
        } finally {
            setUserUpdate(false)
        }
    }

    useEffect(() => {
        fetchUser(currentPage)
    }, [userUpdate, currentPage, sortBy, sortOrder, searchTerm, genderFilter, roleFilter]);

    return (
        <div className="h-screen flex flex-col gap-1">
            <Card className="h-full py-4 px-4 flex flex-col gap-4">
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />
                <div className="w-full flex flex-col items-center justify-center gap-2 md:flex-row">
                    <FilterByGender setGenderFilter={setGenderFilter} setCurrentPage={setCurrentPage} />
                    <AddWHAdminButton />
                </div>
                <Card className="h-fit w-full overflow-scroll">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {tableHead.map((head) => (
                                <th
                                    key={head}
                                    className="cursor-pointer border-b border-2 border-green-600 bg-green-800"
                                    onClick={() => handleSort(head.toLowerCase())}
                                >
                                    <div className="flex items-center justify-between p-4">
                                        <Typography
                                            variant="lead"
                                            color="white"
                                            className="font-bold text-sm leading-none"
                                        >
                                            {head}
                                        </Typography>
                                        {sortBy === head.toLowerCase() && (
                                            <span>
                                                {
                                                    sortOrder === null ? <FaArrowDownUpAcrossLine color="white" /> : 
                                                    sortOrder === 'asc' ? <FaArrowUpShortWide color="white" /> : <FaArrowDownShortWide color="white" />
                                                }
                                            </span>
                                        )}
                                    </div>
                                </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {userList.map((user) => {
                                const classes = "p-4 border-b border-green-600";
                                console.log(user.WarehouseAdmins[0]?.Warehouse.label);
                                return (
                                    <tr key={user.id}>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {user.fullname}
                                            </Typography>
                                        </td>
                                        <td className={`${classes} bg-green-50/50`}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {
                                                    user.isAssigned ? 
                                                    user.WarehouseAdmins[0]?.Warehouse.label :
                                                    "Not Assigned Yet"
                                                }
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex justify-center">
                                                {
                                                    user.isAssigned ?
                                                    <EditWHAdmin user={user} handleUserUpdate={handleUserUpdate} /> :
                                                    <AssignWHAdmin user={user} handleUserUpdate={handleUserUpdate} />
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Card>
                <div className="flex items-center justify-center">
                    <PaginationButton currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
                </div>
            </Card>
        </div>
    )
}