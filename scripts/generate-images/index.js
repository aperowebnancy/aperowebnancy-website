const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');
const puppeteer = require('puppeteer');
const matter = require('gray-matter');

const { getHtml } = require('./template');

const isHeadless = true; // set to false for debug

function getAllTalks() {
    const files = glob.sync('talks/*.mdx');

    const allMdx = files.map((file) => {
        const [_, filename] = file.split('/');
        const [date, slug] = filename.replace('.mdx', '').split('_');

        const mdxSource = fs.readFileSync(file);
        const { data } = matter(mdxSource);

        return {
            date,
            slug,
            frontMatter: data,
        };
    });

    const orderedByDate = allMdx.sort((a, z) => {
        return new Date(z.date) - new Date(a.date);
    });

    return orderedByDate;
}

function getAllSpeakers() {
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

async function generateImages() {
    console.warn('--- START ---');

    const browser = await puppeteer.launch({
        headless: isHeadless,
    });
    const page = await browser.newPage();
    page.setViewport({ width: 1200, height: 628 });

    console.warn('generate images...');

    const speakers = getAllSpeakers();
    const talks = getAllTalks().map((talk) => ({
        ...talk,
        speakers: speakers
            .filter(
                (speaker) =>
                    talk.frontMatter.speakers && talk.frontMatter.speakers.includes(speaker.slug),
            )
            .map((speaker) => {
                const image = fs
                    .readFileSync(
                        `${__dirname}/../../public/speakers/${speaker.frontMatter.picture}`,
                    )
                    .toString('base64');
                return { ...speaker, image };
            }),
    }));

    for (const talk of talks) {
        const filePath = path.resolve(__dirname, `../../public/og_image/${talk.slug}.png`);
        if (fs.existsSync(filePath)) {
            continue;
        }

        await page.setContent(getHtml(talk), {
            waitUntil: ['domcontentloaded'],
        });

        await page.evaluateHandle('document.fonts.ready');

        await page.screenshot({ path: filePath });
    }

    if (isHeadless) {
        await browser.close();
    }

    console.warn('--- END ---');
}

(async () => {
    await generateImages();
})().catch((e) => {
    console.error(e);
});
