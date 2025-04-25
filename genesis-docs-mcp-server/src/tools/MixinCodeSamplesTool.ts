import { MCPTool } from 'mcp-framework';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import { fileURLToPath } from 'url';
import axios from 'axios';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');
const defaultDocsFolder = path.resolve(projectRoot, '../docs');

// GitHub organization URL
const GITHUB_ORG = 'genesiscommunitysuccess';
const GITHUB_API_BASE = `https://api.github.com/orgs/${GITHUB_ORG}/repos`;
const HOWTO_PREFIX = 'howto-';

// Repository mapping categories to help identify relevant repos
const REPO_CATEGORIES = {
  'dataserver': ['dataserver', 'data-server', 'database', 'sql', 'query'],
  'ui': ['ui', 'frontend', 'web', 'react', 'component', 'grid'],
  'auth': ['auth', 'authentication', 'login', 'user', 'permission'],
  'event': ['event', 'eventhandler', 'message', 'request-reply'],
  'reporting': ['report', 'reporting', 'export', 'pdf', 'excel'],
  'integration': ['integration', 'api', 'rest', 'websocket'],
  'deploy': ['deploy', 'kubernetes', 'docker', 'container']
};

interface MixinCodeSamplesInput {
  mdxFilePath: string;
  localFolder?: string;
  maxRepos?: string;
}

interface RepoMatch {
  name: string;
  url: string;
  description: string;
  score: number;
  category: string;
}

class MixinCodeSamplesTool extends MCPTool<MixinCodeSamplesInput> {
  name = 'mixin-code-samples';
  description = 'Maps .mdx documentation files to relevant code repositories from Genesis Community Success GitHub organization';

  schema = {
    mdxFilePath: {
      type: z.string(),
      description: 'Path to the .mdx file to analyze, relative to the docs folder',
    },
    localFolder: {
      type: z.string().optional(),
      description: 'Local folder path where docs are located (defaults to ../docs)',
    },
    maxRepos: {
      type: z.string().optional().default('3'),
      description: 'Maximum number of repositories to return (default: 3)',
    },
  };

  /**
   * Read and parse an MDX file
   */
  private async readMdxFile(filePath: string): Promise<string | null> {
    try {
      console.log(`Reading MDX file: ${filePath}`);
      
      // Check if file exists and is accessible
      const stats = await fsPromises.stat(filePath);
      if (!stats.isFile()) {
        console.log(`Path exists but is not a file: ${filePath}`);
        return null;
      }
      
      // Read the file content
      const content = await fsPromises.readFile(filePath, 'utf-8');
      return content;
    } catch (error) {
      console.error(`Error reading MDX file: ${filePath}`, error);
      return null;
    }
  }

  /**
   * Extract key terms from MDX content
   */
  private extractKeyTerms(content: string): string[] {
    // Extract title and headings
    const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
    const title = titleMatch ? titleMatch[1] : '';
    
    // Extract headings (## and ### syntax)
    const headingMatches = [...content.matchAll(/##\s*([^\n]+)/g)];
    const headings = headingMatches.map(match => match[1].trim());
    
    // Extract keywords if they exist
    const keywordsMatch = content.match(/keywords:\s*\[(.*?)\]/s);
    const keywordsStr = keywordsMatch ? keywordsMatch[1] : '';
    const keywords = keywordsStr.split(',').map(k => 
      k.replace(/['"]/g, '').trim()
    ).filter(k => k.length > 0);
    
    // Extract tags if they exist
    const tagsSection = content.match(/tags:\s*([\s\S]*?)(?:---|\n\n)/);
    const tags: string[] = [];
    if (tagsSection && tagsSection[1]) {
      const tagLines = tagsSection[1].split('\n');
      tagLines.forEach(line => {
        const tagMatch = line.match(/\s*-\s*(.+)/);
        if (tagMatch) {
          tags.push(tagMatch[1].trim());
        }
      });
    }
    
    // Extract code snippet languages
    const codeBlocks = [...content.matchAll(/```(\w+)/g)];
    const codeLanguages = codeBlocks.map(match => match[1]).filter(lang => 
      !['bash', 'sh', 'shell', 'text', 'plaintext'].includes(lang)
    );
    
    // Combine all found terms
    const allTerms = [
      title,
      ...headings,
      ...keywords,
      ...tags,
      ...codeLanguages
    ].filter(term => term && term.length > 0);
    
    // Return unique terms
    return [...new Set(allTerms)];
  }

  /**
   * Extract GitHub repository URLs directly from content
   */
  private extractGitHubRepoUrls(content: string): string[] {
    const repoUrls: string[] = [];
    
    // Look for GitHub URLs in the content
    const githubPattern = /https:\/\/github\.com\/([^\/\s"')]+)\/([^\/\s"')]+)/g;
    const matches = [...content.matchAll(githubPattern)];
    
    for (const match of matches) {
      const fullUrl = match[0];
      const owner = match[1];
      const repo = match[2];
      
      // Check if this is a repo URL (not a file or issue)
      if (owner && repo && !fullUrl.includes('/blob/') && !fullUrl.includes('/tree/')) {
        repoUrls.push(`${owner}/${repo}`);
      } else if (owner && repo) {
        // This is a URL to a specific file or directory in the repo
        repoUrls.push(`${owner}/${repo}`);
      }
    }
    
    // Return unique repository URLs
    return [...new Set(repoUrls)];
  }

  /**
   * Fetch repositories from GitHub API
   */
  private async fetchRepositories(): Promise<any[]> {
    try {
      console.log(`Fetching repositories from ${GITHUB_API_BASE}`);
      const response = await axios.get(GITHUB_API_BASE, {
        params: {
          per_page: 100,
          sort: 'updated'
        },
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          // Add Authorization header if needed for higher rate limits
          // 'Authorization': `token ${process.env.GITHUB_TOKEN}`
        }
      });
      
      if (response.status !== 200) {
        throw new Error(`GitHub API returned status ${response.status}`);
      }
      
      // Filter for howto repositories
      const repos = response.data.filter((repo: any) => 
        repo.name.startsWith(HOWTO_PREFIX) && !repo.archived
      );
      
      console.log(`Found ${repos.length} howto repositories`);
      return repos;
    } catch (error) {
      console.error('Error fetching repositories:', error);
      return [];
    }
  }

  /**
   * Determine repository matches based on key terms
   */
  private findRepoMatches(repos: any[], keyTerms: string[]): RepoMatch[] {
    const matches: RepoMatch[] = [];
    
    // Convert all terms to lowercase for case-insensitive matching
    const normalizedTerms = keyTerms.map(term => term.toLowerCase());
    
    // Helper function to check if a term is related to a category
    const getTermCategory = (term: string): string | null => {
      for (const [category, keywords] of Object.entries(REPO_CATEGORIES)) {
        if (keywords.some(keyword => term.includes(keyword))) {
          return category;
        }
      }
      return null;
    };
    
    // Categorize terms
    const termCategories = new Map<string, number>();
    normalizedTerms.forEach(term => {
      const category = getTermCategory(term);
      if (category) {
        termCategories.set(category, (termCategories.get(category) || 0) + 1);
      }
    });
    
    repos.forEach(repo => {
      // Calculate match score
      let score = 0;
      const repoName = repo.name.toLowerCase();
      const repoDescription = (repo.description || '').toLowerCase();
      
      // Check for exact matches in repository name
      normalizedTerms.forEach(term => {
        // Remove the howto- prefix for matching
        const nameWithoutPrefix = repoName.replace(HOWTO_PREFIX, '');
        
        // Exact match in name (higher weight)
        if (nameWithoutPrefix.includes(term)) {
          score += 3;
        }
        
        // Match in description
        if (repoDescription.includes(term)) {
          score += 1;
        }
      });
      
      // Find which category this repo best matches
      let bestCategory = '';
      let highestCategoryScore = 0;
      
      for (const [category, count] of termCategories.entries()) {
        const categoryKeywords = REPO_CATEGORIES[category as keyof typeof REPO_CATEGORIES];
        
        // Check if repo name or description contains any of the category keywords
        const containsKeyword = categoryKeywords.some(keyword => 
          repoName.includes(keyword) || repoDescription.includes(keyword)
        );
        
        if (containsKeyword && count > highestCategoryScore) {
          highestCategoryScore = count;
          bestCategory = category;
          
          // Add additional points for category match
          score += 2;
        }
      }
      
      // Only include repos with some relevance
      if (score > 0) {
        matches.push({
          name: repo.name,
          url: repo.html_url,
          description: repo.description || 'No description available',
          score,
          category: bestCategory || 'general'
        });
      }
    });
    
    // Sort by score (descending)
    return matches.sort((a, b) => b.score - a.score);
  }

  async execute(input: MixinCodeSamplesInput) {
    try {
      // Determine folder to use
      const localFolder = input.localFolder || defaultDocsFolder;
      const maxRepos = parseInt(input.maxRepos || '3', 10);
      
      // Check if localFolder exists and is accessible
      try {
        const stats = fs.statSync(localFolder);
        if (!stats.isDirectory()) {
          return {
            success: false,
            error: `Local folder is not a directory: ${localFolder}`
          };
        }
        console.log(`Using local folder: ${localFolder}`);
      } catch (err) {
        return {
          success: false,
          error: `Cannot access local folder: ${localFolder}. Error: ${err instanceof Error ? err.message : String(err)}`
        };
      }
      
      // Fix for duplicate "docs/" in path
      let mdxFilePath = input.mdxFilePath;
      if (mdxFilePath.startsWith('docs/') && localFolder.endsWith('/docs')) {
        mdxFilePath = mdxFilePath.substring(5); // Remove the 'docs/' prefix
        console.log(`Adjusted mdxFilePath to prevent duplicate docs/ in path: ${mdxFilePath}`);
      }
      
      // Construct the full path to the MDX file
      const fullMdxPath = path.isAbsolute(mdxFilePath) 
        ? mdxFilePath 
        : path.join(localFolder, mdxFilePath);
      
      console.log(`Full MDX path: ${fullMdxPath}`);
      
      // Read and parse MDX file
      const mdxContent = await this.readMdxFile(fullMdxPath);
      if (!mdxContent) {
        return {
          success: false,
          error: `Unable to read or parse MDX file: ${fullMdxPath}`
        };
      }
      
      // Extract GitHub repository URLs directly from content
      const directRepoUrls = this.extractGitHubRepoUrls(mdxContent);
      console.log(`Found ${directRepoUrls.length} GitHub repository URLs directly in content:`, directRepoUrls);
      
      // Extract key terms from MDX content
      const keyTerms = this.extractKeyTerms(mdxContent);
      console.log(`Extracted ${keyTerms.length} key terms:`, keyTerms);
      
      if (keyTerms.length === 0 && directRepoUrls.length === 0) {
        return {
          success: false,
          error: `No key terms or GitHub repositories could be extracted from the MDX file: ${fullMdxPath}`
        };
      }
      
      // If we have direct repository URLs, return them immediately
      if (directRepoUrls.length > 0) {
        return {
          success: true,
          mdxFile: path.basename(fullMdxPath),
          extractedTerms: keyTerms,
          repos: directRepoUrls,
          relevanceNote: "Repositories were directly referenced in the MDX content."
        };
      }
      
      // If no direct URLs were found, fall back to the original matching logic
      // Fetch repositories from GitHub
      const repos = await this.fetchRepositories();
      if (repos.length === 0) {
        return {
          success: false,
          error: `Unable to fetch repositories from GitHub or no repositories found`
        };
      }
      
      // Find matches between key terms and repositories
      const matches = this.findRepoMatches(repos, keyTerms);
      console.log(`Found ${matches.length} potential repository matches`);
      
      // Limit to max repos
      const topMatches = matches.slice(0, maxRepos);
      
      // Extract repository URLs from the top matches
      const repoUrls = topMatches.map(match => {
        // Extract owner/repo from URL
        const urlParts = match.url.split('/');
        const owner = urlParts[urlParts.length - 2];
        const repo = urlParts[urlParts.length - 1];
        return `${owner}/${repo}`;
      });
      
      // Group matches by category
      const matchesByCategory: Record<string, RepoMatch[]> = {};
      
      topMatches.forEach(match => {
        if (!matchesByCategory[match.category]) {
          matchesByCategory[match.category] = [];
        }
        matchesByCategory[match.category].push(match);
      });
      
      // Return results
      return {
        success: true,
        mdxFile: path.basename(fullMdxPath),
        extractedTerms: keyTerms,
        totalMatches: matches.length,
        topMatches,
        matchesByCategory,
        repos: repoUrls,
        relevanceNote: "Repositories are matched based on key terms extracted from the .mdx file and scored by relevance. Higher scores indicate better matches."
      };
      
    } catch (error) {
      console.error('Error in MixinCodeSamplesTool:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

export default MixinCodeSamplesTool; 