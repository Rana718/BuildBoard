// 'use client';

// import { useState } from 'react';
// import { useAuth } from '@/lib/auth';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { FolderOpen, Plus, Home, Menu, X } from 'lucide-react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';

// interface LayoutProps {
//   children: React.ReactNode;
// }

// export function Layout({ children }: LayoutProps) {
//   const { user } = useAuth();
//   const pathname = usePathname();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const isActive = (path: string) => {
//     return pathname === path || pathname.startsWith(path);
//   };

//   if (!user) {
//     return null;
//   }

//   const navigationItems = [
//     {
//       href: '/dashboard',
//       label: 'Dashboard',
//       icon: Home,
//       show: true
//     },
//     {
//       href: '/projects/create',
//       label: 'Create Project',
//       icon: Plus,
//       show: user.role === 'BUYER'
//     },
//     {
//       href: '/projects',
//       label: 'Projects',
//       icon: FolderOpen,
//       show: true
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       <nav className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
//           <div className="flex justify-between h-14 sm:h-16">
//             {/* Logo and Desktop Navigation */}
//             <div className="flex items-center">
//               <Link href="/dashboard" className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
//                 BuildBoard
//               </Link>
              
//               {/* Desktop Navigation */}
//               <div className="hidden md:ml-6 lg:ml-10 md:flex md:items-baseline md:space-x-1">
//                 {navigationItems.map((item) => {
//                   if (!item.show) return null;
//                   const Icon = item.icon;
//                   return (
//                     <Link
//                       key={item.href}
//                       href={item.href}
//                       className={`px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 flex items-center space-x-1.5 ${
//                         isActive(item.href) && !(item.href === '/projects' && isActive('/projects/create'))
//                           ? 'bg-primary/20 text-primary border border-primary/30' 
//                           : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
//                       }`}
//                     >
//                       <Icon className="h-3 w-3 lg:h-4 lg:w-4" />
//                       <span className="hidden lg:inline">{item.label}</span>
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Right side - Profile and Mobile Menu */}
//             <div className="flex items-center space-x-2 sm:space-x-3">
//               {/* Profile Avatar */}
//               <Link href={`/profile/${user.id}`}>
//                 <Avatar className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all duration-200 border-2 border-primary/20">
//                   <AvatarImage src={user.profileImageUrl} />
//                   <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs sm:text-sm">
//                     {user.name.split(' ').map((n:any) => n[0]).join('').toUpperCase()}
//                   </AvatarFallback>
//                 </Avatar>
//               </Link>
              
//               {/* Desktop Profile Info */}
//               <div className="hidden lg:block">
//                 <Link href={`/profile/${user.id}`} className="hover:text-primary transition-colors group">
//                   <div className="text-sm font-semibold group-hover:text-primary transition-colors truncate max-w-32">
//                     {user.name}
//                   </div>
//                   <div className="text-xs text-muted-foreground capitalize flex items-center space-x-1">
//                     <span>{user.role.toLowerCase()}</span>
//                     <div className={`w-2 h-2 rounded-full ${user.role === 'BUYER' ? 'bg-blue-400' : 'bg-green-400'}`}></div>
//                   </div>
//                 </Link>
//               </div>

//               {/* Mobile Menu Button */}
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="md:hidden p-1.5"
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               >
//                 {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//               </Button>
//             </div>
//           </div>

//           {/* Mobile Navigation Menu */}
//           {mobileMenuOpen && (
//             <div className="md:hidden border-t border-border/50 bg-card/80 backdrop-blur-sm">
//               <div className="px-2 pt-2 pb-3 space-y-1">
//                 {navigationItems.map((item) => {
//                   if (!item.show) return null;
//                   const Icon = item.icon;
//                   return (
//                     <Link
//                       key={item.href}
//                       href={item.href}
//                       onClick={() => setMobileMenuOpen(false)}
//                       className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
//                         isActive(item.href) && !(item.href === '/projects' && isActive('/projects/create'))
//                           ? 'bg-primary/20 text-primary border border-primary/30' 
//                           : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
//                       }`}
//                     >
//                       <Icon className="h-4 w-4" />
//                       <span>{item.label}</span>
//                     </Link>
//                   );
//                 })}
                
//                 {/* Mobile Profile Link */}
//                 <Link
//                   href={`/profile/${user.id}`}
//                   onClick={() => setMobileMenuOpen(false)}
//                   className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 border-t border-border/30 mt-2 pt-3"
//                 >
//                   <Avatar className="h-6 w-6">
//                     <AvatarImage src={user.profileImageUrl} />
//                     <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
//                       {user.name.split(' ').map((n:any) => n[0]).join('').toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <div className="font-semibold text-foreground">{user.name}</div>
//                     <div className="text-xs text-muted-foreground capitalize">
//                       {user.role.toLowerCase()}
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             </div>
//           )}
//         </div>
//       </nav>
      
//       <main className="max-w-7xl mx-auto py-3 sm:py-4 lg:py-6 px-2 sm:px-4 lg:px-6">
//         <div className="animate-fade-in">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// }
