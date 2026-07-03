import Client from "../models/Client.js";

/**
 * ADD CLIENT
 */
export const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);

    res.status(201).json({
      message: "Client created successfully",
      client,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL CLIENTS (SEARCH + PAGINATION)
 */
export const getClients = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = {
      $or: [
        { clientName: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const clients = await Client.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Client.countDocuments(query);

    res.json({
      clients,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE CLIENT
 */
export const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json({
      message: "Client updated successfully",
      client,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE CLIENT
 */
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json({
      message: "Client deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};