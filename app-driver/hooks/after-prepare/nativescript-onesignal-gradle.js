var path = require("path");
var fs = require("fs");
module.exports = function ($logger, $projectData, hookArgs) {
  var platform = (
    hookArgs.platform ||
    (hookArgs.prepareData && hookArgs.prepareData.platform)
  ).toLowerCase();
  function updateAppGradleScript(file) {
    var appBuildGradleContent = fs.readFileSync(file).toString();
    if (!appBuildGradleContent.match(/.*onesignal.*/)) {
      $logger.trace("Configuring Onesignal for Android");
      var search = -1;

      search = appBuildGradleContent.indexOf(
        'apply plugin: "com.android.application"'
      );
      if (search == -1) {
        return;
      }
      appBuildGradleContent =
        appBuildGradleContent.substr(0, search + 39) +
        `
apply plugin: "com.onesignal.androidsdk.onesignal-gradle-plugin"
` +
        appBuildGradleContent.substr(search + 39);

      appBuildGradleContent =
        appBuildGradleContent +
        `
          configurations.all {
              resolutionStrategy.eachDependency { DependencyResolveDetails details ->
                  def requested = details.requested
                  if (requested.group == 'com.android.support') {
                      if (!requested.name.startsWith("multidex")) {
                          details.useVersion '28.0.0'
                      }
                  }
              }
          }
      `;

      fs.writeFileSync(file, appBuildGradleContent);
      $logger.trace("Written build.gradle");
    }
  }

  function updateGradleScript(file) {
    var buildGradleContent = fs.readFileSync(file).toString();
    if (!buildGradleContent.match(/.*onesignal.*/)) {
      $logger.trace("Configuring Onesignal for Android");
      var search = -1;

      var repositories = buildGradleContent.match(/repositories {([^}]+)}/gm);
      if (!repositories) {
        return;
      }
      search =
        buildGradleContent.indexOf(repositories[0]) -
        1 +
        repositories[0].length -
        1;
      buildGradleContent =
        buildGradleContent.substr(0, search) +
        `
	      maven { url "https://plugins.gradle.org/m2/" }
` +
        buildGradleContent.substr(search);

      search = buildGradleContent.indexOf("dependencies", search);
      if (search == -1) {
        return;
      }
      search = buildGradleContent.indexOf("}", search);
      if (search == -1) {
        return;
      }

      buildGradleContent =
        buildGradleContent.substr(0, search - 1) +
        `
            classpath "gradle.plugin.com.onesignal:onesignal-gradle-plugin:[0.10.1, 0.99.99]"
      ` +
        buildGradleContent.substr(search - 1);

      fs.writeFileSync(file, buildGradleContent);
      $logger.trace("Written build.gradle");
    }
  }

  if (platform === "android") {
    var androidPlatformDir = path.join(
      __dirname,
      "..",
      "..",
      "platforms",
      "android"
    );
    var androidAppPlatformDir = path.join(
      __dirname,
      "..",
      "..",
      "platforms",
      "android",
      "app"
    );
    var gradleScript = path.join(androidPlatformDir, "build.gradle");
    var gradleAppScript = path.join(androidAppPlatformDir, "build.gradle");

    if (fs.existsSync(gradleAppScript)) {
      updateAppGradleScript(gradleAppScript);
      updateGradleScript(gradleScript);
    } else {
      updateGradleScript(gradleScript);
    }
  }
};
