const fs = require('fs/promises');
const path = require('path');

async function displayFilesInfo() {
  try {
    const folderPath = path.join(__dirname, 'secret-folder');
    const entries = await fs.readdir(folderPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile()) {
        const filePath = path.join(folderPath, entry.name);
        const stats = await fs.stat(filePath);

        const ext = path.extname(entry.name).slice(1);
        const name = path.basename(entry.name, path.extname(entry.name));
        const sizeInKB = (stats.size / 1024).toFixed(3);

        console.log(`${name} - ${ext} - ${sizeInKB}kb`);
      }
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

displayFilesInfo();
