import {useUser} from "@clerk/clerk-react"
import SideMenu from "../SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
    const { user : UserResource} = useUser();
    return (
        <div>
            {/* Navbar */}
            <Navbar activeMenu={activeMenu}/>
            {user && (
                <div className="flex">
                    <div className="max-[1080px]:hidden">
                        {/* SideMenu */}
                        <SideMenu activeMenu={activeMenu}/>
                    </div>
                    <div className="grow mx-5">{children}</div>
                </div>
            )}
        </div>
    )
}

export default DashboardLayout;