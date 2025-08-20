class ApiFilters {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFilter = ["page", "limit", "sort", "fields"];
    excludedFilter.forEach((el) => {
      delete queryObj[el];
    });
    this.query = this.query.find(queryObj);
    return this;
  }

sort() {
  if (this.queryString.sort) {
    const sortBy = this.queryString.sort;
    this.query = this.query.sort(sortBy);
  }
  return this;
}

  fields() {
    if (this.queryString.fields) {
      const selectBy = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(selectBy);
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFilters;
