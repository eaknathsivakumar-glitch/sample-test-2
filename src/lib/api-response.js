function sendApiError(res, status, code, message) {
  return res.status(status).json({ error: { code, message } });
}

function sendValidationError(res, validationError) {
  const message = validationError.issues[0]?.message || 'Request validation failed.';
  return sendApiError(res, 400, 'VALIDATION_ERROR', message);
}

module.exports = { sendApiError, sendValidationError };
