import SideMenu from "./SideMenu";

const Navbar = ({activeMenu}) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    return (
        <div className="flex items-center justify-between gap-5 bg-while border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-4 sm:px-7 sticky top-0 z-30">
            {/* L- menuBt and title */}
            <div className="flex items-center gap-5">
                <button 
                    onClick={() => setOpenSideMenu(!openSideMenu)} 
                    className="block lg:hidden text-black hover:bg-gray-100 p-1 rounder transition-colors">
                    {openSideMenu ? (
                        <X className="text-2xl" />
                    ): (
                        <Menu className="text-2xl" />
                    )}
                </button>

                <div className="flex items-center gap-2">
                    <Share2 className="text=blue-600" />
                    <span className="text-lg font-medium text-black truncate">
                        Cloud Share
                    </span>
                </div>
            </div>

            {/* R- credits and userBt  */}
            <Signed>
                <div className="flex items-center gap-4">
                    <link to="/subscriptions">
                        <CreditsDisplay credits={5} />
                    </link>
                    <div className="relative">
                        <UserButton />
                    </div>
                </div>
            </Signed>

            {/* Mobile Side Menu */}
            {openSideMenu && (
                <div className="fixed top-[73px] left-0 right-0 bg-white border-b border-gap-200 lg:hidden z-20">
                    {/* side menu bar */}
                    <SideMenu activeMenu={activeMenu}/>
                </div>

            )}

        </div>
    )
}

export default Navbar;