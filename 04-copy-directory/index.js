const fs = require('fs/promises');
const path = require('path');

async function copyDir() {
  try {
    const srcDir = path.join(__dirname, 'files');
    const destDir = path.join(__dirname, 'files-copy');

    // Видаляємо папку files-copy для актуалізації вмісту (якщо вона існувала)
    await fs.rm(destDir, { recursive: true, force: true });

    // Створюємо папку files-copy заново
    await fs.mkdir(destDir, { recursive: true });

    // Читаємо вміст папки files
    const files = await fs.readdir(srcDir, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const srcPath = path.join(srcDir, file.name);
        const destPath = path.join(destDir, file.name);

        // Копіюємо кожен файл окремо
        await fs.copyFile(srcPath, destPath);
      }
    }

    console.log('Directory copied successfully!');
  } catch (err) {
    console.error('Error copying directory:', err.message);
  }
}

copyDir();
