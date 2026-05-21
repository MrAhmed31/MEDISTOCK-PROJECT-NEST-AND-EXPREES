const medicineService = require('./medicine.service');

const getAllMedicines = async (req, res, next) => {
  try {
    const medicines = await medicineService.getAllMedicines();
    res.status(200).json({ success: true, data: medicines });
  } catch (error) {
    next(error);
  }
};

const getMedicineById = async (req, res, next) => {
  try {
    const medicine = await medicineService.getMedicineById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    res.status(200).json({ success: true, data: medicine });
  } catch (error) {
    next(error);
  }
};

const createMedicine = async (req, res, next) => {
  try {
    const medicine = await medicineService.createMedicine(req.body);
    res.status(201).json({ success: true, data: medicine });
  } catch (error) {
    next(error);
  }
};

const updateMedicine = async (req, res, next) => {
  try {
    const medicine = await medicineService.updateMedicine(req.params.id, req.body);
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    res.status(200).json({ success: true, data: medicine });
  } catch (error) {
    next(error);
  }
};

const deleteMedicine = async (req, res, next) => {
  try {
    const medicine = await medicineService.deleteMedicine(req.params.id);
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    res.status(200).json({ success: true, message: 'Medicine deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getExpiringMedicines = async (req, res, next) => {
  try {
    const medicines = await medicineService.getExpiringMedicines();
    res.status(200).json({ success: true, data: medicines });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getExpiringMedicines,
};