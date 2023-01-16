import WebSocket, { WebSocketServer } from "ws";
import fs from "fs";
import os from "os";
import path from "path";
import child_process from "child_process";
const homedir = os.homedir();

// Create a WebSocket server
const wss = new WebSocketServer({ port: 8080 });
// Listen for new connections
wss.on("connection", (ws) => {
  ws._send = ws.send;
  ws.send = (m) => {
    ws._send(m);
    console.log("Sent: ", JSON.parse(m));
  };
  ws.send(
    JSON.stringify({ type: "connected", message: "Connected to the server" })
  );
  ws.on("message", (message) => {
    //parse json msg
    let msg;
    try {
      msg = JSON.parse(message);
    } catch (e) {
      ws.send(JSON.stringify({ error: "Invalid JSON" }));
      return;
    }
    console.log(msg);
    switch (msg.type) {
      case "projects":
        {
          //create folder if not exist
          if (!fs.existsSync(`${homedir}/smux/projects`)) {
            console.log("[*] Creating projects folder");
            //recursive create
            fs.mkdirSync(`${homedir}/smux/projects`, { recursive: true });
          }
          //send projects
          ws.send(
            JSON.stringify({
              type: "projects",
              projects: fs.readdirSync(`${homedir}/smux/projects`),
            })
          );
        }
        break;
      case "open_project":
        {
          //send file directory structure
          let files = [];
          let dirs = [];
          let dir = `${homedir}/smux/projects/${msg.project}`;
          let dir_files = fs.readdirSync(dir);
          for (let i = 0; i < dir_files.length; i++) {
            let file = dir_files[i];
            let file_path = path.join(dir, file);
            let stat = fs.statSync(file_path);
            if (stat.isDirectory()) {
              dirs.push(file);
            } else {
              files.push(file);
            }
          }
          //remove .git folder
          dirs = dirs.filter((dir) => dir !== ".git");
          ws.send(
            JSON.stringify({
              type: "open_project",
              files,
              dirs,
            })
          );
        }
        break;
      case "create_project":
        {
          //create project folder
          fs.mkdirSync(`${homedir}/smux/projects/${msg.project}`);
          //send projects
          ws.send(
            JSON.stringify({
              type: "create_project",
              status: "success",
            })
          );
        }
        break;
      case "delete_project":
        {
          //delete project folder
          console.log(`[*] Deleting project ${msg.project}`);
          fs.rmSync(`${homedir}/smux/projects/${msg.project}`, {
            recursive: true,
            force: true,
          });
          ws.send(
            JSON.stringify({
              type: "delete_project",
              status: "success",
            })
          );
        }
        break;
      case "create_file":
        {
          //create file
          //check if folder exists
          if (
            !fs.existsSync(
              `${homedir}/smux/projects/${msg.project}/${msg.file
                .split("/")
                .slice(0, -1)
                .join("/")}`
            )
          ) {
            //create folder
            fs.mkdirSync(
              `${homedir}/smux/projects/${msg.project}/${msg.file
                .split("/")
                .slice(0, -1)
                .join("/")}`,
              { recursive: true }
            );
          }
          fs.writeFileSync(
            `${homedir}/smux/projects/${msg.project}/${msg.file}`,
            ""
          );
          ws.send(
            JSON.stringify({
              type: "create_file",
              status: "success",
            })
          );
        }
        break;
      case "delete_file":
        {
          //delete file
          fs.unlinkSync(`${homedir}/smux/projects/${msg.project}/${msg.file}`);
          ws.send(
            JSON.stringify({
              type: "delete_file",
              status: "success",
            })
          );
        }
        break;
      case "create_folder":
        {
          //create folder
          fs.mkdirSync(
            `${homedir}/smux/projects/${msg.project}/${msg.folder}`,
            {
              recursive: true,
            }
          );
          ws.send(
            JSON.stringify({
              type: "create_folder",
              status: "success",
            })
          );
        }
        break;
      case "delete_folder":
        {
          //delete folder
          fs.rmdirSync(`${homedir}/smux/projects/${msg.project}/${msg.folder}`);
          ws.send(
            JSON.stringify({
              type: "delete_folder",
              status: "success",
            })
          );
        }
        break;
      case "read_file":
        {
          //if file is more than 512kb, send error
          if (
            fs.statSync(`${homedir}/smux/projects/${msg.project}/${msg.file}`)
              .size > 524288
          ) {
            ws.send(
              JSON.stringify({
                type: "read_file",
                status: "error",
                error: "File is too large",
              })
            );
            return;
          }
          //read file
          ws.send(
            JSON.stringify({
              type: "read_file",
              status: "success",
              content: fs.readFileSync(
                `${homedir}/smux/projects/${msg.project}/${msg.file}`,
                "utf8"
              ),
            })
          );
        }
        break;
      case "write_file":
        {
          //write file
          fs.writeFileSync(
            `${homedir}/smux/projects/${msg.project}/${msg.file}`,
            msg.content
          );
          ws.send(
            JSON.stringify({
              type: "write_file",
              status: "success",
            })
          );
        }
        break;
      case "list_files":
        {
          //list files and folders of project
          let files = [];
          let dirs = [];
          let dir = `${homedir}/smux/projects/${msg.project}/${msg.path}`;
          let dir_files = fs.readdirSync(dir);
          for (let i = 0; i < dir_files.length; i++) {
            let file = dir_files[i];
            let file_path = path.join(dir, file);
            let stat = fs.statSync(file_path);
            if (stat.isDirectory()) {
              dirs.push(file);
            } else {
              files.push(file);
            }
          }
          //exclude .git folder
          dirs = dirs.filter((dir) => dir !== ".git");
          ws.send(
            JSON.stringify({
              type: "list_files",
              files,
              dirs,
              path: msg.path,
            })
          );
        }
        break;
      case "clone":
        {
          //clone project by spawning git process
          let git = child_process.spawn("git", [
            "clone",
            msg.url,
            `${homedir}/smux/projects/${
              msg.project || msg.url.split("/").slice(-1)[0].replace(".git", "")
            }`,
          ]);
          git.stdout.on("data", (data) => {
            ws.send(
              JSON.stringify({
                type: "clone",
                status: "stdout",
                data: data.toString(),
              })
            );
            console.log(`[*] ${data.toString()}`);
          });
          git.stderr.on("data", (data) => {
            ws.send(
              JSON.stringify({
                type: "clone",
                status: "stderr",
                data: data.toString(),
              })
            );
            console.log(`[*] ${data.toString()}`);
          });
          git.on("close", (code) => {
            ws.send(
              JSON.stringify({
                type: "clone",
                status: "close",
                code: code,
              })
            );
            console.log(
              `[*] Cloned project ${
                msg.project ||
                msg.url.split("/").slice(-1)[0].replace(".git", "")
              }`
            );
          });
        }
        break;
      default:
        ws.send(JSON.stringify({ error: "Invalid message type" }));
        break;
    }
  });
});
console.log("[*] WebSocket server started on port 8080");
