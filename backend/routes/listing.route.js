import express from "express";
import { createListing, deleteListing, getListings, updateListing } from "../controllers/listing.controller.js";

const router = express.Router();

router.get("/", getListings)
router.post("/", createListing)
router.put("/:id", updateListing)
router.delete("/:id", deleteListing)

console.log(process.env.MONGO_URI);

export default router;

