class ApEz {
  /**
   *Creates an instance of APIFeatures.
   * @param {*} dbQuery The query being run/returned from the database
   * @param {*} reqQuery The query string from the HTTP request
   * @memberof APIFeatures
   */
  constructor(dbQuery, reqQuery) {
    this.dbQuery = dbQuery;
    this.reqQuery = reqQuery;
  }

  /**
   **FILTER
   * Filter the database query based on the variables in the HTTP query string.
   * @returns This APIFeatures object - to allow chaining
   * @memberof APIFeatures
   */
  filter() {
    // FILTERING
    const queryObj = { ...this.reqQuery };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((element) => {
      delete queryObj[element];
    });

    // ADVANCED FILTERING - Operators - prepend gte, gt, lte, lt with '$'
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /(gte|gt|lte|lt)/g,
      (matchedStr) => '$' + matchedStr
    );

    // RUN THE QUERY AND STORE THE RESPONSE FOR FURTHER PARSING
    this.dbQuery = this.dbQuery.find(JSON.parse(queryStr));

    //Return the object so methods can be chained
    return this;
  }

  /**
   **SORT
   * Sort the database query based on the variables in the HTTP query string.
   * @returns This APIFeatures object - to allow chaining
   * @memberof APIFeatures
   */
  sort() {
    // SORTING if a sort variable is present in the query
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(',').join(' ');
      this.dbQuery = this.dbQuery.sort(sortBy);
    } else {
      //If no sort field is specified - sort descending by createdAt Date
      this.dbQuery = this.dbQuery.sort('-createdAt');
    }

    //Return the object so methods can be chained
    return this;
  }

  /**
   **LIMIT FIELDS
   * Limit the database query fields returned to the user based on the variables in the HTTP query string.
   * @returns This APIFeatures object - to allow chaining
   * @memberof APIFeatures
   */
  limitFields() {
    // FIELD LIMITING
    if (this.reqQuery.fields) {
      const fields = this.reqQuery.fields.split(',').join(' ');
      this.dbQuery = this.dbQuery.select(fields);
    } else {
      //DEFAULT TO NOT INCLUDE FIELDS THAT SHOULD NOT NEED TO BE SENT
      this.dbQuery = this.dbQuery.select('-__v');
    }
    //Return the object so methods can be chained
    return this;
  }

  /**
   **PAGINATE
   * Edit the displayed pages of data returned by the database query based on the variables in the HTTP query string.
   * @returns This APIFeatures object - to allow chaining
   * @memberof APIFeatures
   */
  paginate() {
    //PAGINATION
    const page = parseInt(this.reqQuery.page, 10) || 1;
    const limit = parseInt(this.reqQuery.limit, 10) || 100;
    const skip = (page - 1) * limit;

    this.dbQuery = this.dbQuery.skip(skip).limit(limit);

    return this;
  }
}

// EXPORT THE MODULE
module.exports = ApEz;
