import Link from 'next/link';

import { siteConfig } from '../lib/siteConfig';
import { GitHubIcon } from './Icons';

export const Header = () => (
    <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto">
            <nav className="grid grid-cols-1 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-4 flex items-center h-16">
                    <Link href="/" as="/">
                        <a className="text-2xl font-bold rounded">
                            <span className="sr-only">Accueil</span>
                            Apéro Web <span className="text-base text-red-600">Nancy</span>
                        </a>
                    </Link>
                </div>
                <div className="md:col-span-8 items-center flex justify-between md:justify-end space-x-8 h-16">
                    <div className="flex items-center space-x-8">
                        <Link href="/faq">
                            <a>FAQ</a>
                        </Link>

                        <Link href="/speakers">
                            <a>Les speakers</a>
                        </Link>

                        <Link href="/talks">
                            <a>Les talks</a>
                        </Link>

                        <a
                            href={siteConfig.repoUrl}
                            className="h-6 w-6"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <GitHubIcon />
                            <span className="sr-only">GitHub</span>
                        </a>
                    </div>
                </div>
            </nav>
        </div>
    </header>
);
