const db = require('../db/queries');

const getAllApplications = async (req, res, next) => {
  try {
    const authSub = req.auth.payload.sub;
    
    const user = await db.findOrCreateUser(authSub);
    let applications = await db.getApplicationsByUserId(user.id);

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
    const authSub = req.auth.payload.sub;
    const { id } = req.params;

    const user = await db.findOrCreateUser(authSub);
    const application = await db.getApplicationById(id, user.id);

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
    const authSub = req.auth.payload.sub;
    const { company, role, status, date_applied, notes, application_url } = req.body;

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

    // Validate notes length (max 50 characters)
    if (notes && notes.length > 50) {
      return res.status(400).json({
        success: false,
        error: 'Notes must be 50 characters or less'
      });
    }

    const user = await db.findOrCreateUser(authSub);
    const application = await db.createApplication(
      user.id,
      company,
      role,
      status,
      date_applied,
      notes,
      application_url
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
    const authSub = req.auth.payload.sub;
    const { id } = req.params;
    const { company, role, status, date_applied, notes, application_url } = req.body;

    const user = await db.findOrCreateUser(authSub);
    const existingApp = await db.getApplicationById(id, user.id);
    
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

    // Validate notes length (max 50 characters)
    if (notes && notes.length > 50) {
      return res.status(400).json({
        success: false,
        error: 'Notes must be 50 characters or less'
      });
    }

    const updates = {};
    if (company !== undefined) updates.company = company;
    if (role !== undefined) updates.role = role;
    if (status !== undefined) updates.status = status;
    if (date_applied !== undefined) updates.date_applied = date_applied;
    if (notes !== undefined) updates.notes = notes;
    if (application_url !== undefined) updates.application_url = application_url;

    const application = await db.updateApplication(id, user.id, updates);

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
    const authSub = req.auth.payload.sub;
    const { id } = req.params;

    const user = await db.findOrCreateUser(authSub);
    const application = await db.deleteApplication(id, user.id);

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
    const authSub = req.auth.payload.sub;

    const user = await db.findOrCreateUser(authSub);
    const applications = await db.deleteAllApplications(user.id);

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

