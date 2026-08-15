const fs = require('fs/promises');
const path = require('path');
const { createReadStream, createWriteStream } = require('fs');

async function buildBundle() {
  try {
    const stylesDir = path.join(__dirname, 'styles');
    const distDir = path.join(__dirname, 'project-dist');
    const bundlePath = path.join(distDir, 'bundle.css');

    // Створюємо або очищаємо файл bundle.css
    const outputStream = createWriteStream(bundlePath);

    // Читаємо вміст папки styles
    const entries = await fs.readdir(stylesDir, { withFileTypes: true });

    for (const entry of entries) {
      const filePath = path.join(stylesDir, entry.name);
      const ext = path.extname(entry.name);

      // Перевіряємо, чи це файл та чи має він розширення .css
      if (entry.isFile() && ext === '.css') {
        const inputStream = createReadStream(filePath, 'utf-8');

        // Послідовно записуємо вміст кожного файлу в bundle.css
        for await (const chunk of inputStream) {
          outputStream.write(chunk + '\n');
        }
      }
    }

    console.log('Styles merged successfully into bundle.css!');
  } catch (err) {
    console.error('Error merging styles:', err.message);
  }
}

buildBundle();
