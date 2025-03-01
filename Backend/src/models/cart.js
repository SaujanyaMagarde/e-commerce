import mongoose, { Schema } from 'mongoose';

const cartSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                seller: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Seller",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                },
                size : {
                    type : String,
                    required : true,
                    default : "M",
                },
                price: { // Price should be separate
                    type: Number,
                    required: true,
                }
            }
        ],
        total_price: {
            type: Number,
            required: true,
            default: 0,
        }
    },
    { timestamps: true }
);

// Auto-update total_price before saving
cartSchema.pre("save", function (next) {
    this.total_price = this.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    next();
});

export const Cart = mongoose.model("Cart", cartSchema);
