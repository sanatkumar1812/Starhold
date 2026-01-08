import { useNavigate, Link } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { ProfileSettings } from "./ProfileSettings";
import { User, LogOut, Settings, LayoutDashboard, Sparkles } from "lucide-react";
import { useState } from "react";

export function UserNav() {
    const { user, profile, logout } = useAuth();
    const navigate = useNavigate();
    const [showSettings, setShowSettings] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const getInitials = () => {
        if (profile?.display_name) {
            return profile.display_name.slice(0, 2).toUpperCase();
        }
        if (user?.email) {
            return user.email.slice(0, 2).toUpperCase();
        }
        return "U";
    };

    if (!user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 flex items-center gap-2 px-2 hover:bg-white/10 rounded-full border border-white/10 transition-all">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || ""} alt={profile?.display_name || "User"} />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                            {getInitials()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-white/90 hidden sm:inline-block pr-1">
                        {profile?.display_name || user.email?.split("@")[0]}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-black/90 backdrop-blur-xl border-white/10 text-white" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {profile?.display_name || user.email?.split("@")[0]}
                        </p>
                        <p className="text-xs leading-none text-white/50">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer">
                        <Link to="/dashboard" className="flex items-center">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer">
                        <Link to="/dashboard?tab=settings" className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:bg-red-500/10 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
