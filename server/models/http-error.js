class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // Adds a message Property
    this.code = errorCode; // adds a code property
  }
}

export default HttpError;
