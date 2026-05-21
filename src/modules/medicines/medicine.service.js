const Medicine = require('./medicine.model');

const getAllMedicines = async () => {
  return await Medicine.find();
};

const getMedicineById = async (id) => {
  return await Medicine.findById(id);
};

const createMedicine = async (data) => {
  const medicine = new Medicine(data);
  return await medicine.save();
};

const updateMedicine = async (id, data) => {
  return await Medicine.findByIdAndUpdate(id, data, { new: true });
};

const deleteMedicine = async (id) => {
  return await Medicine.findByIdAndDelete(id);
};

const getExpiringMedicines = async () => {
  const today = new Date();
  const next30Days = new Date();
  next30Days.setDate(today.getDate() + 30);
  return await Medicine.find({
    expiryDate: { $gte: today, $lte: next30Days },
  });
};

module.exports = {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getExpiringMedicines,
};