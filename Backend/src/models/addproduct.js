import mongoose ,{ Schema } from 'mongoose';

const productSchema = new Schema({
    seller : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Seller',
        required : true,
    },
    name:{
        type : String,
        required : true,
        trim : true,
    },
    main_image : {
        type : String,
        required : true,
    },
    extra_image: {
        type: [String],
        validate: {
            validator: function (value) {
                return value.length <= 5;
            },
            message: "A product can have at most 3 extra images."
        }
    },
    description : {
        type : String,
        required : true,
    },
    sizes:{
        type: [String],
        enum: ["XS", "S", "M", "L", "XL", "XXL"],
        default : ["XS", "S", "M", "L", "XL", "XXL"],
    },
    category : {
        type: String,
        default : "fashion",
        required: true,
    },
    reviews :[{
        user: {
            type : mongoose.Schema.Types.ObjectId,
            ref :'User',
            required : true,
        },
        rating: {
            type : Number,
            required : true,
            min : 1,
            max: 5,
        },
        comment:{
            type : String,
            required : true,
        },
        review_image : {
            type : String,
            default : null,
        },
        date: { 
            type: Date, 
            default: Date.now 
        }
    }],
    new_price : {
        type : Number,
        required : true,
    },
    old_price : {
        type : Number,
        required : true,
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
},{timestamps: true});

export const Product = mongoose.model('Product', productSchema);