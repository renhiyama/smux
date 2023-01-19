export default function () {
  return <></>;
}

export function specialFolders(foldername) {
  let folder = null;
  switch (foldername) {
    case "node_modules":
      folder = "node_modules";
      break;
    case "app":
      folder = "app";
      break;
    case "api":
      folder = "api";
      break;
    case "config":
      folder = "config";
      break;
    case "public":
      folder = "public";
      break;
    case "views":
      folder = "view";
      break;
    case "view":
      folder = "view";
      break;
    case "routes":
      folder = "route";
      break;
    case "route":
      folder = "route";
      break;
    case "controllers":
      folder = "controllers";
      break;
    case "models":
      folder = "model";
      break;
    case "model":
      folder = "model";
      break;
    case "helpers":
      folder = "helper";
      break;
    case "helper":
      folder = "helper";
      break;
    case "middlewares":
      folder = "middleware";
      break;
    case "middleware":
      folder = "middleware";
      break;
    case "services":
      folder = "services";
      break;
    case "test":
      folder = "test";
      break;
    case "tests":
      folder = "test";
      break;
    case "database":
      folder = "database";
      break;
    case "db":
      folder = "database";
      break;
    case "dist":
      folder = "dist";
      break;
    case "build":
      folder = "build";
      break;
    case ".git":
      folder = "git";
      break;
    case ".github":
      folder = "github";
      break;

    default:
      //do nothing
      break;
  }
  return folder;
}
