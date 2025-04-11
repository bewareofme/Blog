'use client'

import React, { useState } from 'react';
import Link from 'next/link'
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const BloggerHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="shadow-sm bg-secondary sticky top-0 z-50 py-6 opacity-100">
      <div className="mx-auto px-5 flex justify-between items-center">
        {/* Left section - Logo and Navigation */}
        <div className="flex items-center">
          {/* Blogger Logo */}
          <Link href="/" className="flex items-center text-orange-600 font-bold text-xl mr-8">
            <svg
              className="w-9 h-6 mr-2"
              viewBox="0 0 72 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 0v24h6v-7.5h6V24h6V0H9zm6 10.5H9V3h6v7.5zm15 0h-6V3h6v7.5zm-6 3h6V21h-6v-7.5zm-9 0v7.5H9V13.5h6zm21 0v7.5h-6V13.5h6z" fill="currentColor" />
            </svg>
            <span>Blogger</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-5">
              <li><Link href="/create" className="text-gray-600 hover:text-gray-900 text-md font-medium transition-colors">Create</Link></li>
              <li><Link href="/view" className="text-gray-600 hover:text-gray-900 text-md font-medium transition-colors">Browse</Link></li>
            </ul>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden ml-4 text-gray-600"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md py-3 px-5">
            <ul className="space-y-3">
              <li><Link href="/create" className="block text-gray-600 hover:text-gray-900">Create</Link></li>
              <li><Link href="/browse" className="block text-gray-600 hover:text-gray-900">Browse</Link></li>
              {session ? (
                <>
                  <li><button onClick={handleSignout} className="block text-gray-600 hover:text-gray-900">Sign Out</button></li>
                </>
              ) : (
                <li><Link href="/login" className="block text-gray-600 hover:text-gray-900">Sign In</Link></li>
              )}
            </ul>
          </div>
        )}

        {/* Right section - Auth buttons */}
        <div className="flex items-center justify-start space-x-4">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 focus:outline-none">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={session.user?.image || undefined} />
                    <AvatarFallback>
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{session.user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/viewAll/${session.user?.email}`}>My Posts</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleSignout}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-2">
              <Button asChild variant="outline">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default BloggerHeader;