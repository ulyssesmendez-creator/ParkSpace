import mongoose from "mongoose";
import Listing from "../models/parking.model.js";
import fetch from "node-fetch";

export const getListings = async (req, res) => {
    try {
        const listings = await Listing.find ({});
        res.status(200).json({ success: true, data: listings})
    }   catch (error) {
        console.log("Error in fetching listings:", error.message)
        res.status(500),json({ sucess: false, msg: "Server Error"})
    }
};

export const createListing = async (req, res) => {
  try {
    const { title, address } = req.body;

    // Convert address to coordinates
    const geoRes = await fetch(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json?key=3qmP77FuAdzQmcKW3tzU`
    );
    const geoData = await geoRes.json();
    const [lng, lat] = geoData.features[0].geometry.coordinates;

    const listing = new Listing({
      title,
      address,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });

    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create listing" });
  }
};

export const updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Product Id" });
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(id, listing, { new: true, runValidators: true });

        if (!updatedListing) {
        return res.status(404).json({ success: false, message: "Listing not found" });
        }

        res.status(200).json({ success: true, data: updatedListing });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const deleteListing = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Product Id" });
    }
    
    try {
        await Listing.findByIdAndDelete(id);
        res.status(200).json({success: true, msg: 'Product deleted'})
    }   catch (error) {
        console.log("Error in deleting listing:", error.message)
        res.status(500).json({success: false, msg: "Server Error"})
    }
};
