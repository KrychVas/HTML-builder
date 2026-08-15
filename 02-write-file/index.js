const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Формуємо абсолютний шлях до файлу, в який будемо записувати
const filePath = path.join(__dirname, 'text.txt');

// Створюємо потік для запису (flags: 'a' додає текст у кінець файлу, а не перезаписує його)
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

// Створюємо інтерфейс для зчитування введення з консолі
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Функція для завершення програми з прощальним повідомленням
function exitProcess() {
  console.log('\nThank you! Goodbye!');
  rl.close();
  writeStream.end();
  process.exit(0);
}

// Виводимо привітальне повідомлення під час запуску
console.log(
  'Hello! Please enter some text to write into the file (type "exit" or press Ctrl+C to quit):',
);

// Обробка кожного нового рядка, введеного користувачем
rl.on('line', (input) => {
  if (input.trim() === 'exit') {
    exitProcess();
  } else {
    writeStream.write(`${input}\n`);
  }
});

// Обробка натискання Ctrl + C (подія SIGINT)
rl.on('SIGINT', () => {
  exitProcess();
});
