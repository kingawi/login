const createImage = function(tutorialId, image) {
    return db.Image.create(image).then(docImage => {
      console.log("\n>> Created Image:\n", docImage);
      return db.Tutorial.findByIdAndUpdate(
        tutorialId,
        {
          $push: {
            images: {
              _id: docImage._id,
              url: docImage.url,
              caption: docImage.caption
            }
          }
        },
        { new: true, useFindAndModify: false }
      );
    });
  };
  
  const createComment = function(tutorialId, comment) {
    return db.Comment.create(comment).then(docComment => {
      console.log("\n>> Created Comment:\n", docComment);
  
      return db.Tutorial.findByIdAndUpdate(
        tutorialId,
        { $push: { comments: docComment._id } },
        { new: true, useFindAndModify: false }
      );
    });
  };