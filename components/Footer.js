import { siteConfig } from '../lib/siteConfig';
import {
    RssFeedIcon,
    MailChimpIcon,
    MeetupIcon,
    DiscordIcon,
    TwitterIcon,
    YoutubeIcon,
    GitHubIcon,
} from './Icons';

export const Footer = () => (
    <footer className="bg-gray-50 container mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex items-center md:order-2 space-x-6">
                <a
                    href={siteConfig.siteFeedUrl}
                    className="h-5 w-5 text-gray-500 hover:text-gray-600"
                    rel="noopener noreferrer"
                >
                    <RssFeedIcon />
                    <span className="sr-only">Flux RSS</span>
                </a>

                <a
                    href={siteConfig.mailchimpUrl}
                    className="h-6 w-6 text-gray-500 hover:text-gray-600"
                    rel="noopener noreferrer"
                >
                    <MailChimpIcon />
                    <span className="sr-only">Newsletters</span>
                </a>
                <a
                    href={siteConfig.meetupUrl}
                    className="h-6 w-6 text-gray-500 hover:text-gray-600"
                    rel="noopener noreferrer"
                >
                    <MeetupIcon fillBackground="#a0aec0" />
                    <span className="sr-only">Meetup</span>
                </a>
                <a
                    href={siteConfig.discordUrl}
                    className="h-6 w-6 text-gray-500 hover:text-gray-600"
                    rel="noopener noreferrer"
                >
                    <DiscordIcon />
                    <span className="sr-only">Discord</span>
                </a>
                <a
                    href={siteConfig.twitterUrl}
                    className="h-6 w-6 text-gray-500 hover:text-gray-600"
                    rel="noopener noreferrer me"
                >
                    <TwitterIcon />
                    <span className="sr-only">Twitter</span>
                </a>
                <a
                    href={siteConfig.youtubeUrl}
                    className="h-6 w-6 text-gray-500 hover:text-gray-600"
                    rel="noopener noreferrer"
                >
                    <YoutubeIcon />
                    <span className="sr-only">Youtube</span>
                </a>
                <a
                    href={siteConfig.githubUrl}
                    className="h-6 w-6 text-gray-500 hover:text-gray-600"
                    rel="noopener noreferrer"
                >
                    <GitHubIcon />
                    <span className="sr-only">GitHub</span>
                </a>
            </div>
            <p className="mt-8 text-base leading-6 text-gray-600 md:mt-0 md:order-1">
                {siteConfig.copyright}
            </p>
        </div>
    </footer>
);
