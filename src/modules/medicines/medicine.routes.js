const express = require('express');
const router = express.Router();
const medicineController = require('./medicine.controller');

router.get('/expiring', medicineController.getExpiringMedicines);
router.get('/', medicineController.getAllMedicines);
router.get('/:id', medicineController.getMedicineById);
router.post('/', medicineController.createMedicine);
router.put('/:id', medicineController.updateMedicine);
router.delete('/:id', medicineController.deleteMedicine);

module.exports = router;