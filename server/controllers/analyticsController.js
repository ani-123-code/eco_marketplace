const BuyerRequest = require('../models/BuyerRequest');
const Material = require('../models/Material');
const Industry = require('../models/Industry');

exports.getDashboardMetrics = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const [
      totalRequests,
      pendingRequests,
      confirmedRequests,
      dispatchedRequests,
      completedRequests,
      cancelledRequests,
      lowStockCount,
      outOfStockCount,
      totalMaterials,
      activeIndustries
    ] = await Promise.all([
      BuyerRequest.countDocuments(),
      BuyerRequest.countDocuments({ status: { $in: ['New', 'Reviewed'] } }),
      BuyerRequest.countDocuments({ status: 'Confirmed' }),
      BuyerRequest.countDocuments({ status: 'Dispatched' }),
      BuyerRequest.countDocuments({ status: 'Completed' }),
      BuyerRequest.countDocuments({ status: 'Cancelled' }),
      Material.countDocuments({ availableQuantity: { $gt: 0, $lt: 50 }, isActive: true }),
      Material.countDocuments({ availableQuantity: 0, isActive: true }),
      Material.countDocuments({ isActive: true }),
      Industry.countDocuments({ isActive: true })
    ]);

    const recentRequests = await BuyerRequest.find()
      .sort('-createdAt')
      .limit(5)
      .populate('material', 'name materialCode')
      .populate('industry', 'name');

    const fulfillmentRate = totalRequests > 0
      ? ((completedRequests / totalRequests) * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      metrics: {
        totalRequests,
        pendingRequests,
        confirmedRequests,
        dispatchedRequests,
        completedRequests,
        cancelledRequests,
        lowStockCount,
        outOfStockCount,
        totalMaterials,
        activeIndustries,
        fulfillmentRate,
        recentRequests
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard metrics',
      error: error.message
    });
  }
};

exports.getRequestsByIndustry = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'industry' } = req.query;

    let matchQuery = {};
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }

    const results = await BuyerRequest.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: 'materials',
          localField: 'material',
          foreignField: '_id',
          as: 'materialData'
        }
      },
      { $unwind: '$materialData' },
      {
        $lookup: {
          from: 'industries',
          localField: 'materialData.industry',
          foreignField: '_id',
          as: 'industryData'
        }
      },
      { $unwind: '$industryData' },
      {
        $group: {
          _id: '$industryData.name',
          industryId: { $first: '$industryData._id' },
          count: { $sum: 1 },
          totalQuantity: { $sum: '$requestedQuantity' },
          confirmedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Confirmed'] }, 1, 0] }
          },
          completedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error fetching requests by industry:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching requests by industry',
      error: error.message
    });
  }
};

exports.getTopMaterials = async (req, res) => {
  try {
    const { limit = 10, period = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const results = await BuyerRequest.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$material',
          requestCount: { $sum: 1 },
          totalQuantityRequested: { $sum: '$requestedQuantity' },
          confirmedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Confirmed'] }, 1, 0] }
          },
          completedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: 'materials',
          localField: '_id',
          foreignField: '_id',
          as: 'materialInfo'
        }
      },
      { $unwind: '$materialInfo' },
      {
        $lookup: {
          from: 'industries',
          localField: 'materialInfo.industry',
          foreignField: '_id',
          as: 'industryInfo'
        }
      },
      { $unwind: '$industryInfo' },
      { $sort: { requestCount: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error fetching top materials:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top materials',
      error: error.message
    });
  }
};

exports.getStockReport = async (req, res) => {
  try {
    const [lowStock, outOfStock] = await Promise.all([
      Material.find({
        availableQuantity: { $gt: 0, $lt: 50 },
        isActive: true
      })
        .populate('industry', 'name slug')
        .sort('availableQuantity')
        .select('name materialCode availableQuantity unit minimumOrderQuantity industry'),
      Material.find({
        availableQuantity: 0,
        isActive: true
      })
        .populate('industry', 'name slug')
        .select('name materialCode availableQuantity unit minimumOrderQuantity industry')
    ]);

    res.json({
      success: true,
      lowStock,
      outOfStock
    });
  } catch (error) {
    console.error('Error fetching stock report:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stock report',
      error: error.message
    });
  }
};

exports.getBuyerInsights = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let matchQuery = {};
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }

    const [uniqueBuyers, topCompanies, repeatBuyers] = await Promise.all([
      BuyerRequest.distinct('buyerEmail', matchQuery),
      BuyerRequest.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$companyName',
            requestCount: { $sum: 1 },
            totalQuantity: { $sum: '$requestedQuantity' },
            lastRequest: { $max: '$createdAt' }
          }
        },
        { $sort: { requestCount: -1 } },
        { $limit: 10 }
      ]),
      BuyerRequest.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$buyerEmail',
            requestCount: { $sum: 1 },
            buyerName: { $first: '$buyerName' },
            companyName: { $first: '$companyName' }
          }
        },
        { $match: { requestCount: { $gt: 1 } } },
        { $sort: { requestCount: -1 } }
      ])
    ]);

    const repeatRate = uniqueBuyers.length > 0
      ? ((repeatBuyers.length / uniqueBuyers.length) * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      insights: {
        uniqueBuyersCount: uniqueBuyers.length,
        topCompanies,
        repeatBuyersCount: repeatBuyers.length,
        repeatRate: `${repeatRate}%`,
        repeatBuyers
      }
    });
  } catch (error) {
    console.error('Error fetching buyer insights:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching buyer insights',
      error: error.message
    });
  }
};

exports.getRequestTimeline = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const timeline = await BuyerRequest.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          newCount: {
            $sum: { $cond: [{ $eq: ['$status', 'New'] }, 1, 0] }
          },
          confirmedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Confirmed'] }, 1, 0] }
          },
          completedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      timeline
    });
  } catch (error) {
    console.error('Error fetching request timeline:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching request timeline',
      error: error.message
    });
  }
};
