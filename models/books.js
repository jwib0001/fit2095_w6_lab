let mongoose=require("mongoose");

let bookSchema=mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    title:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Types.ObjectId,
        ref:"Authors"
    },
    isbn:{
        type:String,
        validate:{
            validator:function(newisbn){
                return newisbn.length==13
            },
            message:"The ISBN must be exactly 13 digits"
        }
    },
    dop:{
        type:Date,
        default:Date.now()
    },
    summary:String
});

module.exports=mongoose.model("Books",bookSchema);