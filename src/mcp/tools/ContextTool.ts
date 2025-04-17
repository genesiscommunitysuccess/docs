import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface ContextInput {
  category?: string;
}

const documentationContexts = {
  // Overview context
  overview: `
# Genesis Documentation Overview

Genesis is a low-code platform for building financial markets applications with these key components:
- Server-side Java/Kotlin components with event handlers, data servers, etc.
- Client-side web components using Web Components standards
- Integration capabilities with various data sources and systems

The documentation is organized into several major sections:
1. Learn - Platform overview and concepts
2. Develop - Development environment, components, capabilities
3. How-to - Practical guides for specific tasks
4. Build/Deploy/Operate - DevOps guidance
5. Release Notes - Version-specific information
`,

  // Web components context
  webComponents: `
# Genesis Web Components

Genesis web components follow specific naming conventions:
- \`rapid-\` - Main web component prefix for Genesis UI components (grids, charts, forms)
- \`alpha-\` - Foundation UI components (legacy components, being replaced by rapid-)
- \`foundation-\` - Pre-built business components like user management
  
Key web components to know:
- \`rapid-form\` - Smart forms with validation and data binding
- \`rapid-grid\` - Data grid component with advanced features
- \`rapid-chart\` - Data visualization component
- \`rapid-tab-bar\` - Navigation component
- \`foundation-login\` - Authentication component
- \`foundation-entity-management\` - CRUD interface builder

When implementing web components, you'll typically use both HTML templates and TypeScript/JavaScript configuration.
`,

  // Server components context
  serverComponents: `
# Genesis Server Components

Server components follow these naming patterns:
- Data Server (\`*-dataserver.kts\`) - Query-based data access
- Request Server (\`*-reqrep.kts\`) - Request-response interactions
- Event Handler (\`*-eventhandler.kts\`) - Handle events and mutations
- Consolidator - Aggregate and transform data

Key concepts:
- GPAL - Genesis Platform Abstraction Layer (Kotlin-based DSL)
- Tables and Views - Data persistence and presentation
- Fields - Typed data fields with validation
- Indices - Performance optimization for data access
- Auth - Permissions and access control

Server components can be written in Kotlin or Java, with Kotlin being the preferred approach.
`,

  // Data modeling context
  dataModeling: `
# Genesis Data Modeling

Genesis applications use a declarative approach to data modeling:
- Fields Dictionary (\`fields-dictionary.kts\`) - Defines all fields with types and constraints
- Tables Dictionary (\`tables-dictionary.kts\`) - Defines tables, keys, and indices
- Views Dictionary (\`views-dictionary.kts\`) - Defines views that combine data from multiple tables

Important concepts:
- Primary Keys - Uniquely identify records (required)
- Indices - Optimize query performance
- Foreign Keys - Reference relationships between tables
- Derived Fields - Calculated fields based on other fields
- Audit Fields - Automatic tracking of record changes

You can generate code from dictionary definitions using Gradle/Maven tasks.
`,

  // Development tools context
  developmentTools: `
# Genesis Development Tools

Key development tools available:
- Genesis Studio - Web-based environment for application building
- Intellij IDEA Plugin - Development within IntelliJ
- VS Code Extension - Development within VS Code
- Genesis Launchpad - UI for managing Genesis applications
- DbMon - Database monitoring and exploration tool
- GenesisTo... codegen tools - Various code generation utilities

Development workflow typically involves:
1. Define data model (fields, tables, views)
2. Create server components (event handlers, data servers)
3. Develop UI components (web components, routes)
4. Configure integration points
5. Test and deploy
`,

  // APIs and integration context
  apisAndIntegration: `
# Genesis APIs and Integration

Genesis provides multiple integration options:
- REST endpoints - HTTP-based APIs for data access and operations
- WebSockets - Real-time data streams
- FDC3 - Financial Desktop Connectivity and Collaboration standard
- JMS - Java Message Service integration
- Kafka - Event streaming platform integration
- Database integrations - SQL, NoSQL, JDBC connectors
- Custom connectors - Extensible integration framework

Common integration patterns:
- Data ingestion - CSV, Excel, API connections
- Authentication - LDAP, SSO, custom providers
- Notification - Email, instant messaging, webhooks
- Inter-application communication - Desktop interop standards
`,
};

class ContextTool extends MCPTool<ContextInput> {
  name = "contextDocs";
  description = "Get overall context and guidance for the Genesis documentation";
  schema = {
    category: {
      type: z.string().optional(),
      description: "Optional category for specific context (overview, webComponents, serverComponents, dataModeling, developmentTools, apisAndIntegration)",
    },
  };

  async execute({ category }: ContextInput) {
    try {
      // If no category specified, return list of available categories
      if (!category) {
        return {
          success: true,
          message: "Available context categories",
          categories: [
            { id: "overview", name: "Documentation Overview", description: "High-level overview of the documentation structure" },
            { id: "webComponents", name: "Web Components", description: "Genesis web component naming conventions and usage" },
            { id: "serverComponents", name: "Server Components", description: "Server-side component types and patterns" },
            { id: "dataModeling", name: "Data Modeling", description: "How to model data in Genesis applications" },
            { id: "developmentTools", name: "Development Tools", description: "Tools available for Genesis development" },
            { id: "apisAndIntegration", name: "APIs and Integration", description: "Integration options and patterns" },
          ],
          tip: "To get specific context, specify the category parameter with one of the category IDs listed above."
        };
      }

      // Check if the requested category exists
      if (category in documentationContexts) {
        return {
          success: true,
          category,
          context: documentationContexts[category as keyof typeof documentationContexts]
        };
      } else {
        return {
          success: false,
          error: `Unknown context category: ${category}`,
          availableCategories: Object.keys(documentationContexts)
        };
      }
    } catch (error) {
      console.error("[ContextTool] Error:", error);
      return {
        success: false,
        error: `Failed to get context: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
}

export default ContextTool;