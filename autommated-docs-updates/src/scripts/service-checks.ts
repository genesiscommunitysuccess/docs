import { Services } from '../types/services';
import { ScriptArgs } from '../args';
import { runServiceChecks } from '../service-checks';

export async function runServiceChecksScript(services: Services, args: ScriptArgs): Promise<void> {
  console.log("\n🧪 Running service checks...");
  
  try {
    await runServiceChecks(services, args.commitHash);
    console.log("\n✅ All service checks completed successfully!");
  } catch (error) {
    console.error("❌ Service checks failed:", error);
    process.exit(1);
  }
} 