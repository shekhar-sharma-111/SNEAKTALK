"use client";
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';

function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const user: User = session?.user as User;
    return (
        <nav className="bg-gray-900 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center">
                <Link href="/" className="text-xl font-bold">
                    SneakTalk
                </Link>
            </div>
            <div className="flex items-center">
                {session ? (
                    <>
                        <span className='mr-4 text-lg hidden md:block'>
                            Welcome {user?.username || user?.email}
                        </span>
                        <Button 
                            className='bg-red-600 hover:bg-red-500 transition duration-300' 
                            onClick={() => signOut()}
                        >
                            Logout
                        </Button>
                    </>
                ) : (
                    <Link href='/sign-in'>
                        <Button className='bg-blend-darken hover:bg-blue-500 transition duration-300'>
                            Login
                        </Button>
                    </Link>
                )}
            </div>
            {session && (
                <div className="flex items-center">
                    {pathname === '/dashboard' ? (
                        <Link href='/'>Home</Link>
                    ) : (
                        <Link href='/dashboard'>Dashboard</Link>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;
