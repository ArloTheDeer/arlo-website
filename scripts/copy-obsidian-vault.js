#!/usr/bin/env node

const shell = require('shelljs');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

// Configuration constants
const CONFIG_FILE = 'config.yaml';
const TARGET_DIR = 'public/notes-src';

/**
 * Log message with timestamp
 * @param {string} message - Message to log
 */
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

/**
 * Exit with error message
 * @param {string} message - Error message
 * @param {number} code - Exit code (default: 1)
 */
function exitWithError(message, code = 1) {
  console.error(`Error: ${message}`);
  process.exit(code);
}

/**
 * Check if config.yaml exists and read configuration
 * @returns {object} Configuration object
 */
function readConfig() {
  if (!shell.test('-f', CONFIG_FILE)) {
    exitWithError(`${CONFIG_FILE} file not found. Please copy config-example.yaml to config.yaml and configure your Obsidian vault path.`);
  }

  try {
    const configContent = fs.readFileSync(CONFIG_FILE, 'utf8');
    const config = yaml.load(configContent);
    
    if (!config.obsidian_vault_path) {
      exitWithError(`obsidian_vault_path not found in ${CONFIG_FILE}`);
    }
    
    return config;
  } catch (error) {
    exitWithError(`Failed to read ${CONFIG_FILE}: ${error.message}`);
  }
}

/**
 * Validate if Obsidian vault path exists
 * @param {string} vaultPath - Path to Obsidian vault
 */
function validateVaultPath(vaultPath) {
  if (!shell.test('-d', vaultPath)) {
    exitWithError(`Obsidian vault path does not exist: ${vaultPath}`);
  }
  
  log(`Validated Obsidian vault path: ${vaultPath}`);
}

/**
 * Clean target directory if it exists
 */
function cleanTargetDirectory() {
  if (shell.test('-d', TARGET_DIR)) {
    log(`Removing existing ${TARGET_DIR} directory...`);
    const result = shell.rm('-rf', TARGET_DIR);
    if (result.code !== 0) {
      exitWithError(`Failed to remove ${TARGET_DIR}: ${result.stderr}`);
    }
  }
}

/**
 * Copy files from vault to target, excluding hidden files/directories
 * @param {string} vaultPath - Source Obsidian vault path
 */
function copyVaultFiles(vaultPath) {
  log(`Copying all files from ${vaultPath} to ${TARGET_DIR}...`);
  
  // Copy the entire directory
  const copyResult = shell.cp('-R', vaultPath, TARGET_DIR);
  if (copyResult.code !== 0) {
    exitWithError(`Failed to copy files from ${vaultPath}: ${copyResult.stderr}`);
  }
  
  log(`Removing hidden files and directories...`);
  // Remove all hidden files and directories recursively
  removeHiddenFiles(TARGET_DIR);

  log(`Successfully copied vault contents to ${TARGET_DIR}`);
}

/**
 * Recursively remove hidden files and directories (starting with '.')
 * @param {string} dirPath - Directory to clean
 */
function removeHiddenFiles(dirPath) {
  if (!shell.test('-d', dirPath)) return;
  
  const items = shell.ls('-A', dirPath);
  items.forEach(item => {
    const itemName = item.toString();
    const itemPath = path.join(dirPath, itemName);
    
    if (itemName.startsWith('.')) {
      log(`Removing hidden item: ${itemName}`);
      shell.rm('-rf', itemPath);
    } else if (shell.test('-d', itemPath)) {
      // Recursively clean subdirectories
      removeHiddenFiles(itemPath);
    }
  });
}

/**
 * Main function
 */
function main() {
  log('Starting Obsidian vault copy process...');
  
  try {
    // Step 1: Read configuration
    const config = readConfig();
    
    // Step 2: Validate vault path
    validateVaultPath(config.obsidian_vault_path);
    
    // Step 3: Clean target directory
    cleanTargetDirectory();
    
    // Step 4: Copy vault files
    copyVaultFiles(config.obsidian_vault_path);
    
    log('Obsidian vault copy process completed successfully!');
  } catch (error) {
    exitWithError(`Unexpected error: ${error.message}`);
  }
}

// Run main function if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { main, readConfig, validateVaultPath, cleanTargetDirectory, copyVaultFiles };