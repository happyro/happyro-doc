# Contributing

Contributions are welcome across documentation, localization, scripts, and compatibility fixes. Read `AGENTS.md` in the relevant repository and decide whether a change belongs to the root, client, or server repository; each has independent Git history.

Create topic branches from `main`, keep each commit to one logical change, run relevant checks, and include the corresponding changelog entry in the same commit as a product change. Never commit kRO resources, secrets, database data, logs, or generated files.

HappyRO commits use `type(scope): subject`. Preserve English product and debug logs; only player-visible text belongs in the Chinese localization. `main` is the regular product branch and `demo` contains public demo configuration and packaging.
