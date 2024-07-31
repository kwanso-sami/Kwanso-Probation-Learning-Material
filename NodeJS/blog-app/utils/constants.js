module.exports = {
  ORDER: {
    ASC: "asc",
    DESC: "desc",
  },
  SORT: {
    CREATED_AT: "createdAt",
    UPDATED_AT: "createdAt",
    TITLE: "title",
    CATEGORY: "category",
  },
  STATUS_CODE: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    CONFLICT: 409,
  },

  ERROR: {
    DEFAULT: "ERROR",
    API_ERROR: "API ERROR",
    VALIDATION_ERROR: "Validation Error",
    AUTHENTICATION_ERROR: "Authentication Error",
  },
};
