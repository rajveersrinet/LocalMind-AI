# LocalMind AI

**A privacy-first business assistant for freelancers and small businesses.**

LocalMind AI helps users draft client emails and summarize invoice details. It supports a local Ollama model, with a clearly labelled demo fallback when Ollama is unavailable.

## Why open-source AI?

- **Privacy:** prompts can be processed by a model running on the user's own machine instead of a third-party hosted AI API.
- **Cost control:** after downloading a model, local inference does not require a per-request AI API fee (electricity and hardware still have costs).
- **Freedom to switch:** change the model with `OLLAMA_MODEL` without rewriting the app.
- **Open innovation:** contributors can audit, improve, and extend the tool for niche freelancer workflows.

## Features

- Client email writer for payment reminders, project follow-ups, quotations, and thank-you notes.
- Invoice summary generator.
- Invoice records stored in browser `localStorage`.
- Local Ollama integration through a small Node/Express backend.
- Demo mode if Ollama is not installed or running.
- Responsive UI and copy-to-clipboard output.

## Requirements

- Node.js 18+
- Optional for local AI: [Ollama](https://ollama.com/) and a compatible model

## Run the app

```bash
npm install
npm start
```

Open http://localhost:3000.

### Enable local AI

1. Install Ollama from https://ollama.com/
2. Pull a model, for example:

```bash
ollama pull qwen2.5:3b
```

3. Keep Ollama running, then start the app:

```bash
OLLAMA_MODEL=qwen2.5:3b npm start
```

On Windows PowerShell, use:

```powershell
$env:OLLAMA_MODEL="qwen2.5:3b"
npm start
```

The app backend calls Ollama at `http://127.0.0.1:11434` by default. You can set `OLLAMA_URL` if your local Ollama endpoint differs.

## Privacy notes

- Saved invoice records stay in the current browser's local storage unless the user clears them.
- In local mode, generation prompts are sent to the configured Ollama endpoint. Keep it on a trusted machine/network.
- Demo mode uses a deterministic template and does not call an external AI service.
- This starter does not upload, OCR, or parse invoice files. Users enter invoice details manually.
- Avoid using real sensitive client information until you have reviewed the app's security and privacy behavior.

## Roadmap

- [ ] CSV export and import
- [ ] Receipt OCR using an open-source OCR engine
- [ ] Due-date reminders
- [ ] Per-client email tone presets
- [ ] Automated tests and accessibility checks
- [ ] Optional encrypted local database
- [ ] Feedback from a real freelancer or small-business owner

## Hackathon validation plan

1. Show the app to one freelancer or small business owner.
2. Ask them to draft one real (non-sensitive or anonymized) follow-up email.
3. Ask what they would change and whether it saves enough time to be useful.
4. Record honest feedback; do not claim a paying customer unless one actually pays.

## Contributing

Issues and pull requests are welcome. Start with the roadmap, include reproduction steps for bugs, and keep privacy in mind.

## License

MIT — see `LICENSE`.
