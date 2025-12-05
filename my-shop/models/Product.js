import mongoose from 'mongoose';


const ProductSchema = new mongoose.Schema({
title: { type: String, required: true },
description: String,
price: { type: Number, required: true },
createdAt: { type: Date, default: Date.now },
});


export default mongoose.models.Product || mongoose.model('Product', ProductSchema);