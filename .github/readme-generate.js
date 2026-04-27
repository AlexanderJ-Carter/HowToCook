const fs = require('fs').promises;
const path = require('path');
const { readdir, writeFile, stat } = fs;

const README_PATH = './README.md';
const MKDOCS_PATH = 'mkdocs.yml';
const dishesFolder = 'dishes';
const starsystemFolder = 'starsystem';

const ignorePaths = [
    '.git',
    'README.md',
    'node_modules',
    'CONTRIBUTING.md',
    '.github',
];

const categories = {
    vegetable_dish: {
        title: '素菜',
        readme: '',
        mkdocs: '',
    },
    meat_dish: {
        title: '荤菜',
        readme: '',
        mkdocs: '',
    },
    aquatic: {
        title: '水产',
        readme: '',
        mkdocs: '',
    },
    breakfast: {
        title: '早餐',
        readme: '',
        mkdocs: '',
    },
    staple: {
        title: '主食',
        readme: '',
        mkdocs: '',
    },
    'semi-finished': {
        title: '半成品加工',
        readme: '',
        mkdocs: '',
    },
    soup: {
        title: '汤与粥',
        readme: '',
        mkdocs: '',
    },
    drink: {
        title: '饮料',
        readme: '',
        mkdocs: '',
    },
    condiment: {
        title: '酱料和其它材料',
        readme: '',
        mkdocs: '',
    },
    dessert: {
        title: '甜品',
        readme: '',
        mkdocs: '',
    },
};

/**
 * 从菜谱文件中提取难度星级（1-5星）
 * @param {string} filename - 菜谱文件路径
 * @returns {Promise<number>} 星级数（1-5），无效评级返回 0
 */
async function countStars(filename) {
    const data = await fs.readFile(filename, 'utf-8');
    const lines = data.split('\n');
    // 只查找"预估烹饪难度"这一行的星级
    for (const line of lines) {
        if (line.includes('预估烹饪难度')) {
            const stars = (line.match(/★/g) || []).length;
            // 验证星级在有效范围内 (1-5)
            if (stars >= 1 && stars <= 5) {
                return stars;
            }
        }
    }
    // 如果没有找到难度标注或星级无效，返回 0 表示需要人工检查
    return 0;
}

/**
 * 按难度星级组织菜谱，生成对应的索引文件
 * @param {string} dishesFolder - 菜谱文件夹路径
 * @param {string} starsystemFolder - 星级索引文件夹路径
 * @returns {Promise<string[]>} 导航链接数组
 */
async function organizeByStars(dishesFolder, starsystemFolder) {
    const dishes = {};

    /**
     * 递归处理文件夹，提取所有菜谱文件的难度星级
     * @param {string} folderPath - 当前处理的文件夹路径
     */
    async function processFolder(folderPath) {
        const files = await readdir(folderPath);
        for (const filename of files) {
            const filepath = path.join(folderPath, filename);
            const fileStat = await stat(filepath);
            if (fileStat.isFile() && filename.endsWith('.md')) {
                const stars = await countStars(filepath);
                dishes[filepath] = stars;
            } else if (fileStat.isDirectory()) {
                await processFolder(filepath);
            }
        }
    }

    const dishesFolderAbs = path.resolve(dishesFolder);
    const starsystemFolderAbs = path.resolve(starsystemFolder);

    // 清理旧的 starsystem 文件
    if (
        await fs
            .access(starsystemFolderAbs)
            .then(() => true)
            .catch(() => false)
    ) {
        const oldFiles = await readdir(starsystemFolderAbs);
        for (const oldFile of oldFiles) {
            if (oldFile.endsWith('.md')) {
                await fs.unlink(path.join(starsystemFolderAbs, oldFile));
            }
        }
    } else {
        await fs.mkdir(starsystemFolderAbs, { recursive: true });
    }

    if (
        !(await fs
            .access(dishesFolderAbs)
            .then(() => true)
            .catch(() => false))
    ) {
        console.log(
            `Directory not found: ${dishesFolderAbs}, creating directory...`,
        );
        await fs.mkdir(dishesFolderAbs, { recursive: true });
    }

    await processFolder(dishesFolderAbs);

    // 只生成 1-5 星的文件，忽略 0 星（无效评级）
    const validStarRatings = [1, 2, 3, 4, 5];
    const navigationLinks = [];

    for (const stars of validStarRatings) {
        const dishesWithStars = Object.entries(dishes).filter(
            ([_, starCount]) => starCount === stars,
        );
        if (dishesWithStars.length === 0) continue;

        const starsFile = path.join(starsystemFolderAbs, `${stars}Star.md`);
        const content = [`# ${stars} 星难度菜品`, ''];
        for (const [filepath, starCount] of dishesWithStars) {
            const relativePath = path
                .relative(starsystemFolderAbs, filepath)
                .replace(/\\/g, '/');
            content.push(
                `* [${path.basename(filepath, '.md')}](./${relativePath})`,
            );
        }
        await writeFile(starsFile, content.join('\n'), 'utf-8');
        navigationLinks.push(
            `- [${stars} 星难度](${path.relative(path.dirname(README_PATH), starsFile).replace(/\\/g, '/')})`,
        );
    }

    // 检查是否有无效评级的菜品
    const invalidDishes = Object.entries(dishes).filter(
        ([_, starCount]) => starCount === 0,
    );
    if (invalidDishes.length > 0) {
        console.warn('警告：以下菜品缺少有效的难度评级（应为 1-5 星）：');
        invalidDishes.forEach(([filepath]) => {
            console.warn(`  - ${filepath}`);
        });
    }

    return navigationLinks;
}

/**
 * 主函数：生成 README.md 和 mkdocs.yml
 * 1. 扫描所有 Markdown 文件
 * 2. 按分类组织内容
 * 3. 生成难度星级索引
 * 4. 写入最终文件
 */
async function main() {
    try {
        let README_BEFORE = '',
            README_MAIN = '',
            README_AFTER = '';
        let MKDOCS_BEFORE = '',
            MKDOCS_MAIN = '',
            MKDOCS_AFTER = '';
        const markdownObj = await getAllMarkdown('.');

        for (const markdown of markdownObj) {
            if (markdown.path.includes('tips/advanced')) {
                README_AFTER += inlineReadmeTemplate(
                    markdown.file,
                    markdown.path,
                );
                MKDOCS_AFTER += inlineMkdocsTemplate(
                    markdown.file,
                    markdown.path,
                );
                continue;
            }

            if (markdown.path.includes('tips')) {
                README_BEFORE += inlineReadmeTemplate(
                    markdown.file,
                    markdown.path,
                );
                MKDOCS_BEFORE += inlineMkdocsTemplate(
                    markdown.file,
                    markdown.path,
                );
                continue;
            }

            for (const category of Object.keys(categories)) {
                if (!markdown.path.includes(category)) continue;
                categories[category].readme += inlineReadmeTemplate(
                    markdown.file,
                    markdown.path,
                );
                categories[category].mkdocs += inlineMkdocsTemplate(
                    markdown.file,
                    markdown.path,
                    true,
                );
            }
        }

        for (const category of Object.values(categories)) {
            README_MAIN += categoryReadmeTemplate(
                category.title,
                category.readme,
            );
            MKDOCS_MAIN += categoryMkdocsTemplate(
                category.title,
                category.mkdocs,
            );
        }

        let MKDOCS_TEMPLATE;
        let README_TEMPLATE;

        try {
            MKDOCS_TEMPLATE = await fs.readFile(
                './.github/templates/mkdocs_template.yml',
                'utf-8',
            );
        } catch (error) {
            MKDOCS_TEMPLATE = `site_name: My Docs\nnav:\n  {{main}}\n`;
            console.warn(
                'mkdocs_template.yml not found, using default template',
            );
        }

        try {
            README_TEMPLATE = await fs.readFile(
                './.github/templates/readme_template.md',
                'utf-8',
            );
        } catch (error) {
            README_TEMPLATE = `# My Project\n\n{{before}}\n\n{{main}}\n\n{{after}}`;
            console.warn(
                'readme_template.md not found, using default template',
            );
        }

        const navigationLinks = await organizeByStars(
            dishesFolder,
            starsystemFolder,
        );
        const navigationSection = `\n### 按难度索引\n\n${navigationLinks.join('\n')}`;

        await writeFile(
            README_PATH,
            README_TEMPLATE.replace('{{before}}', README_BEFORE.trim())
                .replace('{{index_stars}}', navigationSection.trim())
                .replace('{{main}}', README_MAIN.trim())
                .replace('{{after}}', README_AFTER.trim()),
        );

        await writeFile(
            MKDOCS_PATH,
            MKDOCS_TEMPLATE.replace('{{before}}', MKDOCS_BEFORE)
                .replace('{{main}}', MKDOCS_MAIN)
                .replace('{{after}}', MKDOCS_AFTER),
        );
    } catch (error) {
        console.error(error);
    }
}

/**
 * 递归获取目录下所有 Markdown 文件
 * @param {string} dir - 扫描的目录路径
 * @returns {Promise<Array<{path: string, file: string}>>} 文件信息数组
 */
async function getAllMarkdown(dir) {
    const paths = [];
    const files = await readdir(dir);
    files.sort((a, b) => a.localeCompare(b, 'zh-CN'));

    for (const file of files) {
        const filePath = path.join(dir, file);
        if (ignorePaths.includes(file)) continue;
        const fileStat = await stat(filePath);
        if (fileStat.isFile() && file.endsWith('.md')) {
            paths.push({ path: dir, file });
        } else if (fileStat.isDirectory()) {
            const subFiles = await getAllMarkdown(filePath);
            paths.push(...subFiles);
        }
    }
    return paths;
}

function inlineReadmeTemplate(file, path) {
    return `- [${file.replace('.md', '')}](${path}/${file})\n`;
}

function categoryReadmeTemplate(title, inlineStr) {
    return `\n### ${title}\n\n${inlineStr}`;
}

function inlineMkdocsTemplate(file, path, isDish = false) {
    return `${' '.repeat(isDish ? 10 : 6)}- ${file.replace('.md', '')}: ${path}/${file}\n`;
}

function categoryMkdocsTemplate(title, inlineStr) {
    return `\n${' '.repeat(6)}- ${title}:\n${inlineStr}`;
}

main();
