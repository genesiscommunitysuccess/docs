# Next Steps: Automated Documentation Updates Implementation

This document outlines the implementation strategy for the next phase of the automated docs updates project, focusing on creating pull requests in the docs repository.

## Overview

The current implementation successfully identifies which documentation files need to be updated based on code commits. The next phase involves:

1. **File Editing**: Modify the identified docs files with AI-generated content
2. **Git Operations**: Stage, commit, and push changes to a new branch
3. **PR Creation**: Create a pull request via GitHub API

## Implementation Strategy

### 1. File Editing Service

We need a new service to handle file modifications:

```typescript
interface FileEditingService {
  updateDocFile(
    filePath: string, 
    commitInfo: CommitInfo, 
    updateInstructions: string
  ): Promise<Result<FileUpdateResult, FileEditingError>>;
}
```

**Key considerations:**
- **AI-powered content generation**: Use the commit info to generate relevant documentation updates
- **Content preservation**: Ensure we don't overwrite existing content inappropriately
- **Format preservation**: Maintain markdown formatting and structure
- **Backup strategy**: Create backups before making changes

### 2. Git Operations Service

Extend the existing git service to handle docs repository operations:

```typescript
interface GitOperationsService {
  createBranch(branchName: string, baseBranch: string): Promise<Result<true, GitError>>;
  stageFiles(filePaths: string[]): Promise<Result<true, GitError>>;
  commitChanges(message: string, author?: string): Promise<Result<string, GitError>>;
  pushBranch(branchName: string): Promise<Result<true, GitError>>;
}
```

**Key considerations:**
- **Branch naming**: Generate meaningful branch names (e.g., `docs/update-auth-system-abc123`)
- **Conflict handling**: What if the branch already exists?
- **Authentication**: Ensure proper SSH/GitHub token access
- **Error recovery**: Handle failed pushes, network issues, etc.

### 3. GitHub API Service

New service for PR creation:

```typescript
interface GitHubService {
  createPullRequest(
    title: string,
    body: string,
    headBranch: string,
    baseBranch: string
  ): Promise<Result<PullRequest, GitHubError>>;
}
```

**Key considerations:**
- **GitHub token**: Need proper authentication
- **PR templates**: Use consistent formatting and labels
- **Auto-assignment**: Assign to appropriate reviewers
- **Draft PRs**: Option to create as draft for review

## Workflow Design

### Option 1: Sequential Processing
```
1. For each file to edit:
   - Generate AI content
   - Apply changes
   - Validate changes
2. Create git branch
3. Stage all changes
4. Commit with descriptive message
5. Push branch
6. Create PR
```

### Option 2: Batch Processing
```
1. Generate all AI content upfront
2. Review/validate all changes
3. Apply all changes at once
4. Single commit with all changes
5. Push and create PR
```

## Technical Challenges & Solutions

### 1. AI Content Generation
- **Challenge**: Generating contextually appropriate content
- **Solution**: Use the commit diff and existing file content to generate relevant updates
- **Consideration**: Need to handle different file types (API docs, guides, examples)

### 2. Content Quality
- **Challenge**: Ensuring generated content is accurate and useful
- **Solution**: Implement validation steps and human review options
- **Consideration**: Maybe generate as draft PRs initially

### 3. Git State Management
- **Challenge**: Handling concurrent operations and state conflicts
- **Solution**: Implement proper locking and state validation
- **Consideration**: What if someone else pushes to the same branch?

### 4. Error Recovery
- **Challenge**: Handling failures at any step
- **Solution**: Implement rollback mechanisms and partial success handling
- **Consideration**: Clean up branches if PR creation fails

## Configuration Options

We'd want to make this configurable:

```typescript
interface DocsUpdateConfig {
  // Git settings
  baseBranch: string; // 'main', 'preprod', etc.
  branchPrefix: string; // 'docs/update-'
  
  // PR settings
  createAsDraft: boolean;
  autoAssignReviewers: string[];
  labels: string[];
  
  // Content settings
  backupFiles: boolean;
  validateChanges: boolean;
  
  // AI settings
  modelTemperature: number;
  maxRetries: number;
}
```

## Integration Points

### With Existing Services
- **AI Service**: Extend to generate content, not just find files
- **Git Service**: Add docs repository operations
- **Filesystem Service**: Add file modification capabilities

### New Services Needed
- **Content Generation Service**: AI-powered documentation content creation
- **GitHub API Service**: PR creation and management
- **Validation Service**: Content quality and format validation

## Recommended Implementation Order

### Phase 1: File Editing Service
- Implement AI content generation for documentation updates
- Add file modification capabilities to filesystem service
- Implement content validation and backup mechanisms

### Phase 2: Git Operations for Docs Repository
- Extend git service to handle docs repository operations
- Implement branch creation, staging, committing, and pushing
- Add error handling and recovery mechanisms

### Phase 3: GitHub API Integration
- Implement GitHub API service for PR creation
- Add PR templates and configuration options
- Implement auto-assignment and labeling

### Phase 4: Error Handling and Recovery
- Implement comprehensive error handling
- Add rollback mechanisms for failed operations
- Implement partial success handling

### Phase 5: Configuration and Customization
- Add configuration options for all aspects
- Implement environment variable support
- Add command-line argument support

## Questions for Discussion

1. **Content Strategy**: Should we generate completely new content or modify existing content?
2. **Review Process**: Should PRs be created as drafts initially for human review?
3. **Branch Strategy**: Should we use feature branches or work directly on main?
4. **Error Handling**: How should we handle partial failures (some files updated, others failed)?
5. **Authentication**: What's the preferred method for GitHub API access?

## File Structure

The new services would be organized as follows:

```
src/
├── services/
│   ├── content-generation-service/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── github-service/
│   │   ├── types.ts
│   │   └── index.ts
│   └── validation-service/
│       ├── types.ts
│       └── index.ts
├── repositories/
│   ├── content-generation/
│   │   ├── types.ts
│   │   ├── mock.ts
│   │   ├── langchain.ts
│   │   └── index.ts
│   └── github/
│       ├── types.ts
│       ├── mock.ts
│       ├── api.ts
│       └── index.ts
└── types/
    └── docs-update.ts
```

## Dependencies

New dependencies that would be needed:

```json
{
  "@octokit/rest": "^20.0.0",
  "diff": "^5.1.0",
  "markdown-it": "^14.0.0"
}
```

## Testing Strategy

1. **Unit Tests**: Test each service in isolation
2. **Integration Tests**: Test the complete workflow with mock services
3. **End-to-End Tests**: Test with real GitHub API (using test repositories)
4. **Error Scenario Tests**: Test various failure modes and recovery

## Security Considerations

1. **GitHub Token Management**: Secure storage and rotation of API tokens
2. **File Permissions**: Ensure proper file permissions for modified files
3. **Content Validation**: Validate generated content to prevent malicious code injection
4. **Audit Logging**: Log all operations for security and debugging purposes 