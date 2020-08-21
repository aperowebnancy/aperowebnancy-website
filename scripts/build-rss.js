import fs from 'fs';
import glob from 'fast-glob';
import matter from 'gray-matter';
import RSS from 'rss';

import { siteConfig } from '../lib/siteConfig';

const getAllTalks = () => {
    const files = glob.sync('talks/*.mdx');

    return files.map((file) => {
        const [_, filename] = file.split('/');
        const [date, slug] = filename.replace('.mdx', '').split('_');

        const mdxSource = fs.readFileSync(file);
        const { data } = matter(mdxSource);

        return {
            date,
            slug: `talks/${slug}`,
            frontMatter: data,
        };
    });
};

const feed = new RSS({
    title: 'Apéro Web Nancy Meetup',
    site_url: siteConfig.siteUrl,
    feed_url: `${siteConfig.siteFeedUrl}`,
});

getAllTalks().forEach(({ date, slug, frontMatter }) => {
    feed.item({
        date,
        title: frontMatter.title,
        guid: slug,
        url: `${siteConfig.siteUrl}/${slug}`,
        description: frontMatter.description,
    });
});

fs.writeFileSync('./out/feed.xml', feed.xml({ indent: true }));
