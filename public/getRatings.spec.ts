import { getRatings, returnedItems } from "./model";

describe("getRatings", () => {
  it("should return a map of item IDs to their ratings", async () => {
    const mockGetRatingbyID = jest.fn(async (id: string) => {
      if (id === "1") return 4.5;
      if (id === "2") return 3.0;
      return 0;
    });

    const mockItems: returnedItems[] = [
      { _id: "1", title: "Item 1", releaseDate: "2023-01-01", posterUrl: "url1" },
      { _id: "2", title: "Item 2", releaseDate: "2023-02-01", posterUrl: "url2" },
    ];

    const result = await getRatings(mockItems, mockGetRatingbyID);

    expect(mockGetRatingbyID).toHaveBeenCalledTimes(2);
    expect(mockGetRatingbyID).toHaveBeenCalledWith("1");
    expect(mockGetRatingbyID).toHaveBeenCalledWith("2");
    expect(result.get("1")).toBe(4.5);
    expect(result.get("2")).toBe(3.0);
  });

  it("should handle errors and set the rating to 0 for failed items", async () => {
    const mockGetRatingbyID = jest.fn(async (id: string) => {
      if (id === "1") throw new Error("Failed to fetch rating");
      if (id === "2") return 3.0;
      return 0;
    });

    const mockItems: returnedItems[] = [
      { _id: "1", title: "Item 1", releaseDate: "2023-01-01", posterUrl: "url1" },
      { _id: "2", title: "Item 2", releaseDate: "2023-02-01", posterUrl: "url2" },
    ];

    const result = await getRatings(mockItems, mockGetRatingbyID);

    expect(mockGetRatingbyID).toHaveBeenCalledTimes(2);
    expect(mockGetRatingbyID).toHaveBeenCalledWith("1");
    expect(mockGetRatingbyID).toHaveBeenCalledWith("2");
    expect(result.get("1")).toBe(0); // Error case
    expect(result.get("2")).toBe(3.0);
  });

  it("should return an empty map if no items are provided", async () => {
    const mockGetRatingbyID = jest.fn();

    const mockItems: returnedItems[] = [];

    const result = await getRatings(mockItems, mockGetRatingbyID);

    expect(mockGetRatingbyID).not.toHaveBeenCalled();
    expect(result.size).toBe(0);
  });
});