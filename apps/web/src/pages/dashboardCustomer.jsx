import { Tab, TabPanel, Tabs, TabsBody, TabsHeader, Typography } from "@material-tailwind/react"
import { MyProfile } from "../components/dashboard/profileCustomer"
import { useState } from "react"
import { ManageAddress } from "../components/dashboard/address/manageAddress";

export function DashboardCustomer () {
    const [activeTab, setActiveTab] = useState("myProfile")

    const data = [
        {
            label: "My Profile",
            value: "myProfile",
            component: <MyProfile />
        },
        {
            label: "Address List",
            value: "manageAddress",
            component: <ManageAddress />
        },
    ]

    return (
        <div className="mt-2">
            <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
                <TabsHeader
                    className="rounded-none border-b border-blue-gray-50 bg-white"
                    indicatorProps={{ className:"bg-transparent border-b-2 border-green-900 shadow-none rounded-none",}}
                >
                    {data.map(({ label, value }) => (
                        <Tab
                            key={value}
                            label={value}
                            value={value}
                            onClick={() => setActiveTab(value)}
                            className={activeTab === value ? "text-green-600" : ""}
                        >
                            <Typography variant="h6" className="text-md">
                                {label}
                            </Typography>
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
        </div>
    )
}
