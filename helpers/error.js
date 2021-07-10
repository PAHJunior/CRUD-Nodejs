const handleError = (err, res) => {
  const statusCode = Number.isInteger(Number(err.message)) ? err.message : 400;
  res.status(statusCode).json({
    errors: err.errors,
  });
};

module.exports = {
  handleError,
};
