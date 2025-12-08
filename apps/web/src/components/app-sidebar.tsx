import {
    Calendar,
    Home,
    Settings,
    Video,
    Trophy,
    LogOut,
    User,
    Activity
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "@tanstack/react-router"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Classes",
        url: "/meetings",
        icon: Calendar,
    },
    {
        title: "Recordings",
        url: "/recordings",
        icon: Video,
    },
    {
        title: "Performance",
        url: "/performance", // Placeholder
        icon: Activity,
    },
    {
        title: "Tournaments",
        url: "/tournaments", // Placeholder
        icon: Trophy,
    },
]

const menuButtonClass =
    "group relative min-h-[3rem] w-full overflow-hidden rounded-xl border border-sidebar-border/70 bg-white/0 px-2.5 transition-all duration-200 hover:border-sidebar-border/40 hover:bg-white/5 data-[active=true]:border-indigo-400/50 data-[active=true]:bg-gradient-to-r data-[active=true]:from-indigo-500/20 data-[active=true]:via-indigo-500/10 data-[active=true]:to-transparent data-[active=true]:shadow-[0_12px_36px_-22px_rgba(79,70,229,0.8)] before:absolute before:left-0 before:top-1/2 before:h-8 before:w-[3px] before:-translate-y-1/2 before:rounded-full before:content-[''] before:bg-gradient-to-b before:from-indigo-400 before:to-cyan-400 before:opacity-0 before:transition-opacity before:duration-200 data-[active=true]:before:opacity-100 group-hover:before:opacity-100"

const iconWrapperClass =
    "flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 shadow-[0_8px_22px_-18px_rgba(99,102,241,0.7)] group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9"

export function AppSidebar() {
    const { data: session } = authClient.useSession()
    const location = useLocation()

    return (
        <Sidebar collapsible="offcanvas" variant="inset"  >
            <SidebarHeader className="h-16 flex items-center justify-center border-b border-sidebar-border/50 px-4">
                <div className="flex items-center justify-center w-full">
                    <span className="group-data-[collapsible=icon]:hidden font-bold text-2xl text-sidebar-primary tracking-tight">
                        Tuto
                    </span>
                </div>
            </SidebarHeader>
            <SidebarContent className="space-y-6 px-3 py-5">
                <SidebarGroup className="space-y-3">
                    <SidebarGroupLabel className="px-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-sidebar-foreground/60">
                        Platform
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-2">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={location.pathname === item.url}
                                        tooltip={item.title}
                                        className={menuButtonClass}
                                    >
                                        <Link to={item.url} className="flex w-full items-center gap-3">
                                            <span className={iconWrapperClass}>
                                                <item.icon className="size-5" />
                                            </span>
                                            <span className="text-[0.95rem] font-medium text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                                                {item.title}
                                            </span>
                                            <span className="ml-auto text-xs text-white/60 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-data-[collapsible=icon]:hidden">
                                                &gt;
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator className="mx-3 opacity-70" />

                <SidebarGroup className="space-y-3">
                    <SidebarGroupLabel className="px-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-sidebar-foreground/60">
                        Settings
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-2">
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Settings"
                                    isActive={location.pathname === "/settings"}
                                    className={menuButtonClass}
                                >
                                    <Link to="/settings" className="flex w-full items-center gap-3">
                                        <span className={iconWrapperClass}>
                                            <Settings className="size-5" />
                                        </span>
                                        <span className="text-[0.95rem] font-medium text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                                            Settings
                                        </span>
                                        <span className="ml-auto text-xs text-white/60 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-data-[collapsible=icon]:hidden">
                                            &gt;
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-white/5 px-3 pb-5 pt-4">
                {session ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-left transition-all duration-200 hover:border-white/15 hover:bg-white/10 data-[state=open]:border-indigo-400/50"
                            >
                                <Avatar className="h-9 w-9 rounded-lg border-2 border-sidebar-border">
                                    <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                                    <AvatarFallback className="rounded-lg bg-sidebar-accent text-sidebar-accent-foreground font-semibold">
                                        {session.user.name?.slice(0, 2).toUpperCase() || 'CN'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{session.user.name}</span>
                                    <span className="truncate text-xs text-sidebar-foreground/70">{session.user.email}</span>
                                </div>
                                <User className="ml-auto size-4 opacity-60" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            side="bottom"
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuItem onClick={() => authClient.signOut()} className="cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button variant="outline" className="w-full justify-start gap-2 rounded-xl border-white/30 bg-white/5 text-sidebar-foreground hover:border-white/50 hover:bg-white/10" asChild>
                        <Link to="/login">
                            <User className="h-4 w-4" />
                            <span className="group-data-[collapsible=icon]:hidden">Sign In</span>
                        </Link>
                    </Button>
                )}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
