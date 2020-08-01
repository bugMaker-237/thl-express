const path = require("path");
const fs = require("fs");
const {
    spawn,
} = require("child_process");
const projectRoot = path.resolve(__dirname, "../../");
const appMobileDir = path.resolve(projectRoot, "app.mobile");
const appWebDir = path.resolve(projectRoot, "app.web");

const mobileDependencies = [{
        name: "nativescript-localstorage",
        version: "2.0.1",
    },
    {
        name: "nativescript-ui-dataform",
        version: "5.1.1",
    },
    {
        name: "nativescript-linearprogressbar",
        version: "1.0.4",
    },
];
const webDependencies = [{
    name: "@angular/material",
    version: "8.1.4",
}, {
    name: "@angular/service-worker",
    version: "8.2.5",
}, {
    name: "@angular/flex-layout",
    version: "8.0.0",
}];

function run() {
    prepareDependencies();
    prepareAssets();
    prepareFontIcons();
    console.log("Prepare Done.");
}

function prepareFontIcons() {
    var source = path.join(projectRoot, "submodules", "apps.common", "fonts");
    var target1 = path.join(projectRoot, "app.mobile", "src");
    console.log("Preparing mobile fontIcons...");
    copyFolderRecursiveSync(source, target1);
}

function prepareAssets() {
    var source = path.join(projectRoot, "submodules", "apps.common", "assets");
    var target1 = path.join(projectRoot, "app.mobile", "src");
    var target2 = path.join(projectRoot, "app.web", "src");
    console.log("Preparing mobile target assets...");
    copyFolderRecursiveSync(source, target1);
    console.log("Preparing web target assets...");
    copyFolderRecursiveSync(source, target2);
}

function prepareDependencies() {
    console.log("Preparing mobile target dependencies...");
    var mobilePackageJson = getPackageJson("mobile");
    installIfAbsent(mobileDependencies, mobilePackageJson);
    console.log("Preparing web target dependencies...");
    var webPackageJson = getPackageJson("web");
    installIfAbsent(webDependencies, webPackageJson);
}

function installIfAbsent(dependencies, packageJson, type) {
    var unmetDependencies = [];
    dependencies.forEach(dep => {
        var depIndex = Object.keys(packageJson.dependencies).indexOf(dep.name);
        if (depIndex < 0 ||
            numberize(packageJson.dependencies[dep.name]) < dep.version) {
            console.log(`${dep.name} is absent...`);
            unmetDependencies.push(dep.name);
        }
    });
    if (unmetDependencies.length > 0) {
        var isWeb = type === "web";
        console.log(`Insalling : unmeet peer dependencies`);
        console.log(appWebDir);
        spawn(isWeb ? "ng" : "npm", [isWeb ? "add" : "install", ...unmetDependencies], {
            cwd: isWeb ? appWebDir : appMobileDir,
            env: process.env,
            shell: true,
            stdio: ["inherit", "inherit"],
        }).on("close", function() {
            console.log("Installation finished");
        });
    }
}
/**
 *
 * @param {string} str
 */
function numberize(str) {
    return (Number.isInteger(str[0]) ? str : str.slice(1)).split("-")[0];
}

function getPackageJson(type) {
    var packageJsonPath = path.resolve(projectRoot, "app." + type, "package.json");
    if (!fs.existsSync(packageJsonPath)) {
        throw new Error(`package.json not found in ${type} project`);
    }

    return require(packageJsonPath);
}

function copyFolderRecursiveSync(source, target) {
    var files = [];

    //check if folder needs to be created or integrated
    var targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }

    //copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function(file) {
            var curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                console.log("Copying " + curSource);
                fs.copyFileSync(curSource, path.join(targetFolder, file));
            }
        });
    }
}

run();
