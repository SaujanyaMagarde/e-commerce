import mongoose, { Schema } from 'mongoose';

const orderSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        products: [
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
                    min: 1,
                },
                size : {
                    type : String,
                    required : true,
                    default : "M",
                },
                price: {
                    type: Number,
                    required: true,
                },
            }
        ],
        total_price: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "shipped", "delivered", "canceled"],
            default: "pending",
        },
        payment_status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        order_date: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Automatically calculate total_price before saving
orderSchema.pre("save", async function (next) {
    if (!this.total_price) {
        let total = 0;
        for (const item of this.products) {
            total += item.price * item.quantity;
        }
        this.total_price = total;
    }
    next();
});

export const Order = mongoose.model("Order", orderSchema);
