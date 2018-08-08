import _ from 'lodash';

const utils = {};

utils.generateErrorModel = (error, models) => {
  if (error instanceof models.sequelize.ValidationError) {
    const errorMessages = [];
    _.each(error.errors, (e) => {
      const errorMessageModel = {};
      if (e.path && e.message) {
        errorMessageModel.field = e.path;
        errorMessageModel.message = e.message;
        errorMessages.push(errorMessageModel);
      }
    });
    return errorMessages;
  }
  return [{ field: 'unknown', message: 'Something unexpected went wrong!' }];
};

export default utils;
