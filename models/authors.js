let mongoose=require("mongoose");

let authorSchema=mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name:{
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    dob:Date,
    address:{
        state:{
            type:String,
            validate:{
                validator:function(newState){
                    return newState.length>=2 && newState.length<=3
                },
                message:"The state must be more than 2 characters and less than 3 characters"
            }
        },
        suburb:String,
        street:String,
        unit:Number
    },
    numBooks:{
        type:Number,
        min:1,
        max:150
    }

});

module.exports=mongoose.model("Authors",authorSchema);