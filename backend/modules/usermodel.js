import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    wishList:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"product"
    }],

    cart:[{
        product:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"product"
        },
        quantity:{
            type:Number,
            default:1,
            min:1
        }
    }]
    
},
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema)
export default User;