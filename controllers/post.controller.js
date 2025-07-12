const cloudinary = require("../config/cloudinary");

module.exports.uploadToDiskStorage = async (req, res) => {
  res.status(200).send({
    file: req.file,
    body: req.body,
  });
};

module.exports.multipleUploadToDiskStorage = async (req, res) => {
  res.status(200).send({
    file: req.file,
    files: req.files,
    body: req.body,
  });
};

module.exports.uploadToCloudinary = async (req, res) => {
  try {
    
    const uploadedDetails = await cloudinary.uploader.upload(req.file.path);

    const { secure_url, public_id: image_id } = uploadedDetails;

    res.send({
      data: {
        secure_url,
        image_id,
      },
    });
  } catch (err) {
    res.send({
      err,
    });
  }
};
