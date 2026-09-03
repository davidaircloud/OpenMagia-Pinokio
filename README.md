# OpenMagia for Pinokio

Pinokio launcher for [OpenMagia](https://github.com/davidaircloud/OpenMagia), a local-first AI video editor. The launcher repository contains only lifecycle scripts; it clones the application into `app/`, leaving the main OpenMagia repository independently maintained.

## Install directly

Paste this repository's public GitHub URL into Pinokio's **Download from URL** flow. Until clean-machine validation is complete, this launcher should be described as a release candidate rather than advertised as verified one-click support.

## Actions

- **Install Editor** clones OpenMagia and validates its Python sources without downloading model weights.
- **Start** runs `server.py` as a Pinokio-owned daemon on a dynamically allocated port.
- **Open UI** appears when the server is ready.
- **Stop** stops the Pinokio daemon.
- **Update** fast-forwards both launcher and application repositories.
- **Install Generation Model** is a separate, explicit, license-gated download on supported Macs.

Updates do not delete or reset `projects/`, `media/`, `uploads/`, `data/`, `models/`, or `addons/`. These paths are ignored by the application repository and remain inside Pinokio's managed launcher directory.

## Compatibility

| Capability | macOS Apple Silicon | macOS Intel | Linux | Windows |
| --- | --- | --- | --- | --- |
| Editor and existing-media workflow | Supported | Expected; clean-machine test pending | Expected; clean-machine test pending | Expected; clean-machine test pending |
| Timeline export | Supported with FFmpeg | Requires FFmpeg; test pending | Requires FFmpeg; test pending | Requires FFmpeg; test pending |
| Native MiniMax H3 generation | **Supported with 64+ GB RAM and ~278 GB disk** | Not supported | Not supported (CUDA backend not yet integrated) | Not supported (CUDA backend not yet integrated) |

The generation action requires the user to review and explicitly accept the [MiniMax H3 Community License](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE). It invokes OpenMagia's idempotent installer, so interrupted Hugging Face downloads resume rather than restart.

## Validation checklist

See [TESTING.md](TESTING.md). A registry listing does not imply endorsement or verified compatibility. Verified Discover placement requires publisher verification, review/testing, and transfer of the launcher repository to Pinokio Factory under Pinokio's current publishing policy.

## License

The launcher scripts are available under the MIT License. OpenMagia and downloaded models retain their own licenses.
