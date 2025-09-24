import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider } from "../../../components/ui/sidebar";
import { lazy, useState, useEffect, Suspense } from "react";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import { Home, Users, Settings, Menu, Grid3X3, Shield, Globe, AppWindow, Bell, LetterText, LayoutTemplate, LayoutDashboard, ClockFading, SquarePen } from "lucide-react";
import { Button } from "../../../components/ui/button";
// import VisualSettings from "../components/VisualSettings";
// import TextSetting from "../components/TextSetting";
import Swal from "sweetalert2";
// import Dashboard from "../components/Dashboard";
import { mergeWithDefaults } from '../../../utils/utils';
// import { sideMenu } from "../../../src/constants/sideMenu";
// import TimezoneSettings from "../../../components/timezoneSettings";
// import CustomsSettings from "../../../components/customsSettings";

// const AuthApp = lazy(() => import('../../../auth-app/src/App'));
const AppProfile = lazy(() => import('../../../appprofile/src/App'));
const TenantApp = lazy(() => import('../../../tenantapp/src/App'));
const AppManager = lazy(() => import('../../../appmanager/src/App'));
const Analytics = lazy(() => import('../../../analyticsapp/src/App'));
const RoleManagement = lazy(() => import('../../../rolesmanagement/src/App'));
const Setting = lazy(() => import('../../../settingapp/src/App'))

interface AdminLayoutProps {
    activePage?: "Dashboard" | "Application Profiles" | "Applications Management" | "Role Management" |"Settings" | "Portal" | "App Manager" | "Tenant Manager" | "Visual Settings" | "Text Settings" | "Timezone Settings" | "Customs Settings" | "Analytics";
}

export function ContentLayout({ activePage = "Application Profiles" }: AdminLayoutProps) {
    const location = useLocation(); 
    const navigate = useNavigate(); 
    const [currentPage, setCurrentPage] = useState(activePage); 
    const [isCollapsed, setIsCollapsed] = useState(false); 
    const [width, setWidth] = useState(window.innerWidth); 
    // Initialize settingsDropdownOpen based on current URL at component mount
    const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(() => {
        return ["/admin/settings", "/admin/settings/visual", "/admin/settings/text", "/admin/settings/timezone", "/admin/settings/customs"].some(path =>
            location.pathname.startsWith(path)
        );
    });
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); 
    const [textSettings, setTextSettings] = useState<any>({}); 
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); 
    const [screenWidth, setScreenWidth] = useState(window.innerWidth); 

    useEffect(() => { 
        const handleResize = () => { 
            const currentWidth = window.innerWidth; 
            setScreenWidth(currentWidth); 
            setIsCollapsed(currentWidth >= 640 && currentWidth < 1024); 
        };
        handleResize(); 
        window.addEventListener('resize', handleResize); 
        return () => window.removeEventListener('resize', handleResize); 
    }, []); 

    const isMobile = screenWidth < 640; 
    const isTablet = screenWidth >= 640 && screenWidth < 1024; 
    const isDesktop = screenWidth >= 1024; 

    useEffect(() => { 
        const tabletWidths = [768, 800, 810, 820, 1280, 601]; 
        const isTabletSize = tabletWidths.includes(window.innerWidth); 

        if (isTabletSize) { 
            setIsCollapsed(true); 
        } else { 
            setIsCollapsed(true); 
        }
    }, [width]); 

    useEffect(() => { 
        const isTabletSize = width >= 600 && width <= 1280; 
        setIsCollapsed(isTabletSize); 
    }, [width]); 

    const handleToggleSidebar = () => { 
        if (isMobile) setIsMobileSidebarOpen((open) => !open); 
        else setIsCollapsed((collapsed) => !collapsed); 
    }; 

    // useEffect(() => { 
    //     const sideMenuTextSettings = localStorage.getItem("textsetting"); 
    //     if (sideMenuTextSettings) { 
    //         try { 
    //             const parsed = JSON.parse(sideMenuTextSettings); 
    //             if (parsed?.sideMenu) { 
    //                 const customTexts = mergeWithDefaults(sideMenu, parsed?.sideMenu || {}); 
    //                 setTextSettings(customTexts); 
    //             } else { 
    //                 setTextSettings(sideMenu); 
    //             }
    //         } catch (error) { 
    //             console.error("Error parsing text settings from localStorage:", error); 
    //             setTextSettings(sideMenu); 
    //         }
    //     } else { 
    //         setTextSettings(sideMenu); 
    //     }
    // }, []); 

    // This useEffect ensures the dropdown is open if navigating to a settings path
  
    useEffect(() => {
        const isAnySettingsPath = ["/admin/settings", "/admin/settings/visual", "/admin/settings/text", "/admin/settings/timezone", "/admin/settings/customs"].some(path =>
            location.pathname.startsWith(path)
        );
        if (isAnySettingsPath && !settingsDropdownOpen) {
            setSettingsDropdownOpen(true);
        }
    }, [location.pathname]); // Trigger when path changes


    const navItems = [
        { icon: Home, label: textSettings?.dashboard || "Dashboard", path: "/admin/dashboard" }, 
        { icon: Users, label: textSettings?.applicationProfiles || "Application Profiles", path: "/admin/appProfiles" }, 
        { icon: AppWindow, label: textSettings?.appManager || "App Manager", path: "/admin/appManager" }, 
        { icon: LayoutDashboard, label: "Analytics", path: "/admin/analytics" }, 
        // { icon: Shield, label: textSettings?.roles || "Roles", path: "/admin/roles" },
        { icon: Shield, label: "Role Management", path: "/admin/roleManagement" }, 
        { icon: Globe, label: textSettings?.tenantManager || "Tenant Manager", path: "/admin/tenants" }, 
        {
            icon: Settings, 
            label: textSettings?.settings || "Settings", 
            path: "/admin/settings/", 
            children: [ 
                {
                    icon: LayoutTemplate, 
                    label: textSettings?.visualSettings || "Visual Settings", 
                    path: "/admin/settings/visual", 
                },
                {
                    icon: LetterText, 
                    label: textSettings?.textSettings || "Text Settings", 
                    path: "/admin/settings/text", 
                },
                {
                    icon: ClockFading, 
                    label: textSettings.timezoneSettings || "Timezone Settings", 
                    path: "/admin/settings/timezone", 
                },
                {
                    icon: SquarePen, 
                    label: textSettings.customsSettings || "Customs Settings", 
                    path: "/admin/settings/customs", 
                }
            ]
        },
    ];

    useEffect(() => { 
        const handleTenantUnsavedChanges = (e: any) => { 
            setHasUnsavedChanges(e.detail); 
        };

        window.addEventListener("tenantUnsavedChanges", handleTenantUnsavedChanges); 
        return () => { 
            window.removeEventListener("tenantUnsavedChanges", handleTenantUnsavedChanges); 
        };
    }, []); 

    const handleNavChange = (path: string, key?: AdminLayoutProps["activePage"]) => { 
        if (!path) return; 
        if (hasUnsavedChanges) { 
            Swal.fire({ 
                titleText: 'You have unsaved changes! Are sure you want to switch without saving?', 
                icon: 'warning', 
                showCancelButton: true, 
                confirmButtonColor: "#d33", 
                cancelButtonColor: "#3085d6", 
                confirmButtonText: 'Yes', 
                cancelButtonText: 'No', 
            }).then((result) => { 
                if (result.isConfirmed) { 
                    navigate(path); 
                    if (key) setCurrentPage(key); 
                    else setCurrentPage(path as NonNullable<AdminLayoutProps["activePage"]>); 
                }
            });
        } else { 
            navigate(path); 
            if (key) setCurrentPage(key); 
            else setCurrentPage(path as NonNullable<AdminLayoutProps["activePage"]>); 
        }
    }; 

    const isSettingsActive = () => { 
        return ["/admin/settings", "/admin/settings/visual", "/admin/settings/text", "/admin/settings/timezone", "/admin/settings/customs"].some(path =>
            location.pathname.startsWith(path)
        );
    };

    const handleLogout = () => { 
        localStorage.removeItem('loginResponse'); 
        sessionStorage.removeItem('loginCheck'); 
        window.location.href = 'http:localhost:3002/admin/login'; 
    }; 

    const settingsRouteMap = { 
        "Visual Settings": "/admin/settings/visual", 
        "Text Settings": "/admin/settings/text", 
        "Timezone Settings": "/admin/settings/timezone", 
        "Customs Settings" : "/admin/settings/customs" 
    } as const; 

    type SettingsKey = keyof typeof settingsRouteMap; 

    return (
        <>
            <header className="sticky top-[64px] w-full border-b shadow-sm z-50 bg-gray-100">
                <div
                    className="flex items-center gap-4 px-4 h-10 sm:px-6 relative z-10"
                    style={{ backgroundColor: "var(--subHeaderBackColor)" }}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleToggleSidebar}
                        className="text-gray-600 hover:text-gray-900 rounded-full p-2 transition-colors duration-300"
                        style={{
                            // Using CSS variable for hover bg color with opacity
                            // fallback for non-hover background is transparent
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(200, 200, 200, 0.8)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                        <Menu
                            className={`transform transition-transform duration-300 ease-in-out ${(isMobile ? isMobileSidebarOpen : !isCollapsed) ? 'rotate-180' : ''
                                }`}
                        />
                        <span className="sr-only">Toggle sidebar</span>
                    </Button>

                    <div className="flex items-center gap-3" style={{ color: "var(--subHeaderForeColor)" }}>
                        <div className="text-md font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text">Title</div>
                    </div>

                    <div className="flex-1" />
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 cursor-pointer rounded-lg p-2 transition-colors">
                            <div className="border-r-2 border-gray-400 pr-4">
                                <Bell className="h-4 w-4" />
                            </div>
                            <div className="bg-gray-200 rounded-full p-2">
                                <Users className="h-4 w-4" />
                            </div>
                            <span
                                className="border-l-2 border-gray-400 pl-4 h-4 cursor-pointer"
                                style={{ color: "var(--subHeaderForeColor)" }}
                                onClick={handleLogout}
                            >
                                Logout
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex w-full max-w-none snap-none relative">
                {/* Overlay for mobile when sidebar is open */}
                {isMobile && isMobileSidebarOpen && (
                    <div
                        className="fixed inset-0 z-50 transition-opacity duration-300"
                        onClick={() => setIsMobileSidebarOpen(false)}
                    />
                )}

                {(!isMobile || (isMobile && isMobileSidebarOpen)) && (
                    <aside
                        className={`
          text-white z-[50] transition-all duration-300 ease-in-out shadow-lg
            ${isMobile
                                ? 'fixed top-[64px] left-0 h-[calc(100%-64px)]'
                                : 'relative h-auto'
                            }
    `}
                        style={{
                            width: isCollapsed ? '60px' : '256px',
                            maxWidth: isCollapsed ? '60px' : '256px',
                            minWidth: isCollapsed ? '60px' : '256px',
                            backgroundColor: '#111827',
                            transform: isMobile && !isMobileSidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
                            transition: 'transform 0.3s ease-in-out',
                        }}
                    >
                        <SidebarProvider>
                            <Sidebar className="h-full border-0">
                                <SidebarContent style={{ width: isCollapsed ? '60px' : '100%' }}>
                                    <SidebarMenu>
                                        {navItems.map((item) => {
                                            if (item.label === "Settings") {
                                                // The main 'Settings' button should be active if *any* settings sub-page is active,
                                                // or if the dropdown is manually opened.
                                                const isMainMenuActive = isSettingsActive(); 
                                                return (
                                                    <SidebarMenuItem key={item.label} className={`${isCollapsed ? 'px-0' : ''}`}>
                                                        <SidebarMenuButton
                                                            asChild
                                                            isActive={isMainMenuActive} // Use isMainMenuActive to highlight the parent
                                                            onClick={() => setSettingsDropdownOpen(!settingsDropdownOpen)} 
                                                        >
                                                            <div
                                                                className={`flex items-center justify-between cursor-pointer w-full transition-colors hover:bg-primary/5 rounded pl-4 py-1 ${isCollapsed ? '!px-[5px] justify-center' : ''
                                                                    }`}
                                                                style={{
                                                                    backgroundColor: isMainMenuActive ? 'var(--sideBarActiveBackColor)' : 'transparent', 
                                                                    color: isMainMenuActive ? 'var(--sideBarActiveForeColor)' : 'var(--sideBarForeColor)', 
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    if (!isMainMenuActive) {
                                                                        e.currentTarget.style.backgroundColor = 'var(--sideBarItemHoverBackColor)'; 
                                                                        e.currentTarget.style.color = 'var(--sideBarItemHoverForeColor)'; 
                                                                    }
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    if (!isMainMenuActive) {
                                                                        e.currentTarget.style.backgroundColor = 'transparent'; 
                                                                        e.currentTarget.style.color = 'var(--sideBarForeColor)'; 
                                                                    } else {
                                                                        e.currentTarget.style.backgroundColor = 'var(--sideBarActiveBackColor)'; 
                                                                        e.currentTarget.style.color = 'var(--sideBarActiveForeColor)'; 
                                                                    }
                                                                }}
                                                            >
                                                                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                                                                    <Settings className="h-4 w-4 shrink-0" />
                                                                    {!isCollapsed && <span>{item.label}</span>}
                                                                </div>
                                                                {!isCollapsed && (
                                                                    <svg
                                                                        className={`h-4 w-4 transition-transform duration-300 ease-in-out ${settingsDropdownOpen ? 'rotate-90' : ''
                                                                            }`}
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        </SidebarMenuButton>
                                                        {/* Render sub-menu if not collapsed AND (dropdown is open OR any settings page is active) */}
                                                        {!isCollapsed && (settingsDropdownOpen) && ( // Sub-menu visibility based purely on settingsDropdownOpen
                                                            <div className="ml-3 mt-1 space-y-1 text-sm transition-all">
                                                                {[{ icon: LayoutTemplate, label: 'Visual Settings', key: 'Visual Settings' },
                                                                { icon: LetterText, label: 'Text Settings', key: 'Text Settings' },
                                                                { icon: ClockFading, label: 'Timezone Settings', key: 'Timezone Settings'},
                                                                { icon: SquarePen, label: 'Customs Settings', key: 'Customs Settings'}    ]
                                                                    .map(({ label, key, icon: Icon }) => {
                                                                        // Determine if this specific sub-item is active based on URL
                                                                        const isSubItemActive = location.pathname.startsWith(settingsRouteMap[key as SettingsKey]);
                                                                        return (
                                                                            <div
                                                                                key={key}
                                                                                onClick={() => handleNavChange(settingsRouteMap[key as SettingsKey], key as AdminLayoutProps["activePage"])} 
                                                                                className={`cursor-pointer px-4 py-1 rounded hover:bg-primary/10 transition-colors ${isSubItemActive ? 'text-primary font-medium' : 'text-white'
                                                                                    }`}
                                                                                style={{
                                                                                    backgroundColor: isSubItemActive ? 'var(--sideBarSubItemActiveBackColor)' : 'transparent', 
                                                                                    color: isSubItemActive ? 'var(--sideBarSubItemActiveForeColor)' : 'var(--sideBarForeColor)', 
                                                                                }}
                                                                                onMouseEnter={(e) => {
                                                                                    if (!isSubItemActive) {
                                                                                        e.currentTarget.style.backgroundColor = 'var(--sideBarSubItemHoverBackColor)'; 
                                                                                        e.currentTarget.style.color = 'var(--sideBarSubItemHoverForeColor)'; 
                                                                                    }
                                                                                }}
                                                                                onMouseLeave={(e) => {
                                                                                    if (!isSubItemActive) {
                                                                                        e.currentTarget.style.backgroundColor = 'transparent'; 
                                                                                        e.currentTarget.style.color = 'var(--sideBarForeColor)'; 
                                                                                    } else {
                                                                                        e.currentTarget.style.backgroundColor = 'var(--sideBarSubItemActiveBackColor)'; 
                                                                                        e.currentTarget.style.color = 'var(--sideBarSubItemActiveForeColor)'; 
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <div className="flex items-center gap-2">
                                                                                    <Icon className="h-4 w-4 shrink-0" />
                                                                                    <span>{label}</span>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                            </div>
                                                        )}
                                                    </SidebarMenuItem>
                                                );
                                            }

                                            // Highlight active menu item for non-settings items
                                            const isActive = location.pathname.startsWith(item.path); //
                                            return (
                                                <SidebarMenuItem key={item.label} className={`${isCollapsed ? 'px-0' : ''}`}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        isActive={isActive}
                                                        onClick={() => handleNavChange(item.path, item.label as AdminLayoutProps["activePage"])}
                                                    >
                                                        <div
                                                            className={`flex items-center gap-3 cursor-pointer w-full transition-colors hover:bg-primary/5 rounded pl-4 py-1 ${isCollapsed ? '!px-[5px] justify-center' : ''}`}
                                                            style={{
                                                                backgroundColor: isActive ? 'var(--sideBarActiveBackColor)' : 'transparent',
                                                                color: isActive ? 'var(--sideBarActiveForeColor)' : 'var(--sideBarForeColor)',
                                                            }}
                                                            onMouseEnter={e => {
                                                                if (!isActive) {
                                                                    e.currentTarget.style.backgroundColor = 'var(--sideBarItemHoverBackColor)';
                                                                    e.currentTarget.style.color = 'var(--sideBarItemHoverForeColor)';
                                                                }
                                                            }}
                                                            onMouseLeave={e => {
                                                                if (!isActive) {
                                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                                    e.currentTarget.style.color = 'var(--sideBarForeColor)';
                                                                } else {
                                                                    e.currentTarget.style.backgroundColor = 'var(--sideBarActiveBackColor)';
                                                                    e.currentTarget.style.color = 'var(--sideBarActiveForeColor)';
                                                                }
                                                            }}
                                                        >
                                                            <item.icon className="h-4 w-4 shrink-0" />
                                                            {!isCollapsed && <span>{item.label}</span>}
                                                        </div>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            );
                                        })}
                                    </SidebarMenu>
                                </SidebarContent>
                            </Sidebar>
                        </SidebarProvider>
                    </aside>
                )}
                <div className="w-full" style={{ overflow: "scroll", height: "calc(100vh - 106px)" }}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            {/* <Route path="dashboard" element={<Dashboard />} /> */}
                            <Route path="appProfiles" element={<AppProfile />} />
                            {/* <Route path="roles" element={<AuthApp />} /> */}
                            <Route path="roleManagement/*" element={<RoleManagement />} />
                            <Route path="tenants" element={<TenantApp />} />
                            <Route path="appManager" element={<AppManager />} />
                            <Route path="analytics" element={<Analytics />} />
                            <Route path="settings" element={
                                <div>
                                    <h1 className="text-3xl font-bold mb-6">Settings</h1>
                                </div>
                            } />
                            {/* <Route path="settings/visual" element={<VisualSettings Id={10} />} /> */}
                            {/* <Route path="settings/text" element={<TextSetting Id={10} />} /> */}
                            {/* <Route path="settings/timezone" element={<TimezoneSettings />} /> */}
                            {/* <Route path="settings/customs" element={<CustomsSettings />} /> */}
                            {/* <Route path="appProfiles" element={<div>Not Found</div>} /> */}
                        </Routes>
                    </Suspense>
                </div>
            </main>
        </>
    );
}

export default ContentLayout;