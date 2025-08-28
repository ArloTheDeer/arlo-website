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
  log(`Creating ${TARGET_DIR} directory...`);
  const mkdirResult = shell.mkdir('-p', TARGET_DIR);
  if (mkdirResult.code !== 0) {
    exitWithError(`Failed to create ${TARGET_DIR}: ${mkdirResult.stderr}`);
  }

  log(`Copying files from ${vaultPath} to ${TARGET_DIR}...`);
  
  // Use shell.find to get all files/directories, then filter out hidden ones
  const allItems = shell.find(vaultPath);
  
  // Filter out items that start with '.' (hidden files/directories)
  const visibleItems = allItems.filter(item => {
    const relativePath = path.relative(vaultPath, item);
    // Skip if any part of the path starts with '.'
    return !relativePath.split(path.sep).some(part => part.startsWith('.'));
  });

  // Copy each visible item
  visibleItems.forEach(item => {
    const relativePath = path.relative(vaultPath, item);
    const targetPath = path.join(TARGET_DIR, relativePath);
    
    if (shell.test('-d', item)) {
      // Create directory
      shell.mkdir('-p', targetPath);
    } else if (shell.test('-f', item)) {
      // Copy file
      const targetDir = path.dirname(targetPath);
      shell.mkdir('-p', targetDir);
      const copyResult = shell.cp(item, targetPath);
      if (copyResult.code !== 0) {
        exitWithError(`Failed to copy ${item}: ${copyResult.stderr}`);
      }
    }
  });

  log(`Successfully copied vault contents to ${TARGET_DIR}`);
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