const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const PostModel = mongoose.model("PostModel");
/* import middleware */
const protectedRoute = require("../middleware/protectedResources");

/* get all post */
router.get("/allposts", (req, res) => {
    PostModel.find()
        .populate("author", "_id fullName profileImg")
        .populate("comments.commentedBy", "_id fullName")
        .then((dbPosts) => {
            res.status(200).json({ posts: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});

/*get post only logged in */
router.get("/myallposts", protectedRoute, (req, res) => {
    PostModel.find({ author: req.user._id })
        .populate("author", "_id fullName profileImg")
        .then((dbPosts) => {
            res.status(200).json({ posts: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});

/*create post */
router.post("/createpost", protectedRoute, (req, res) => {
    const { description, location, image } = req.body;
    if (!description || !location || !image) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }
    req.user.password = undefined;
    const postObj = new PostModel({ description: description, location: location, image: image, author: req.user });
    postObj.save()
        .then((newPost) => {
            res.status(201).json({ post: newPost });
        })
        .catch((error) => {
            console.log(error);
        })
});

/* delete post */
router.delete("/deletepost/:postId",protectedRoute, (req, res) => {
    console.log("API is running")
    PostModel.findOne({ _id: req.params.postId })
        .populate("author", "_id")
        .then((postFound) => {
            if (!postFound) {
                return res.status(404).json({ error: "Post does not exist" });
            }
            //check if the post author is same as loggedin user only then allow deletion
            if (postFound.author._id.toString() === req.user._id.toString()) {
                postFound.deleteOne()
                    .then((data) => {
                        res.status(200).json({ result: data });
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        })
        .catch((err)=>{
            console.log(err)
        })
});
/* like post */
router.put("/like", protectedRoute, (req, res) => {
    PostModel.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true //returns updated record
    }).populate("author", "_id fullName")
        .then((error, result) => {
            if (result) {
                return res.status(400).json({result: result});
            } else {
                res.json(error);
            }
        });
        
});

/* unlike post */
router.put("/unlike", protectedRoute, (req, res) => {
    PostModel.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true //returns updated record
    }).populate("author", "_id fullName")
        .then((error, result) => {
            if (result) {
                return res.status(400).json({result: result});
            } else {
                res.json(error);
            }
        });
        
});

/* comments */
router.put("/comment", protectedRoute, (req, res) => {

    const comment = { commentText: req.body.commentText, commentedBy: req.user._id }

    PostModel.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true //returns updated record
    }).populate("comments.commentedBy", "_id fullName") //comment owner
        .populate("author", "_id fullName")// post owner
        .then((error, result) => {
            if (error) {
                return res.status(400).json({ error: error });
            } else {
                res.json(result);
            }
        })
        .catch((error)=>{
            console.error(error);
        })
        
        
});


module.exports = router;

