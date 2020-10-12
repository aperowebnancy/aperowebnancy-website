const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');
const puppeteer = require('puppeteer');
const matter = require('gray-matter');

const { getHtml } = require('./template');

const isHeadless = false; // set to false for debug

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

async function generateImages() {
    console.warn('--- START ---');

    const browser = await puppeteer.launch({
        headless: isHeadless,
    });
    const page = await browser.newPage();
    page.setViewport({ width: 1200, height: 628 });
    console.warn('generate images...');
    const talks = getAllTalks();

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
