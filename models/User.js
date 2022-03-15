const { Schema, model } = require("mongoose");


// schema to create user model
 const userSchema = new Schema(
   {
     username: {
       type: String,
       required: true,
       unique: true,
       trim: true
     },
    
     email: {
       type: String,
       required: true,
       unique: true,
    //    https://www.codegrepper.com/code-examples/whatever/email+validation+in+mongoose
       match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
     },
     thoughts: [
         {
             type: Schema.Types.ObjectId,
             ref:'Thought'
         }
     ],
     friends: [
         {
             type:Schema.Types.ObjectId,
             ref:'User'
         }
     ],
   

     toJSON: {
       getters: true,
     },
     id:false
   }
 );
//  Create a virtual called `friendCount` that retrieves the length of the user's `friends` array field on query.
userSchema.virtual("friendCount").get(function(){
    return this.friends.lenght
})
// create var that will export 
const User = model('User', userSchema)
module.exports = User;