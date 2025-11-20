require("dotenv").config();
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const {
  REPO_DIR,
  RAW_REPO_URL,
  BRANCH,
  USER,
  TOKEN,
  STARTUP_COMMAND
} = process.env;

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
      executeStartupCommand();
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
      executeStartupCommand();
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