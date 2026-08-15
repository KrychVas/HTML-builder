const fs = require('fs/promises');
const path = require('path');

async function buildPage() {
  try {
    const projectDist = path.join(__dirname, 'project-dist');
    const templatePath = path.join(__dirname, 'template.html');
    const componentsDir = path.join(__dirname, 'components');
    const stylesDir = path.join(__dirname, 'styles');
    const assetsDir = path.join(__dirname, 'assets');
    const distAssetsDir = path.join(projectDist, 'assets');

    // 1. Створюємо/очищаємо папку project-dist
    await fs.rm(projectDist, { recursive: true, force: true });
    await fs.mkdir(projectDist, { recursive: true });

    // 2. Обробка HTML-шаблону
    let template = await fs.readFile(templatePath, 'utf-8');
    const componentFiles = await fs.readdir(componentsDir, {
      withFileTypes: true,
    });

    for (const file of componentFiles) {
      if (file.isFile() && path.extname(file.name) === '.html') {
        const tagName = path.basename(file.name, '.html');
        const componentContent = await fs.readFile(
          path.join(componentsDir, file.name),
          'utf-8',
        );
        template = template.replaceAll(`{{${tagName}}}`, componentContent);
      }
    }

    await fs.writeFile(path.join(projectDist, 'index.html'), template);

    // 3. Збірка стилів в style.css
    const styleFiles = await fs.readdir(stylesDir, { withFileTypes: true });
    const stylesContent = [];

    for (const file of styleFiles) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const content = await fs.readFile(
          path.join(stylesDir, file.name),
          'utf-8',
        );
        stylesContent.push(content);
      }
    }

    await fs.writeFile(
      path.join(projectDist, 'style.css'),
      stylesContent.join('\n\n'),
    );

    // 4. Рекурсивне копіювання assets
    await copyDirRecursive(assetsDir, distAssetsDir);

    console.log('Page built successfully!');
  } catch (err) {
    console.error('Error building page:', err.message);
  }
}

// Допоміжна функція для копіювання вкладених папок і файлів
async function copyDirRecursive(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

buildPage();
