export function detectLang(filename) {
  let lang = "text";
  if (filename.endsWith(".js")) {
    lang = "js";
  } else if (filename.endsWith(".css")) {
    lang = "css";
  } else if (filename.endsWith(".html")) {
    lang = "html";
  } else if (filename.endsWith(".json")) {
    lang = "json";
  }
  if (filename.endsWith(".md")) {
    lang = "markdown";
  }
  if (filename.endsWith(".ts")) {
    lang = "typescript";
  }
  if (filename.endsWith(".tsx")) {
    lang = "tsx";
  }
  if (filename.endsWith(".jsx")) {
    lang = "jsx";
  }
  if (filename.endsWith(".vue")) {
    lang = "vue";
  }
  if (filename.endsWith(".scss")) {
    lang = "scss";
  }
  if (filename.endsWith(".sass")) {
    lang = "sass";
  }
  if (filename.endsWith(".less")) {
    lang = "less";
  }
  if (filename.endsWith(".py")) {
    lang = "python";
  }
  if (filename.endsWith(".rb")) {
    lang = "ruby";
  }
  if (filename.endsWith(".h")) {
    lang = "c";
  }
  if (filename.endsWith(".cpp")) {
    lang = "cpp";
  }
  if (filename.endsWith(".cs")) {
    lang = "csharp";
  }
  if (filename.endsWith(".html")) {
    lang = "html";
  }
  if (filename.endsWith(".java")) {
    lang = "java";
  }

  return lang;
}
