import fs from 'fs';
import path from 'path';

const BLOG_DIR = './src/content/blog';
const SECRET_FILE = './secret.md';

const posts = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'));
const screenshots = [];

posts.forEach(post => {
    const content = fs.readFileSync(path.join(BLOG_DIR, post), 'utf-8');

    // Extract Screenshot components
    const matches = content.matchAll(/<Screenshot\s+src="(.+?)"\s+alt="(.+?)"(?:\s+caption="(.+?)")?\s*\/>/g);
    for (const match of matches) {
        const src = match[1];
        const alt = match[2];
        const caption = match[3] || alt;
        screenshots.push({
            path: src,
            purpose: caption.length > 50 ? caption.substring(0, 47) + "..." : caption,
            description: alt
        });
    }

    // Extract coverImage from frontmatter
    const coverMatch = content.match(/coverImage:\s*"(.+?)"/);
    if (coverMatch) {
        screenshots.push({
            path: coverMatch[1],
            purpose: "featured cover image",
            description: `Cover image for ${post.replace('.mdx', '')} article`
        });
    }
});

// Deduplicate by path
const uniqueScreenshots = Array.from(new Set(screenshots.map(s => s.path)))
    .map(p => screenshots.find(s => s.path === p));

let output = "# Blog Asset Tracking (Secret)\n\nThis file tracks all screenshots referenced in the blog for manual asset creation.\n\n| status | path | purpose | description |\n| :--- | :--- | :--- | :--- |\n";

uniqueScreenshots.forEach(s => {
    output += `| [ ] | ${s.path} | ${s.purpose} | ${s.description} |\n`;
});

fs.writeFileSync(SECRET_FILE, output);
console.log(`Generated ${uniqueScreenshots.length} screenshot entries in secret.md.`);
