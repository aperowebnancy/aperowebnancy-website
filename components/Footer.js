import * as React from 'react';
import Link from 'next/link';
import { siteConfig } from '../lib/siteConfig';

export const Footer = () => (
    <footer className="bg-white flex items-center justify-center flex-wrap my-8 space-x-3">
        Apéro Web Nancy -
        <Link href={siteConfig.meetupUrl}>
            <a className="" rel="noopener noreferrer">
                Meetup
            </a>
        </Link>
        -
        <Link href={siteConfig.discordUrl}>
            <a className="" rel="noopener noreferrer">
                Discord
            </a>
        </Link>
        -
        <Link href={siteConfig.twitterUrl}>
            <a className="" rel="noopener noreferrer">
                Twitter
            </a>
        </Link>
        -
        <Link href={siteConfig.yourubeUrl}>
            <a className="" rel="noopener noreferrer">
                Youtube
            </a>
        </Link>
        -
        <Link href={siteConfig.githubUrl}>
            <a className="" rel="noopener noreferrer">
                Github
            </a>
        </Link>
    </footer>
);
