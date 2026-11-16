const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('[API Error]', err);

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id: ${err.value}`;
    return res.status(404).json({ success: false, message });
  }

  // Mongoose duplicate key (code 11000)
  if (err.code === 11000) {
    let field = Object.keys(err.keyValue || {})[0] || 'field';
    let message = `Duplicate value entered for ${field}. Please use another value.`;
    if (err.keyPattern && err.keyPattern.studentId && err.keyPattern.jobId) {
      message = 'You have already submitted an application for this job opening.';
    }
    return res.status(400).json({ success: false, message });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    return res.status(400).json({ success: false, message });
  }

  // Multer limit error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'Uploaded file exceeds the maximum allowed size of 5MB.'
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error'
  });
};

module.exports = { errorHandler };
