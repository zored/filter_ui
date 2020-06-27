# Filter UI dev info

### Structure
- **Main** app creates window with **Renderer**.
- Renderer and Main communicate via Message Handlers.
- Main also creates **Worker** to modify files in parallel and without UI interruption.

### Example
- You rotate and like your file in UI.
- Renderer sends LikeMessage to Main.
- Main passes LikeMessage to Worker.
- Worker moves file to directory and rotates it.
- Then worker sends success message to Main and then to Renderer.

### Integrational test
Currently it doesn't run in CI:
```bash
DEV=Y yarn run test
```