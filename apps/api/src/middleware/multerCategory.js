import multer from "multer";

module.exports = {
  multerUploadCategory: () => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "./categoryImg");
      },

      filename: (req, file, cb) => {
        const filename = `Category-IMG-${new Date()}.${file.mimetype.split("/")[1]}`
        cb(null, filename);
      },
    });
    const fileFilter = (req, file, cb) => {
      const extFilter = ["jpg", "jpeg", "png"];
      const checkExt = extFilter.includes(
        file.mimetype.split("/")[1].toLowerCase()
      );

      if (checkExt) {
          const fileSizeLimit = 1024 * 1024
          if (file.size > fileSizeLimit) {
            cb(new Error("File size exceeds the maximum limit (1 MB)."));
          } else {
            cb(null, true);
          }
        } else {
          cb(new Error("File format not supported"));
        }
      };

    const limits = {
      fileSize: 1024 * 1024
    };


    return multer({ storage, fileFilter, limits });
  },
};
