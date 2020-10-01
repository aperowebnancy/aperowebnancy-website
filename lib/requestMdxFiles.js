import fs from 'fs';
import glob from 'fast-glob';
import matter from 'gray-matter';

export function getAllTalks() {
    const files = glob.sync('talks/*.mdx');

    const allMdx = files.map((file) => {
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

    const orderedByDate = allMdx.sort((a, z) => {
        return new Date(z.date) - new Date(a.date);
    });

    return orderedByDate;
}

export function getAllSpeakers() {
    const files = glob.sync('speakers/*.mdx');

    const allMdx = files.map((file) => {
        const [_, filename] = file.split('/');
        const [slug] = filename.split('.');

        const mdxSource = fs.readFileSync(file);
        const { data } = matter(mdxSource);

        return {
            slug,
            frontMatter: data,
        };
    });

    const orderedByLastName = allMdx.sort((a, z) =>
        a.frontMatter.lastName.localeCompare(z.frontMatter.lastName),
    );

    return orderedByLastName;
}
