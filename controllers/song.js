const path = require("path");
const fs = require("fs");

exports.streamingSong = async (req, res, next) => {
  const audioFolderPath = path.join(__dirname, "../uploads/audio");
  const filename = req.params.filename;
  // console.log(filename)
  const filePath = path.join(audioFolderPath, filename);

  try {
    if(!fs.existsSync(filePath)){
        const error = new Error('The file does not exist. ')
        error.statusCode = 422
        throw error
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    const stream = fs.createReadStream(filePath)
    stream.pipe(res)

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};
