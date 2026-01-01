const db = require('../db/queries');

const getTempUserId = async () => {
  const pool = require('../db/index');
  const result = await pool.query("SELECT id FROM users WHERE email = 'temp@example.com'");
  return result.rows[0]?.id || null;
};

const getAllApplications = async (req, res, next) => {
  try {
    const userId = req.user?.id || await getTempUserId();
    
    let applications = await db.getApplicationsByUserId(userId);

    const { status, company, date_applied } = req.query;

    if (status) {
      applications = applications.filter(app => 
        app.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (company) {
      applications = applications.filter(app => 
        app.company.toLowerCase().includes(company.toLowerCase())
      );
    }

    if (date_applied) {
      applications = applications.filter(app => {
        const appDate = new Date(app.date_applied).toISOString().split('T')[0];
        return appDate === date_applied;
      });
    }

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

const getApplicationById = async (req, res, next) => {
  try {
    const userId = req.user?.id || await getTempUserId();
    const { id } = req.params;

    const application = await db.getApplicationById(id, userId);

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

const createApplication = async (req, res, next) => {
  try {
    const userId = req.user?.id || await getTempUserId();
    const { company, role, status, date_applied } = req.body;

    if (!company || !role) {
      return res.status(400).json({
        success: false,
        error: 'Company and role are required'
      });
    }

    const validStatuses = ['applied', 'interview', 'offer', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const application = await db.createApplication(
      userId,
      company,
      role,
      status,
      date_applied
    );

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

const updateApplication = async (req, res, next) => {
  try {
    const userId = req.user?.id || await getTempUserId();
    const { id } = req.params;
    const { company, role, status, date_applied } = req.body;

    const existingApp = await db.getApplicationById(id, userId);
    if (!existingApp) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    const validStatuses = ['applied', 'interview', 'offer', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updates = {};
    if (company !== undefined) updates.company = company;
    if (role !== undefined) updates.role = role;
    if (status !== undefined) updates.status = status;
    if (date_applied !== undefined) updates.date_applied = date_applied;

    const application = await db.updateApplication(id, userId, updates);

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

const deleteApplication = async (req, res, next) => {
  try {
    const userId = req.user?.id || await getTempUserId();
    const { id } = req.params;

    const application = await db.deleteApplication(id, userId);

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    res.json({
      success: true,
      message: 'Application deleted successfully',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

const deleteAllApplications = async (req, res, next) => {
  try {
    const userId = req.user?.id || await getTempUserId();

    const applications = await db.deleteAllApplications(userId);

    res.json({
      success: true,
      message: `Deleted ${applications.length} application(s)`,
      count: applications.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  deleteAllApplications
};

