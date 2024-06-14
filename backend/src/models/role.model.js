"use strict";

const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true, unique: true },
  rating: { type: Number, required: true, default: 0 },
  bootcamp: { type: String, required: true },
  user: { type: String, required: true, default: 'guest' },
}, { timestamps: true });

const RoleModel = mongoose.model('Role', roleSchema)
module.exports = RoleModel;