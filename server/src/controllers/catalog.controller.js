const { catalog: Catalog } = require("../models");

async function createCatalog(req, res, next) {
  try {
    const { name, code, major, semester, isTextbook } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: "Name and code are required." });
    }

    // Check if a catalog with the same code already exists
    const existingCatalog = await Catalog.findOne({ code });
    if (existingCatalog) {
      return res.status(400).json({ message: "Catalog code already exists." });
    }

    const newCatalog = new Catalog({
      name,
      code,
      major,
      semester,
      isTextbook,
    });

    const savedCatalog = await newCatalog.save();

    return res.status(201).json(savedCatalog);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Catalog code already exists." });
    }

    return res.status(500).json({ message: "An error occurred", error });
  }
}

async function listCatalogs(req, res, next) {
  try {
    const catalogs = await Catalog.find();
    return res.status(200).json(catalogs);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error });
  }
}

async function updateCatalog(req, res, next) {
  try {
    const { id } = req.params;
    const { name, code, major, semester, isTextbook } = req.body;

    // Check if another catalog with the same code exists
    const existingCatalog = await Catalog.findOne({ code, _id: { $ne: id } });
    if (existingCatalog) {
      return res.status(400).json({ message: "Catalog code already exists." });
    }

    const updatedCatalog = await Catalog.findByIdAndUpdate(
      id,
      { name, code, major, semester, isTextbook },
      { new: true, runValidators: true }
    );

    if (!updatedCatalog) {
      return res.status(404).json({ message: "Catalog not found" });
    }

    return res.status(200).json(updatedCatalog);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error });
  }
}

async function deleteCatalog(req, res, next) {
  try {
    const { id } = req.params;

    const deletedCatalog = await Catalog.findByIdAndDelete(id);

    if (!deletedCatalog) {
      return res.status(404).json({ message: "Catalog not found" });
    }

    return res.status(200).json({ message: "Catalog deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error });
  }
}

const CatalogController = {
  createCatalog,
  listCatalogs,
  updateCatalog,
  deleteCatalog,
};

module.exports = CatalogController;
