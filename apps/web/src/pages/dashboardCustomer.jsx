import { Tab, TabPanel, Tabs, TabsBody, TabsHeader } from "@material-tailwind/react"
import { ManageAddress } from "../components/manageAddress"
import { MyProfile } from "../components/dashboard/profileCustomer"
import { useState } from "react"

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
        <div className="mt-5">
            <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
                <TabsHeader
                    className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
                    indicatorProps={{ className:"bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",}}
                >
                    {data.map(({ label, value }) => (
                        <Tab
                            key={value}
                            label={value}
                            value={value}
                            // onClick={() => setActiveTab(value)}
                            className={activeTab === value ? "text-gray-900" : ""}
                        >
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
        </div>
    )
}
