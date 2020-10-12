const fs = require('fs');

const font = fs.readFileSync(`${__dirname}/Montserrat-Regular.ttf`).toString('base64');
const background = fs.readFileSync(`${__dirname}/background.png`).toString('base64');

function getCss(titleFontSize) {
    return `
        @font-face {
            font-family: 'Montserrat';
            src: url(data:application/x-font-ttf;charset=utf-8;base64,${font}) format('truetype');
            font-weight: normal;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: 'Montserrat';
            font-weight: bold;
        }

        .bodywrapper {
            background: white;
            background-image: url(data:image/png;charset=utf-8;base64,${background});
            background-size: cover;
            padding-left: 1rem;
            object-fit: cover;
            height: 628px;
            width: 1200px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        section {
            position: absolute;
            width: 690px;
            right: 70px;
            top: 190px;
            font-size: 30px;
            color: #ffffff;
            text-transform: uppercase;
        }

        .title {
            font-size: ${titleFontSize};
            letter-spacing: 3px;
            margin: 15px 0px;
        }

        .live {
            font-size: 27px;
            letter-spacing: 2px;
            color: #e53e3e;
        }

        .date {
            font-size: 33px;
            letter-spacing: 1px;
        }

        .hour {
            font-size: 33px;
            letter-spacing: 1px;
        }
    `;
}

const LETTER_BY_LINE = 100;
const MIN_SIZE_VIEWPORT = 3;
const MAX_SIZE_VIEWPORT = 8;

function getHtml({ date, frontMatter }) {
    const titleFontSize =
        Math.min(
            MAX_SIZE_VIEWPORT,
            Math.max(MIN_SIZE_VIEWPORT, Math.floor(LETTER_BY_LINE / frontMatter.title.length)),
        ) + 'vw';

    return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8" />
                <title>Generated Image</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <style>
                    ${getCss(titleFontSize)}
                </style>
            </head>
            <body>
               <div class="bodywrapper">
                    <section>
                        <div class="live">Youtube</div>
                        <div class="title">${frontMatter.title}</div>
                        <div class="date">
                            ${new Date(date).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </div>
                        <div class="hour">
                            de 19h à 21h
                        </div>
                    </section
                </div>
            </body>
        </html>
    `;
}

module.exports = { getHtml };
