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
- [x] Install and Update run OpenMagia's application regression suite before reporting success.

## Clean-machine matrix required before advertising one-click support

- [x] Fresh Pinokio import from the public launcher URL.
- [x] Editor installation and first launch.
- [x] Stop and relaunch.
- [x] Launch while OpenMagia's usual port 8730 is occupied; confirm Pinokio selects another port.
- [x] Interrupt a model download, rerun it, and confirm existing shards are reused.
- [x] Update after creating a project and importing media; confirm both remain intact.
- [x] Generate a short clip on a 64+ GB Apple Silicon Mac with both checkpoints installed.
- [x] Export that clip and play the resulting MP4.
- [ ] Smoke-test editor startup on Intel macOS, Linux, and Windows, or narrow the listing platforms.

Record the Pinokio version, operating system, architecture, memory, available disk, OpenMagia commit, launcher commit, and outcome for each run. Do not check off hardware-dependent tests based only on static analysis.

## Apple Silicon verification run — 2026-09-03

- Pinokio: 8.2.0 arm64, notarized application release
- Host: macOS 26.6.2 arm64, Apple M5 Max, 104 GB RAM
- OpenMagia: `c0ddf610d0d6b27e7c6a982d69c08a9da8087415`
- Public launcher baseline imported: `87c2a3e3506825292e2ad8957023d21a37daf425`
- Dynamic launch URL: `http://localhost:42003`; HTTP and `/api/state` returned successfully
- Occupied-port test: an independent server held port 8730 while OpenMagia remained ready on port 42003
- Update preservation: project `Pinokio Update Preservation 2026-09-03` and its 1,756,428-byte uploaded image survived the update and relaunch
- Download recovery: the MiniMax H3 installer was interrupted, preserved its partial cache, reused completed files on the next run, and completed both FL2VA and Ref2VA after Hugging Face authentication
- Native generation: `Pinokio Verification Clip`, 512×512, 8 requested frames, 2 denoising steps, completed as a silent 0.916667-second H.264 MP4 and was inserted on the base timeline
- Export: OpenMagia produced a 512×512 H.264 MP4 at 24 fps; FFmpeg decoded the complete file without error, Safari played it through the local OpenMagia URL, and SHA-256 was `aa3d16ae0a34efe25d8c72d60ca95a754242dde63f0a9d3d2319b6e162e9b894`.
- Generation validation exposed an API boundary defect: one denoising step was accepted although h3 requires at least two. The application now clamps this value to two and includes a regression test.

Non-Apple-Silicon rows remain unchecked until they have been exercised on the stated hardware.

## Current release compatibility — 2026-09-06

- OpenMagia `deba770` passes all 155 application regression tests.
- The launcher Install and Update actions now run that regression suite after source validation.
- The lifecycle contract is unchanged: the launcher follows OpenMagia's latest `main`, uses a Pinokio-assigned port, and preserves projects, media, models, settings, and add-ons during updates.
