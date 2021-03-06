let Post = require('../models/posts.js');
let User = require('../models/users.js');
let Comment = require('../models/comments.js');
let PostLikeUsers = require('../models/postLikeUsers.js');
let CommentController = require('./comments.js');

module.exports = {
  
  addPost: function(req, res){
    let post = req.body;
    let GMT = new Date();
    let local = new Date(GMT.valueOf() + 120 * 60000);
    let date = local.toUTCString().substr(0, 12);
    let time = local.toUTCString().substring(17, 22);
    post.created_at ={date : date,time: time};

    return Post.create(post, (err, newPost) => {
      if(err){
        res.json(err);
      } else {
        res.json({id: post._id}); 
      }     
    });
  },
  
  getAllChallengePosts: function(challengId, callback){
    Post.find({challenge_id: challengId})
      .exec( (err, posts) => {
        if(err){
          callback(null);
          } else {
            let arr = posts;
            let postsToGo = arr.length;
            if(!arr.length){
              callback([])
            }
            arr.forEach(function(post){
              PostLikeUsers.count({post_id: post._id})
                .exec( (err, count) => {
                  if(err){
                    callback(null);
                  }
                  else{
                    post.set('likes', count)
                    CommentController.findAllPostComments(post._id, (comments) => {
                      post.set('comments', comments)
                      let user_id = post.user_id
                      User.findOne({_id:user_id}).exec(
                        (err,user) =>{
                          if (err){
                            callback(null);
                          }
                          else{
                            post.set('owner',user)
                            if(--postsToGo === 0){
                              callback(arr);
                            }
                          }
                        })
                    })
                  } 
                }); 
            })
          } 
  	  })
  },

  getAllPosts: function(req, res){
    Post.find({})
      .exec( (err, posts) => {
        if(err){
          res.status(500).send("No posts")
          } else {
            let arr = posts;
            let postsToGo = arr.length;
            if(!arr.length){
              res.status(500).send("No posts")
            }
            arr.forEach(function(post){
              PostLikeUsers.count({post_id: post._id})
                .exec( (err, count) => {
                  if(err){
                    res.status(500).send("No likes") 
                  }
                  else{
                    post.set('likes', count)

                    CommentController.findAllPostComments(post._id, (comments) => {
                          post.set('comments', comments)
                          let user_id = post.user_id
                          User.findOne({_id:user_id}).exec(
                            (err,user) =>{
                              if (err){
                                res.status(500).send("No owner")   
                              }
                              else{
                                post.set('owner',user)
                                if(--postsToGo === 0){
                                  res.json(arr)
                                }
                              }
                            })
                    })
                  }
                    
                }); 
            })
          } 
      })
  }


}
