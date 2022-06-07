const fs = require("fs");
const { exec } = require("child_process");

const ICONS_FOLDER = "icons";
const DIST_JS_PATTERN = "dist/js/*.js";
const DIST_IMG_PATTERN = "dist/img";

const iconsFolderPath = `${__dirname}/${ICONS_FOLDER}`;

fs.readdirSync(iconsFolderPath).forEach((file) => {
  const [fileName] = file.split(".");

  const rootPath = __dirname.split("src")[0].slice(0, -1);
  const searchJsPattern = `${rootPath}/${DIST_JS_PATTERN}`;
  const searchImgPattern = `${rootPath}/${DIST_IMG_PATTERN}`;

  const findIconInJsFilesCmd = `find ${searchJsPattern} -type  f -exec grep -l "\\"${fileName}\\"" {} \\; -quit`;
  const removeIconCmd = `find ${searchImgPattern} -type f -name "${fileName}.*.svg" -exec rm -f {} \\; -quit`;

  exec(findIconInJsFilesCmd, (error, filePath) => {
    if (error !== null) {
      throw Error(`Search icons error: ${error}`);
    }

    if (!filePath) {
      exec(removeIconCmd);
    }
  });
});

// eslint-disable-next-line no-console
console.log("Unused icons removed from build! 🤘🤘🤘 (from OurSvgIcon component)");
