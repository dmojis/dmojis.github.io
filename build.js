const fs = require('fs/promises');
const path = require('path');

async function main() {
  const outputFolder = './output';
  const emojisFolder = './emojis';
  const emojisOutputFolder = path.join(outputFolder, 'emojis');

  // recreate output folder and emojis subfolder
  try {
    await fs.rm(outputFolder, {recursive: true});
  } catch (err) {
  }
  await fs.mkdir(outputFolder);
  await fs.mkdir(emojisOutputFolder);

  // copy each file in emojis folder to output/emojis folder
  const files = await fs.readdir(emojisFolder);
  const emojis = {};
  for (const file of files) {
    const sourcePath = path.join(emojisFolder, file);
    const targetPath = path.join(emojisOutputFolder, file);
    await fs.copyFile(sourcePath, targetPath);

    // create index.html file for each emoji file
    const fileNameWithoutExt = path.parse(file).name;
    const htmlFileName = `${fileNameWithoutExt}/index.html`;
    const htmlContent = `<!DOCTYPE html><meta content="width=device-width" name="viewport"><meta content="summary_large_image" property="twitter:card"><meta content="/emojis/${file}" property="twitter:image"><meta content="no-cache, no-store, must-revalidate" http-equiv="Cache-Control"><meta content="no-cache" http-equiv="Pragma"><meta content="0" http-equiv="Expires"><meta content="48" property="og:image:width"><meta content="48" property="og:image:height"><title>${fileNameWithoutExt}</title><style>img{width:50vmin;height:50vmin;max-width:4.5rem;max-height:4.5rem}body,html{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;width:100%;margin:0;padding:0;background:#222;color:#fff;font-family:system-ui,sans-serif}b{margin-top:1rem}</style><img src="/emojis/${file}"><b>${fileNameWithoutExt}</b>`;
    await fs.mkdir(path.join(outputFolder, fileNameWithoutExt));
    await fs.writeFile(path.join(outputFolder, htmlFileName), htmlContent);
    emojis[fileNameWithoutExt] = `/emojis/${file}`;
  }

  // copy index.html and README.md to output folder
  await fs.copyFile('./index.html', path.join(outputFolder, 'index.html'));
  await fs.copyFile('./README.md', path.join(outputFolder, 'README.md'));

  // create emojis.json file
  await fs.writeFile(path.join(outputFolder, 'emojis.json'), JSON.stringify(emojis));
}

main().catch(console.error);

