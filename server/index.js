#!/usr/bin/env node
import { serve } from "@hono/node-server"; // Write above `Hono`
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { cors } from "hono/cors";
import fs from "fs";
import path from "path";
import os from "os";
import child_process from "child_process";
import { WebSocketServer } from "ws";
import { fileURLToPath, URL } from "url";

const serverFilePath = fileURLToPath(import.meta.url);
const serverDir = path.dirname(serverFilePath);

let homedir = os.homedir();
let wsPort = parseInt(process.env.WS_PORT || process.env.PORT || 8080) + 1;
let wsServer = new WebSocketServer({ port: wsPort });

const app = new Hono();

app.use("*", cors());
app.use("*", async (c, next) => {
  await next();
  c.header("Access-Control-Allow-Private-Network", "true");
});
app.get("/", (c) => {
  return c.json({ message: "ONLINE" });
});

app.get("/ws", (c) => {
  return c.json({ port: wsPort });
});

app.get("/projects", (c) => {
  // Get all projects from ~/smux/projects
  let projects = fs.readdirSync(path.join(homedir, "smux/projects"));
  return c.json({ projects });
});

app.get("/projects/:project", (c) => {
  // get all files and folders from ~/smux/projects/:project
  let project = c.req.param("project");
  project = decodeURIComponent(project);
  try {
    let all = fs.readdirSync(path.join(homedir, "smux/projects", project));
    let files = [];
    let folders = [];
    all.forEach((item) => {
      if (
        fs
          .lstatSync(path.join(homedir, "smux/projects", project, item))
          .isDirectory()
      ) {
        folders.push(item);
      } else {
        files.push(item);
      }
    });
    folders = folders.filter((item) => item !== ".git");
    return c.json({ files, folders });
  } catch (e) {
    return c.json({ error: "Project not found" });
  }
});

// create new project
app.post("/projects/new", async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch (e) {
    return c.json({ error: "Invalid JSON" });
  }
  if (!body.name) {
    return c.json({ error: "Missing name" });
  }
  let name = body.name;
  let projectPath = path.join(homedir, "smux/projects", name);
  if (fs.existsSync(projectPath)) {
    return c.json({ error: "Project already exists" });
  }
  fs.mkdirSync(projectPath);
  return c.json({ message: "Project created", name });
});

// delete project
app.delete("/projects/:project", async (c) => {
  let project = c.req.param("project");
  project = decodeURIComponent(project);
  let projectPath = path.join(homedir, "smux/projects", project);
  if (!fs.existsSync(projectPath)) {
    return c.json({ error: "Project does not exist" });
  }
  fs.rmdirSync(projectPath, { recursive: true, force: true });
  return c.json({ message: "Project deleted", name: project });
});

// create new file
app.post("/projects/:project/new/file", async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch (e) {
    return c.json({ error: "Invalid JSON" });
  }
  if (!body.file) {
    return c.json({ error: "Missing file" });
  }
  if (!body.content) {
    body.content = "";
  }
  let project = c.req.param("project");
  project = decodeURIComponent(project);
  let file = body.file;
  let content = body.content;
  let projectPath = path.join(homedir, "smux/projects", project);
  if (!fs.existsSync(projectPath)) {
    return c.json({ error: "Project does not exist" });
  }
  let filePath = path.join(projectPath, file);
  if (fs.existsSync(filePath)) {
    return c.json({ error: "File already exists" });
  }
  //get the folder of the file, and check if it exists, if not, recursively create it
  let folder = path.dirname(`${homedir}/smux/projects/${project}/${file}`);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  fs.writeFileSync(filePath, content);
  return c.json({ message: "File created", file });
});

// create new folder
app.post("/projects/:project/new/folder", async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch (e) {
    return c.json({ error: "Invalid JSON" });
  }
  if (!body.folder) {
    return c.json({ error: "Missing folder" });
  }
  let project = c.req.param("project");
  project = decodeURIComponent(project);
  let folder = body.folder;
  let projectPath = path.join(homedir, "smux/projects", project);
  if (!fs.existsSync(projectPath)) {
    return c.json({ error: "Project does not exist" });
  }
  let folderPath = path.join(projectPath, folder);
  if (fs.existsSync(folderPath)) {
    return c.json({ error: "Folder already exists" });
  }
  fs.mkdirSync(folderPath);
  return c.json({ message: "Folder created", folder });
});

// delete file
app.delete("/projects/:project/file/:file", async (c) => {
  let project = c.req.param("project");
  project = decodeURIComponent(project);
  let file = c.req.param("file");
  //urldecode file
  file = decodeURIComponent(file);
  let projectPath = path.join(homedir, "smux/projects", project);
  if (!fs.existsSync(projectPath)) {
    return c.json({ error: "Project does not exist" });
  }
  let filePath = path.join(projectPath, file);
  if (!fs.existsSync(filePath)) {
    return c.json({ error: "File does not exist" });
  }
  fs.unlink(filePath, (err) => {
    if (err) {
      return c.json({ error: "Failed to delete file" });
    }
    return c.json({ message: "File deleted", file });
  });
});

// delete folder
app.delete("/projects/:project/folder/:folder", async (c) => {
  let project = c.req.param("project");
  project = decodeURIComponent(project);
  let folder = c.req.param("folder");
  //urldecode folder
  folder = decodeURIComponent(folder);
  let projectPath = path.join(homedir, "smux/projects", project);
  if (!fs.existsSync(projectPath)) {
    return c.json({ error: "Project does not exist" });
  }
  let folderPath = path.join(projectPath, folder);
  if (!fs.existsSync(folderPath)) {
    return c.json({ error: "Folder does not exist" });
  }
  fs.rmdir(folder, { recursive: true, force: true }, (err) => {
    if (err) {
      return c.json({ error: "Failed to delete folder" });
    }
    return c.json({ message: "Folder deleted", folder });
  });
});

// read file
app.get("/projects/:project/file/:file", async (c) => {
  let project = c.req.param("project");
  project = decodeURIComponent(project);
  let file = c.req.param("file");
  //urldecode file
  file = decodeURIComponent(file);
  let projectPath = path.join(homedir, "smux/projects", project);
  if (!fs.existsSync(projectPath)) {
    return c.json({ error: "Project does not exist" });
  }
  let filePath = path.join(projectPath, file);
  if (!fs.existsSync(filePath)) {
    return c.json({ error: "File does not exist" });
  }
  let content = fs.readFileSync(filePath, "utf8");
  return c.json({ message: "File read", file, content });
});

//read folder contents
app.get("/projects/:project/folder/:folder", async (c) => {
  let project = c.req.param("project");
  project = decodeURIComponent(project);
  let folder = c.req.param("folder");
  //urldecode folder
  folder = decodeURIComponent(folder);
  let projectPath = path.join(homedir, "smux/projects", project);
  if (!fs.existsSync(projectPath)) {
    return c.json({ error: "Project does not exist" });
  }
  let folderPath = path.join(projectPath, folder);
  if (!fs.existsSync(folderPath)) {
    return c.json({ error: "Folder does not exist" });
  }
  let all = fs.readdirSync(folderPath);
  let files = [];
  let folders = [];
  for (let i = 0; i < all.length; i++) {
    let item = all[i];
    let itemPath = path.join(folderPath, item);
    let stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      folders.push(item);
    } else {
      files.push(item);
    }
  }
  return c.json({ message: "Folder read", folder, files, folders });
});

// write file
app.post("/projects/:project/file/:file", async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch (e) {
    return c.json({ error: "Invalid JSON" });
  }
  if (!body.content) {
    return c.json({ error: "Missing content" });
  }
  let project = c.req.param("project");
  project = decodeURIComponent(project);
  let file = c.req.param("file");
  //urldecode file
  file = decodeURIComponent(file);
  let content = body.content;
  let projectPath = path.join(homedir, "smux/projects", project);
  if (!fs.existsSync(projectPath)) {
    return c.json({ error: "Project does not exist" });
  }
  let filePath = path.join(projectPath, file);
  if (!fs.existsSync(filePath)) {
    return c.json({ error: "File does not exist" });
  }
  fs.writeFileSync(filePath, content);
  return c.json({ message: "File written", file });
});

// rename file
app.put("/projects/:project/file/:file", async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch (e) {
    return c.json({ error: "Invalid JSON" });
  }
  if (!body.newName) {
    return c.json({ error: "Missing newName" });
  }
  let project = c.req.param("project");
  project = decodeURIComponent(project);
  let file = c.req.param("file");
  //urldecode file
  file = decodeURIComponent(file);
  let newName = body.newName;
  let projectPath = path.join(homedir, "smux/projects", project);
  if (!fs.existsSync(projectPath)) {
    return c.json({ error: "Project does not exist" });
  }
  let filePath = path.join(projectPath, file);
  if (!fs.existsSync(filePath)) {
    return c.json({ error: "File does not exist" });
  }
  let newFilePath = path.join(projectPath, newName);
  fs.rename(filePath, newFilePath, (err) => {
    if (err) {
      return c.json({ error: "Failed to rename file" });
    }
    return c.json({ message: "File renamed", file, newName });
  });
});

app.get("*", serveStatic({ root: serverDir }));

serve({
  fetch: app.fetch.bind(app),
  port: process.env.PORT || 8080,
});
console.log("[*] Server started on port", process.env.PORT || 8080);
