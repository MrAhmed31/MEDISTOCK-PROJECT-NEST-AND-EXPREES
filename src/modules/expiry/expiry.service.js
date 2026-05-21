const Medicine = require('../medicines/medicine.model');

const getDateRanges = () => {
  const now = new Date();
  
  const endOfWeek = new Date();
  endOfWeek.setDate(now.getDate() + 7);
  
  const endOfMonth = new Date();
  endOfMonth.setDate(now.getDate() + 30);
  
  const endOfYear = new Date();
  endOfYear.setDate(now.getDate() + 365);

  return { now, endOfWeek, endOfMonth, endOfYear };
};

const calculateTimeLeft = (expiryDate) => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffMs = expiry - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return {
    daysLeft: diffDays,
    weeksLeft: Math.floor(diffDays / 7),
    monthsLeft: Math.floor(diffDays / 30),
    yearsLeft: Math.floor(diffDays / 365),
    isExpired: diffDays < 0,
    status:
      diffDays < 0 ? 'expired' :
      diffDays <= 7 ? 'this_week' :
      diffDays <= 30 ? 'this_month' :
      diffDays <= 365 ? 'this_year' : 'healthy',
    color:
      diffDays < 0 ? 'red' :
      diffDays <= 7 ? 'orange' :
      diffDays <= 30 ? 'yellow' :
      diffDays <= 365 ? 'blue' : 'green',
  };
};

const getExpiringThisWeek = async () => {
  const { now, endOfWeek } = getDateRanges();
  const medicines = await Medicine.find({
    expiryDate: { $gte: now, $lte: endOfWeek },
  });
  return medicines.map((med) => ({
    ...med.toObject(),
    timeLeft: calculateTimeLeft(med.expiryDate),
  }));
};

const getExpiringThisMonth = async () => {
  const { now, endOfMonth } = getDateRanges();
  const medicines = await Medicine.find({
    expiryDate: { $gte: now, $lte: endOfMonth },
  });
  return medicines.map((med) => ({
    ...med.toObject(),
    timeLeft: calculateTimeLeft(med.expiryDate),
  }));
};

const getExpiringThisYear = async () => {
  const { now, endOfYear } = getDateRanges();
  const medicines = await Medicine.find({
    expiryDate: { $gte: now, $lte: endOfYear },
  });
  return medicines.map((med) => ({
    ...med.toObject(),
    timeLeft: calculateTimeLeft(med.expiryDate),
  }));
};

const getExpired = async () => {
  const now = new Date();
  const medicines = await Medicine.find({
    expiryDate: { $lt: now },
  });
  return medicines.map((med) => ({
    ...med.toObject(),
    timeLeft: calculateTimeLeft(med.expiryDate),
  }));
};

const getHealthyStock = async () => {
  const { endOfYear } = getDateRanges();
  const medicines = await Medicine.find({
    expiryDate: { $gt: endOfYear },
  });
  return medicines.map((med) => ({
    ...med.toObject(),
    timeLeft: calculateTimeLeft(med.expiryDate),
  }));
};

const getDashboardAnalytics = async () => {
  const { now, endOfWeek, endOfMonth, endOfYear } = getDateRanges();

  const [weekly, monthly, yearly, expired, healthy, total] = await Promise.all([
    Medicine.countDocuments({ expiryDate: { $gte: now, $lte: endOfWeek } }),
    Medicine.countDocuments({ expiryDate: { $gte: now, $lte: endOfMonth } }),
    Medicine.countDocuments({ expiryDate: { $gte: now, $lte: endOfYear } }),
    Medicine.countDocuments({ expiryDate: { $lt: now } }),
    Medicine.countDocuments({ expiryDate: { $gt: endOfYear } }),
    Medicine.countDocuments(),
  ]);

  const nearestExpiry = await Medicine.findOne({
    expiryDate: { $gte: now },
  }).sort({ expiryDate: 1 });

  return {
    total,
    weekly,
    monthly,
    yearly,
    expired,
    healthy,
    nearestExpiry: nearestExpiry ? {
      name: nearestExpiry.name,
      brand: nearestExpiry.brand,
      expiryDate: nearestExpiry.expiryDate,
      timeLeft: calculateTimeLeft(nearestExpiry.expiryDate),
    } : null,
    percentages: {
      expired: ((expired / total) * 100).toFixed(1),
      healthy: ((healthy / total) * 100).toFixed(1),
      atRisk: (((weekly) / total) * 100).toFixed(1),
    },
  };
};

const getAllWithStatus = async () => {
  const medicines = await Medicine.find().sort({ expiryDate: 1 });
  return medicines.map((med) => ({
    ...med.toObject(),
    timeLeft: calculateTimeLeft(med.expiryDate),
  }));
};

module.exports = {
  getExpiringThisWeek,
  getExpiringThisMonth,
  getExpiringThisYear,
  getExpired,
  getHealthyStock,
  getDashboardAnalytics,
  getAllWithStatus,
  calculateTimeLeft,
};