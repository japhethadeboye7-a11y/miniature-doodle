const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");

module.exports = {
  convertToDST: async (fileBuffer) => {
    const inputPath = path.join(__dirname, "temp_input.png");
    const outputPath = path.join(__dirname, "temp_output.dst");

    fs.writeFileSync(inputPath, fileBuffer);

    return new Promise((resolve, reject) => {
      execFile("python3", [path.join(__dirname, "convert_dst.py"), inputPath, outputPath], (error) => {
        if (error) return reject(error);

        const dstBuffer = fs.readFileSync(outputPath);

        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);

        resolve(dstBuffer);
      });
    });
  },
};
