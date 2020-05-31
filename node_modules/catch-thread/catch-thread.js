/**
 * * CATCH ASYNC ERROR HANDLER
 * This function returns an anonymous function for Express to call at a later time
 *  Also handles all errors caused inside of functions
 * @param {*} fn The function to return as an anonymous function to use at a later time
 * @returns The function to return as an anonymous function to use at a later time
 */
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
