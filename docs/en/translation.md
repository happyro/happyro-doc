# Localization

HappyRO localization is not a single language-file replacement. The project scans client, server, and runtime sources for player-visible text, divides the work into traceable and verifiable shards, processes them with multiple AI agents in parallel, and merges the results.

AI translation can mistranslate or omit text and can damage formats or create inconsistencies, so an initial merged result is never considered release-ready. The current release is the result of repeated format checks, terminology correction, semantic validation, in-game testing, and targeted fixes.

kRO client resources follow a separate pipeline. Binary LUB files are extracted to structured JSON, only player-visible values are translated, and the validated result is compiled back to matching Lua 5.0 or Lua 5.1 bytecode. Semantic round trips and in-game verification ensure that keys, indexes, control flow, and runtime behavior remain unchanged. Official input files always remain read-only.

`docs/translation/zh-cn/` is an archive of completed translation batches and is no longer a product or release source. Active translations live in `repos/happyro-client`, `repos/happyro-server`, and `localization/client/data`; archived content must not be written back into the product.

## Copyright and resources

The required kRO client files are copyrighted third-party material governed by their owners' licenses. HappyRO cannot distribute them in its public Git repositories. Users are responsible for obtaining and using resources under the applicable authorization and local law.

For information about compatible resource versions and preparation, join QQ group `928171346` (熊猫模拟器).
