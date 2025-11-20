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
- Git muss auf dem System installiert sein
- GitHub Personal Access Token (für private Repositories)

### Setup

1. **Repository klonen:**
   ```bash
   git clone https://github.com/Gohst101/AutoUpdater.git
   cd AutoUpdater
   ```

2. **Dependencies installieren:**
   ```bash
   npm install
   ```

3. **`.env` Datei erstellen:**
   
   Erstelle eine `.env` Datei im Hauptverzeichnis mit folgendem Inhalt:
   ```env
   RAW_REPO_URL=https://github.com/USERNAME/REPOSITORY
   REPO_DIR=./website
   BRANCH=main
   TOKEN=your_github_token_here
   USERNAME=your_github_username
   STARTUP_COMMAND=node server.js
   ```

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

### Automatischer Start beim Systemstart (Windows)

1. Erstelle eine `.bat` Datei:
   ```batch
   @echo off
   cd C:\Pfad\zu\AutoUpdater
   node autoupdater.js
   ```

2. Füge die `.bat` Datei zum Autostart-Ordner hinzu:
   - Drücke `Win + R`
   - Tippe `shell:startup` und drücke Enter
   - Kopiere die `.bat` Datei in diesen Ordner

### Automatischer Start beim Systemstart (Linux)

Erstelle einen systemd Service:

```bash
sudo nano /etc/systemd/system/autoupdater.service
```

Füge folgenden Inhalt ein:
```ini
[Unit]
Description=AutoUpdater Service
After=network.target

[Service]
Type=simple
User=dein_username
WorkingDirectory=/pfad/zu/AutoUpdater
ExecStart=/usr/bin/node /pfad/zu/AutoUpdater/autoupdater.js
Restart=always

[Install]
WantedBy=multi-user.target
```

Aktiviere und starte den Service:
```bash
sudo systemctl enable autoupdater
sudo systemctl start autoupdater
```

## 📖 Wie es funktioniert

1. **Prüfung:** Der AutoUpdater prüft, ob das Repository-Verzeichnis existiert
2. **Klonen/Pullen:** 
   - Falls nicht vorhanden: Repository wird geklont
   - Falls vorhanden: Neueste Änderungen werden gepullt
3. **Fehlerbehandlung:** Bei Pull-Fehlern wird das Verzeichnis gelöscht und neu geklont
4. **Startup:** Nach erfolgreichem Update wird der konfigurierte `STARTUP_COMMAND` ausgeführt
5. **Übergabe:** Der AutoUpdater beendet sich und die Logs des gestarteten Servers werden angezeigt

## 🛠️ Troubleshooting

### "❌ Fehler beim Git Pull"
- Prüfe deine Internetverbindung
- Stelle sicher, dass Git installiert ist: `git --version`
- Der AutoUpdater versucht automatisch, das Repository neu zu klonen

### "❌ REPO_DIR ist nicht definiert"
- Überprüfe die `.env` Datei auf Vollständigkeit
- Stelle sicher, dass alle erforderlichen Variablen gesetzt sind

### Token funktioniert nicht
- Überprüfe, ob der Token noch gültig ist
- Stelle sicher, dass der Token die `repo`-Berechtigung hat
- Erstelle bei Bedarf einen neuen Token

## 📝 Lizenz

ISC

## 👨‍💻 Autor

**LittleDevGhost**

---

Made with ❤️ by LittleDevGhost
