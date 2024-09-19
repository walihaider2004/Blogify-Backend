const { createHmac , randomBytes } = require("crypto")
const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    fullName:{
        type: String,
        required: true
    
    },
    email:{
        type: String,
        required: true,
       unique:true
    },
    password:{
        type: String,
        required: true
    },
    salt:{
        type: String,
      
    },
    profileImageURL:{
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Fprofile%2520picture%2F&psig=AOvVaw1JjyQ4f6vHvQ2Jx3i6QV8M&ust=1629836638788000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCJj8w7K7g_ICFQAAAAAdAAAAABAD"
    },
    role:{
        type: String,
        enum: ['ADMIN','USER'],
        default: 'USER'
    }

},{timestamps:true});

userSchema.pre("save", function(next){
    const user = this;
    if(!user.isModified("password")) return;
     
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

userSchema.static('matchPassword', async function(email, password){
        const user =await this.findOne({email});
        if(!user) throw new Error('User not found!');

        const salt = user.salt;
        const hashedPassword = user.password;

        const userproviedHash = createHmac("sha256", salt).update(password).digest("hex");
            if(hashedPassword !== userproviedHash)throw new Error('Incorrect Password')
        return user;
})

const User = model('user', userSchema);

module.exports = User;