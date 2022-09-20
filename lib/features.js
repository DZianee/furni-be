function appFeatures(query, queryReq) {
  this.query = query;
  this.queryReq = queryReq;

  //pagination
  (this.pagination = (pageSize) => {
    const page = parseInt(this.queryReq.page);
    const skip = pageSize * (page - 1);
    this.query = this.query.limit(pageSize).skip(skip);
    return this;
  }),
    //sorting
    (this.sorting = () => {
      const kindOf = this.queryReq.kindOf;
      const sortName = this.queryReq.sortName;
      let sort;
      switch (parseInt(kindOf)) {
        case 1:
          if (sortName) {
            sort = sortName;
          } else {
            sort = "createdAt";
          }
          break;
        case -1:
          if (sortName) {
            sort = "-" + sortName;
          } else {
            sort = "-createdAt";
          }
          break;
      }
      console.log(this.query);
      this.query = this.query.sort(sort);
      return this;
    }),
    //filtering
    (this.filtering = () => {
      const queryObj = { ...this.queryReq };
      // console.log(queryObj);

      let excludedFields = [
        "page",
        "sort",
        "limit",
        "search",
        "sortName",
        "kindOf",
      ];
      excludedFields.forEach((el) => delete queryObj[el]);

      //convert to string
      //   let queryStr = JSON.stringify(queryObj);
      //   queryStr = queryStr.replace(
      //     /\b(gte|gt|lt|lte|regex|in)\b/g,
      //     (match) => "$" + match
      //   );

      //   const status = this.queryReq.status;
      //   const process = this.queryReq.process;
      //   const paymentMethod = this.queryReq.paymentMethod;
      // console.log(queryObj);

      const priceFilter = this.queryReq.price;

      //   if (status && process && paymentMethod) {
      //     this.query = this.query.find({
      //       status: status,
      //       process: process,
      //       paymentMethod: paymentMethod,
      //     });
      //   } else
      if (priceFilter) {
        switch (parseInt(priceFilter)) {
          case 1:
            this.query = this.query.find({ price: { $lt: 200000 } });
            break;

          case 2:
            this.query = this.query.find({
              price: { $gte: 200000, $lte: 1000000 },
            });
            break;
          case 3:
            this.query = this.query.find({ price: { $gt: 1000000 } });
            break;

          default:
            break;
        }
      } else {
        this.query = this.query.find(queryObj);
      }

      //   this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }),
    //searching
    (this.searching = () => {
      const search = this.queryReq.search;
      if (search) {
        this.query = this.query.find({
          $text: { $search: search, $caseSensitive: false },
        });
      } else {
        this.query = this.query.find();
      }
      return this;
    });
}

module.exports = appFeatures;
