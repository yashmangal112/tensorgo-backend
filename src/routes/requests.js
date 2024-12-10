const express = require("express");
const CustomerRequest = require("../models/CustomerRequest");
const User = require("../models/User");
const { createTicket } = require("../services/freshdesk");

const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, category, comments } = req.body;

  // Basic validation of required fields
  if (!userId || !category || !comments) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  console.log(userId, category, comments)

  try {
    console.log(User);
    // Check if the user exists in the database
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(user);

    // Create the customer request
    const newRequest = await CustomerRequest.create({ user: userId, category, comments });
    console.log("Created request:", newRequest);
    // Create a Freshdesk ticket
    await createTicket({
      name: user.name,
      email: user.email,
      subject: `New Query: ${category}`,
      description: comments,
    });

    // Return the newly created request as a response
    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error creating request:", error);
    console.log(error);
    res.status(500).json({ error: "Failed to create request" });
  }
});

router.get("/:category", async (req, res) => {
  try {
    const decodedCategory = decodeURIComponent(req.params.category);
    const requests = await CustomerRequest.find({ category: decodedCategory }).populate("user");
    
    console.log("Fetched requests:", requests);
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

module.exports = router;
