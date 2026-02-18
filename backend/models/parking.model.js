import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: String,
  address: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
});

listingSchema.index({ location: "2dsphere" });

// 👇 This line creates the actual model
const Listing = mongoose.model("Listing", listingSchema);

// 👇 And now you can safely export it
export default Listing;
