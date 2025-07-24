import { Result } from './result';

// Example usage of the Result type
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return Result.error('Division by zero');
  }
  return Result.success(a / b);
}

function processNumber(value: number): Result<string, string> {
  if (value < 0) {
    return Result.error('Value cannot be negative');
  }
  return Result.success(`Processed: ${value}`);
}

// Example usage
console.log('=== Result Type Examples ===');

// Success case
const successResult = divide(10, 2);
if (Result.isSuccess(successResult)) {
  console.log(`✅ Success: ${successResult.value}`);
} else {
  console.log(`❌ Error: ${successResult.message}`);
}

// Error case
const errorResult = divide(10, 0);
if (Result.isError(errorResult)) {
  console.log(`❌ Error: ${errorResult.message}`);
} else {
  console.log(`✅ Success: ${errorResult.value}`);
}

// Using map
const mappedResult = Result.map(successResult, (value) => value * 2);
console.log(`📊 Mapped result: ${Result.unwrap(mappedResult)}`);

// Using unwrapOr
const safeResult = Result.unwrapOr(errorResult, 0);
console.log(`🛡️ Safe unwrap: ${safeResult}`);

// Chaining operations
const chainedResult = Result.map(
  Result.map(successResult, (value) => value * 3),
  (value) => `Result: ${value}`
);

if (Result.isSuccess(chainedResult)) {
  console.log(`🔗 Chained: ${chainedResult.value}`);
} 