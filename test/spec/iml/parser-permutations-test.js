import parserPermutations from "../../../source/iml/parser-permutations.js";
import { noSpace } from "../../../source/iml/string.js";

describe("cross product", () => {
  it("should product the cross product of two arrays", () => {
    const permutations = parserPermutations(["severity", "record_type", "offset", "limit", "order_by", "begin", "end"]);

    expect(permutations).toEqual(
      noSpace`severity__in&severity__contains&severity__startswith&
      severity__endswith&severity__gte&severity__gt&severity__lte&severity__lt&record_type__in
      &record_type__contains&record_type__startswith&record_type__endswith&record_type__gte
      &record_type__gt&record_type__lte&record_type__lt&offset__in&offset__contains
      &offset__startswith&offset__endswith&offset__gte&offset__gt&offset__lte&offset__lt
      &limit__in&limit__contains&limit__startswith&limit__endswith&limit__gte&limit__gt
      &limit__lte&limit__lt&order_by__in&order_by__contains&order_by__startswith
      &order_by__endswith&order_by__gte&order_by__gt&order_by__lte&order_by__lt
      &begin__in&begin__contains&begin__startswith&begin__endswith&begin__gte
      &begin__gt&begin__lte&begin__lt&end__in&end__contains&end__startswith&end__endswith
      &end__gte&end__gt&end__lte&end__lt&severity&record_type&offset&limit&order_by&begin&end`
    );
  });
});
