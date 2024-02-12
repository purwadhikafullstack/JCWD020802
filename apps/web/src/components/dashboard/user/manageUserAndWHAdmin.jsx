import { FaBox, FaUsers } from "react-icons/fa";
import { ManageUser } from "./manageUser";
import { Card, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Typography } from "@material-tailwind/react";
import { ManageWHAdmin } from "./manageWHAdmin";

export function ManageUserAndWHAdmin() {
    const data = [
        {
            label: "Manage User",
            value: "user",
            component: <ManageUser />
        },
        {
            label: "Assign Warehouse Admin",
            value: "admin",
            component: <ManageWHAdmin />
        }
    ]
    return (
        <div className="h-screen flex flex-col gap-1">
            <div className="flex w-full items-center gap-3 pt-2 pl-2">
                <FaUsers fontSize={'30px'} />
                <Typography variant="h3" color="blue-gray">Manage Users</Typography>
            </div>
            <Card className="h-screen">
                <Tabs value="user">
                    <TabsHeader
                        className="rounded-none border-b border-blue-gray-50 bg-transparent p-2"
                        indicatorProps={{
                            className:
                                "bg-transparent border-b-4 border-green-600 shadow-none rounded-none",
                        }}
                    >
                        {data.map(({ label, value }) => (
                            <Tab key={value} value={value}>
                                {label}
                            </Tab>
                        ))}
                    </TabsHeader>
                    <TabsBody>
                        {data.map(({ value, component }) => (
                            <TabPanel key={value} value={value}>
                                {component}
                            </TabPanel>
                        ))}
                    </TabsBody>
                </Tabs>
            </Card>
        </div>
    )
}