const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const PostModel = mongoose.model("PostModel");
/* import middleware */
const protectedRoute = require("../middleware/protectedResources");

/*create tweet */
router.post("/api/auth/createtweet", protectedRoute, (req, res) => {
    const { description, image } = req.body;
    if (!description || !image) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }
    req.user.password = undefined;
    const postObj = new PostModel({ description: description, image: image, author: req.user });
    postObj.save()
        .then((newPost) => {
            res.status(201).json({ post: newPost });
        })
        .catch((error) => {
            console.log(error);
        })
});

/*get all tweet */
router.get("/api/auth/alltweet", (req, res) => {
    PostModel.find()
        .populate("author", "_id fullName userName profileImg")
        .populate("comments.commentedBy", "_id fullName userName")
        .then((dbPosts) => {
            res.status(200).json({ posts: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});

/* get all tweet logged in */
router.get("/api/auth/allmytweet", protectedRoute, (req, res) => {
    PostModel.find({ author: req.user._id })
        .populate("author", "_id fullName userName profileImg")
        .then((dbPosts) => {
            res.status(200).json({ posts: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});

/* delete tweet */
router.delete("/api/auth/deletetweet/:postId",protectedRoute, (req, res) => {
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

/* like tweet */
router.put("/api/auth/like", protectedRoute, (req, res) => {
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

/* unlike tweet */
router.put("/api/auth/unlike", protectedRoute, (req, res) => {
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
router.put("/api/auth/comment", protectedRoute, (req, res) => {

    const comment = { commentText: req.body.commentText, commentedBy: req.user._id }

    PostModel.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true //returns updated record
    }).populate("comments.commentedBy", "_id fullName") //comment owner
        .populate("author", "_id fullName")// post owner
        .then((error, result) => {
            if (error) {
                return res.status(200).json({ error: error });
            } else {
                res.json(result);
            }
        })
});

/* retweet */
router.put("/api/auth/retweet", protectedRoute, (req, res) => {
    PostModel.findByIdAndUpdate(req.body.postId, {
        $push: { retweet: req.user._id }
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


module.exports = router;

