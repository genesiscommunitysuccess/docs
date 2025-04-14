#!/usr/bin/env node
// Platform-agnostic script to copy docs files to dist directory
// Only copies markdown (.md) and MDX (.mdx) files

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory where this script is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const sourceDir = path.resolve(projectRoot, '../docs');
const targetDir = path.resolve(projectRoot, 'dist/docs');

// Define the file extensions we want to copy
const allowedExtensions = ['.md', '.mdx'];

async function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  await fs.mkdir(dest, { recursive: true });
  
  // Get all entries in the source directory
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      await copyDir(srcPath, destPath);
    } else {
      // Only copy files with allowed extensions
      const ext = path.extname(entry.name).toLowerCase();
      if (allowedExtensions.includes(ext)) {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }
}

async function main() {
  try {
    console.log(`Copying markdown docs from ${sourceDir} to ${targetDir}...`);
    console.log(`Only copying files with extensions: ${allowedExtensions.join(', ')}`);
    
    // Remove target directory if it exists
    try {
      await fs.rm(targetDir, { recursive: true, force: true });
    } catch (err) {
      // Ignore error if directory doesn't exist
    }
    
    // Create target directory
    await fs.mkdir(targetDir, { recursive: true });
    
    // Copy files recursively
    await copyDir(sourceDir, targetDir);
    
    console.log('Files copied successfully!');
    
    // Count files by extension
    const countFiles = async (dir) => {
      const extensions = {};
      
      async function processDir(dirPath) {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
          if (entry.isDirectory()) {
            await processDir(path.join(dirPath, entry.name));
          } else {
            const ext = path.extname(entry.name).slice(1).toLowerCase();
            if (ext) {
              extensions[ext] = (extensions[ext] || 0) + 1;
            }
          }
        }
      }
      
      await processDir(dir);
      return extensions;
    };
    
    // Count source files by extension but only report md and mdx
    const sourceCounts = await countFiles(sourceDir);
    console.log('Source markdown file counts:', {
      md: sourceCounts.md || 0,
      mdx: sourceCounts.mdx || 0
    });
    
    // Count target files by extension
    const targetCounts = await countFiles(targetDir);
    console.log('Target markdown file counts:', targetCounts);
    
    // Log total count
    const totalFiles = Object.values(targetCounts).reduce((sum, count) => sum + count, 0);
    console.log(`Total files copied: ${totalFiles}`);
    
  } catch (err) {
    console.error('Error copying files:', err);
    process.exit(1);
  }
}

main();