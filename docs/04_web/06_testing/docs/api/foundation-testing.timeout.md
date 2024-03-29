---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-testing](./foundation-testing.md) &gt; [timeout](./foundation-testing.timeout.md)

## timeout variable

Timeout utility.

**Signature:**

```typescript
timeout: (callback: (context: any) => Promise<any>, duration?: number) => (context: any) => Promise<any>
```

## Example 1

A promise that never ends.

```ts
test(
  'should fail',
  timeout(async () => {
    await new Promise(() => {});
    assert.ok(true);
  }, 5_000),
);
```

## Example 2

A slow API.

```ts
test(
  'should fail',
  timeout(async () => {
    const slowMockAPI = delayedResolve({ foo: 'bar' }, 4_000);
    await slowMockAPI();
    assert.unreachable('should have timed out');
  }, 2_000),
);
```

