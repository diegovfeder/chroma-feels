# Bun dependency resolution issue

## Summary

While trying to add `react-grab` with Bun, the install repeatedly appeared to hang during dependency resolution:

```sh
bun add -D react-grab
bun add v1.3.13 (bf2e2cec)
Resolving dependencies
```

The process stayed at the resolution step for an extended period and did not complete during the observed attempts.

## Environment observed

- Project path: `/Users/diegovfeder/workspace/df/chroma-feels`
- Bun version: `1.3.13`
- Package being added: `react-grab`
- Intended dependency type: dev dependency
- Registry configured for npm packages: `https://registry.npmjs.org/`

## What was checked

- The repo does not appear to have a local `.npmrc`, `.bunfig.toml`, or `bunfig.toml` overriding registry behavior.
- `bun pm view react-grab version` eventually resolved `react-grab` as `0.1.32`, but it was slow.
- `bun add -D react-grab` stayed stuck at `Resolving dependencies` even after waiting.
- `bun pm cache rm` completed successfully and cleared Bun's install cache.
- Retrying `bun add -D react-grab` after clearing the cache still got stuck at dependency resolution.

## Current conclusion

This looks like a Bun package-manager resolution hang rather than an application-code issue in this repo. The package metadata is reachable, but Bun's install resolver is not completing reliably for this add operation.

The cache clear did not fix the behavior, so the next likely suspects are:

- A Bun 1.3.13 resolver bug or regression.
- A package metadata edge case involving `react-grab`.
- Network or registry behavior that Bun handles poorly during full dependency resolution.

## Current state

No successful `bun add -D react-grab` completion was observed.

No active `bun add` or `bun pm view` process was found after stopping the investigation.

## Possible next steps

When ready to continue, useful next checks would be:

```sh
bun add -D react-grab@0.1.32
```

or trying the same command with another Bun version to compare resolver behavior.

If exact-version install also hangs, this should probably be treated as a Bun issue and reduced to a minimal reproduction outside this repo.
