#!/usr/bin/env node

const shell = require('shelljs');
const path = require('path');

const testVaultPath = "C:\\Users\\arlo\\Documents\\30-resources\\notes\\notes";

console.log(`Testing file listing for: ${testVaultPath}`);
console.log('======================================');

// Check if path exists
if (!shell.test('-d', testVaultPath)) {
  console.error(`Path does not exist: ${testVaultPath}`);
  process.exit(1);
}

console.log('\n1. Using shell.find():');
console.log('---------------------');
try {
  const allItems = shell.find(testVaultPath);
  console.log(`Found ${allItems.length} items with shell.find()`);
  allItems.slice(0, 10).forEach(item => console.log(`  ${item}`));
  if (allItems.length > 10) {
    console.log(`  ... and ${allItems.length - 10} more items`);
  }
} catch (error) {
  console.error(`shell.find() error: ${error.message}`);
}

console.log('\n2. Using shell.ls():');
console.log('-------------------');
try {
  const lsItems = shell.ls('-A', testVaultPath);
  console.log(`Found ${lsItems.length} items with shell.ls(-A)`);
  lsItems.forEach(item => console.log(`  ${item}`));
} catch (error) {
  console.error(`shell.ls() error: ${error.message}`);
}

console.log('\n3. Using shell.ls() recursively:');
console.log('--------------------------------');
function listRecursively(dirPath, depth = 0) {
  const indent = '  '.repeat(depth);
  const items = shell.ls('-A', dirPath);
  
  items.forEach(item => {
    const itemName = item.toString();
    const itemPath = path.join(dirPath, itemName);
    
    if (itemName.startsWith('.')) {
      console.log(`${indent}[HIDDEN] ${itemName}`);
    } else if (shell.test('-d', itemPath)) {
      console.log(`${indent}[DIR] ${itemName}/`);
      if (depth < 2) { // Limit depth to avoid too much output
        listRecursively(itemPath, depth + 1);
      }
    } else {
      console.log(`${indent}[FILE] ${itemName}`);
    }
  });
}

try {
  listRecursively(testVaultPath);
} catch (error) {
  console.error(`Recursive listing error: ${error.message}`);
}

console.log('\n4. Testing copy operation:');
console.log('-------------------------');
const testTargetDir = 'test-output';

// Clean up previous test
if (shell.test('-d', testTargetDir)) {
  shell.rm('-rf', testTargetDir);
}

// Create target directory
shell.mkdir('-p', testTargetDir);

// Try copying with different approaches
console.log('Trying shell.cp with wildcard...');
const copyResult = shell.cp('-R', path.join(testVaultPath, '*'), testTargetDir);
console.log(`Copy result code: ${copyResult.code}`);
if (copyResult.stderr) {
  console.log(`Copy stderr: ${copyResult.stderr}`);
}

// Check what was copied
console.log('\nChecking copied files:');
if (shell.test('-d', testTargetDir)) {
  const copiedItems = shell.ls('-A', testTargetDir);
  console.log(`Copied ${copiedItems.length} items:`);
  copiedItems.forEach(item => console.log(`  ${item}`));
} else {
  console.log('Target directory does not exist');
}

// Clean up
shell.rm('-rf', testTargetDir);
console.log('\nTest completed!');