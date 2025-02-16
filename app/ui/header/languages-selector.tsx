'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { setCookie } from 'cookies-next';
import Link from 'next/link';

export default function LanguagesSelector(locale: { local: string }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // remove language, it's assuming the lang is always in the URL from the middleware
  const baseUrl = pathname.slice(3);

  const getLanguageName = (locale: string) => {
    switch (locale) {
      case 'fr':
        return 'Français';
      default:
        return 'English';
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleClickLanguage = (lang: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    setCookie('preferredLanguage', lang);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !dropdownRef.current?.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  return (
    <div className='relative inline-block' ref={dropdownRef}>
      <button
        id='header-language'
        onClick={toggleDropdown}
        aria-expanded={isDropdownOpen}
        aria-controls='language-dropdown'
        className='mx-auto mr-5 flex min-h-8 min-w-30 flex-row items-center justify-center rounded-lg border-1 border-white bg-black text-white'
      >
        {getLanguageName(locale.local)}
        <svg
          className='-mr-1 size-5 text-gray-400'
          viewBox='0 0 20 20'
          fill='currentColor'
          aria-hidden='true'
          data-slot='icon'
        >
          <path
            fillRule='evenodd'
            d='M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z'
            clipRule='evenodd'
          />
        </svg>
      </button>

      <div
        className={`absolute z-10 mt-1 min-w-[120px] rounded-lg bg-neutral-900/90 ${isDropdownOpen ? '' : 'hidden'}`}
      >
        <ul
          className='py-2 text-sm text-gray-700 dark:text-gray-200'
          aria-labelledby='header-language'
        >
          <li>
            <Link
              href={'/en' + baseUrl}
              className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
              onClick={() => toggleClickLanguage('en')}
            >
              English
            </Link>
          </li>
          <li>
            <Link
              href={'/fr' + baseUrl}
              className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
              onClick={() => toggleClickLanguage('fr')}
            >
              Français
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
