# Release validation

## Automated checks

- [x] All launcher JavaScript parses with Node.js.
- [x] Metadata is valid JSON and references a repository-local icon.
- [x] Menu states cover uninstalled, installed, starting, running, model-installing, and updating states.
- [x] Start uses Pinokio's dynamic `{{port}}` rather than a fixed port.
- [x] Stop targets only the Pinokio-owned `start.js` daemon.
- [x] Update uses fast-forward-only pulls and does not reset application state.
- [x] Model installation is separate from editor installation and requires exact license acceptance.
- [x] OpenMagia's installer is resumable after interruption.

## Clean-machine matrix required before advertising one-click support

- [ ] Fresh Pinokio import from the public launcher URL.
- [ ] Editor installation and first launch.
- [ ] Stop and relaunch.
- [ ] Launch while OpenMagia's usual port 8730 is occupied; confirm Pinokio selects another port.
- [ ] Interrupt a model download, rerun it, and confirm existing shards are reused.
- [ ] Update after creating a project and importing media; confirm both remain intact.
- [ ] Generate a short clip on a 64+ GB Apple Silicon Mac with both checkpoints installed.
- [ ] Export that clip and play the resulting MP4.
- [ ] Smoke-test editor startup on Intel macOS, Linux, and Windows, or narrow the listing platforms.

Record the Pinokio version, operating system, architecture, memory, available disk, OpenMagia commit, launcher commit, and outcome for each run. Do not check off hardware-dependent tests based only on static analysis.
