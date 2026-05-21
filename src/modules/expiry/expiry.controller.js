const expiryService = require('./expiry.service');

const getExpiringThisWeek = async (req, res, next) => {
  try {
    const data = await expiryService.getExpiringThisWeek();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

const getExpiringThisMonth = async (req, res, next) => {
  try {
    const data = await expiryService.getExpiringThisMonth();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

const getExpiringThisYear = async (req, res, next) => {
  try {
    const data = await expiryService.getExpiringThisYear();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

const getExpired = async (req, res, next) => {
  try {
    const data = await expiryService.getExpired();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

const getHealthyStock = async (req, res, next) => {
  try {
    const data = await expiryService.getHealthyStock();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

const getDashboardAnalytics = async (req, res, next) => {
  try {
    const data = await expiryService.getDashboardAnalytics();
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

const getAllWithStatus = async (req, res, next) => {
  try {
    const data = await expiryService.getAllWithStatus();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

module.exports = {
  getExpiringThisWeek,
  getExpiringThisMonth,
  getExpiringThisYear,
  getExpired,
  getHealthyStock,
  getDashboardAnalytics,
  getAllWithStatus,
};