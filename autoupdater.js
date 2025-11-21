require("dotenv").config();
const { each } = require("async");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const {
  REPO_DIR,
  RAW_REPO_URL,
  BRANCH,
  USER,
  TOKEN,
  STARTUP_COMMAND,
  FORCED_FILES_DIR
} = process.env;

function checkForcedFilesFolder() {
  const forced_folders = path.resolve(FORCED_FILES_DIR);
  if (!fs.existsSync(forced_folders)) {
    console.log(`📁 Verzeichnis Forced Folrders existiert nicht.`);
    fs.mkdir(forced_folders);
    console.log(`✅ Verzeichnis erstellt.`);
    copyForcedFilesIntoMainDir();
  } else {
    console.log(`✅ Verzeichnis existiert.`);
    copyForcedFilesIntoMainDir();
  }
}



function copyForcedFilesIntoMainDir() {
  const forced_folders = path.resolve(FORCED_FILES_DIR);

  if (!FORCED_FILES_DIR) {
    console.log('ℹ️ Kein FORCED_FILES_DIR definiert. Keine Dateien zu kopieren.');
    executeStartupCommand();
    return;
  }

  if (!fs.existsSync(forced_folders)) {
    try {
      fs.mkdirSync(forced_folders, { recursive: true });
    } catch (mkdirErr) {
      console.error(`❌ Fehler beim Erstellen des Verzeichnisses '${forced_folders}':\n${mkdirErr}`);
      executeStartupCommand();
      return;
    }
  }

  fs.readdir(forced_folders, { withFileTypes: true }, (err, entries) => {
    if (err) {
      console.error(`❌ Fehler beim Lesen des Verzeichnisses '${forced_folders}':\n${err}`);
      executeStartupCommand();
      return;
    }

    const files = entries.filter((e) => e.isFile()).map((e) => e.name);
    if (files.length === 0) {
      executeStartupCommand();
      return;
    }

    let pending = files.length;
    files.forEach((file) => {
      const sourcePath = path.join(forced_folders, file);
      const destPath = path.join(path.resolve(REPO_DIR), file);

      try {
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      } catch (e) {
        console.error(`❌ Fehler beim Erstellen des Zielverzeichnisses für '${file}':\n${e}`);
      }

      fs.copyFile(sourcePath, destPath, (copyErr) => {
        if (copyErr) {
          console.error(`❌ Fehler beim Kopieren der Datei '${file}':\n${copyErr}`);
        }
        if (--pending === 0) {
          executeStartupCommand();
        }
      });
    });
  });
}


function getRepoURLWithToken() {
  const repo = new URL(RAW_REPO_URL);
  repo.username = USER;
  repo.password = TOKEN;
  return repo.toString();
}

function cloneRepo() {
  const remote = getRepoURLWithToken();
  console.log(`📁 Repo nicht vorhanden. Cloning '${remote}'...`);
  exec(`git clone -b ${BRANCH} ${remote} ${REPO_DIR}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ Fehler beim Git Clone:\n${stderr}`);
    } else {
      console.log(`✅ Git Clone erfolgreich:\n${stdout}`);
      checkForcedFilesFolder();
    }
  });
}

function pullRepo() {
  const remote = getRepoURLWithToken();
  console.log(`[${new Date().toLocaleTimeString()}] ⏬ Starte Git Pull...`);
  exec(`git pull ${remote} ${BRANCH}`, { cwd: REPO_DIR }, (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ Fehler beim Git Pull:\n${stderr}`);
      console.log(`🔄 Versuche REPO_DIR zu löschen und neu zu clonen...`);
      
      const dir = path.resolve(REPO_DIR);
      if (fs.existsSync(dir)) {
        console.log(`🗑️ Lösche Verzeichnis '${dir}'...`);
        try {
          fs.rmSync(dir, { recursive: true, force: true });
          console.log(`✅ Verzeichnis gelöscht.`);
          cloneRepo();
        } catch (deleteErr) {
          console.error(`❌ Fehler beim Löschen des Verzeichnisses:\n${deleteErr}`);
        }
      } else {
        cloneRepo();
      }
    } else {
      console.log(`✅ Git Pull erfolgreich:\n${stdout}`);
      checkForcedFilesFolder();
    }
  });
}

function executeStartupCommand() {
  if (!STARTUP_COMMAND) {
    console.log('ℹ️ Kein STARTUP_COMMAND definiert.');
    process.exit(0);
  }

  console.log(`🚀 Führe STARTUP_COMMAND aus: ${STARTUP_COMMAND}`);
  console.log(`📋 AutoUpdater wird beendet, Server-Logs werden angezeigt...\n`);
  
  const repoPath = path.resolve(REPO_DIR);
  
  const { spawn } = require('child_process');
  const serverProcess = spawn(STARTUP_COMMAND, [], { 
    cwd: repoPath, 
    shell: true,
    stdio: 'inherit'
  });

  serverProcess.on('error', (err) => {
    console.error(`❌ Fehler beim Starten des Servers:\n${err}`);
    process.exit(1);
  });
}

function start() {
  console.log("👾 AutoUpdater made by LittleDevGhost");
  console.log("🔧 Git Pull Setup:");
  console.log(`📦 Repo URL (raw): ${RAW_REPO_URL}`);
  console.log(`🌿 Branch: ${BRANCH}`);
  console.log(`👤 Username: ${USER}`);
  console.log(`🔐 Token gesetzt: ${TOKEN?.length > 0 ? "✅" : "❌"}`);
  console.log(`📁 Zielverzeichnis: ${REPO_DIR}`);

  if (!REPO_DIR) {
    console.error("❌ REPO_DIR ist nicht definiert!");
    process.exit(1);
  }

  const fullPath = path.resolve(REPO_DIR);
  console.log(`🔍 Prüfe ob Verzeichnis '${fullPath}' existiert...`);
  
  if (!fs.existsSync(fullPath) || !fs.existsSync(path.join(fullPath, ".git"))) {
    console.log(`📁 Verzeichnis existiert nicht oder ist kein Git-Repository.`);
    cloneRepo();
  } else {
    console.log(`✅ Verzeichnis existiert.`);
    pullRepo();
  }
}

start();