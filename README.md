# 👾 AutoUpdater

Ein automatisches Git-Update-Tool, das ein Repository klont/pullt und anschließend einen benutzerdefinierten Befehl ausführt.

## 📋 Features

- ✅ Automatisches Klonen von GitHub-Repositories
- 🔄 Automatisches Pullen von Updates
- 🛡️ Fehlerbehandlung mit automatischem Neuclonen bei Pull-Fehlern
- 🚀 Automatisches Ausführen eines Startup-Befehls nach erfolgreichem Update
- 🔐 Unterstützung für private Repositories mit Token-Authentifizierung

## 🔧 Installation

### Voraussetzungen

- Node.js (Version 14 oder höher)
- GitHub Personal Access Token (für private Repositories)

### Setup

1. **Repository klonen:**
   ```bash
   git clone https://github.com/Gohst101/AutoUpdater.git
   cd AutoUpdater
   ```

2. **Dependencies installieren:**
   ```bash
   npm install dotenv fs path ecex spawn
   ```

3. **`.env` Datei einstellen:**
   
   Stelle die .env datei mit deinen Daten ein

### 🔑 GitHub Token erstellen

1. Gehe zu GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Klicke auf "Generate new token (classic)"
3. Wähle die Berechtigung `repo` aus
4. Kopiere den generierten Token in die `.env` Datei

## ⚙️ Konfiguration

| Variable | Beschreibung | Beispiel |
|----------|--------------|----------|
| `RAW_REPO_URL` | Die URL des GitHub-Repositories | `https://github.com/user/repo` |
| `REPO_DIR` | Das lokale Verzeichnis für das Repository | `./website` |
| `BRANCH` | Der zu verwendende Git-Branch | `main` |
| `TOKEN` | GitHub Personal Access Token | `ghp_xxxxxxxxxxxxx` |
| `USERNAME` | Dein GitHub-Username | `Gohst101` |
| `STARTUP_COMMAND` | Befehl, der nach dem Update ausgeführt wird | `node server.js` |

## 🚀 Verwendung

### Manueller Start

```bash
node autoupdater.js
```

## 👨‍💻 Autor

**LittleDevGhost**

---

Made with ❤️ by LittleDevGhost
