const errorHandler = (err, req, res, next) => {//זה מאפשר לנו לקבל את השגיאה
  let statusCode = err.statusCode || 500;//זה מאפשר לנו לקבל את השגיאה
  let message = err.message || "Internal server error";//זה מאפשר לנו לקבל את השגיאה

  if (err.name === "ValidationError") {
    statusCode = 400;
  }
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid identifier format";
  }
  if (err.code === 11000) {//זה אם יש לנו ערך כפול
    statusCode = 409;
    message = "Duplicate value already exists";
  }

  res.status(statusCode).json({//זה מאפשר לנו לשלוח את השגיאה
    error: {
      message,//זה מאפשר לנו לשלוח את השגיאה
    },
  });
};

module.exports = errorHandler;
