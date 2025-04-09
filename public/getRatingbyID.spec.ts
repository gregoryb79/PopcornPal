import { getRatingbyID } from "./model";

global.fetch = jest.fn();

describe("getRatingbyID", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the average rating when ratings are available", async () => {
    const mockRatings = [
      { _id: "1", itemTitle: "Item 1", score: 4 },
      { _id: "2", itemTitle: "Item 1", score: 5 },
    ];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRatings,
    });

    const result = await getRatingbyID("item1");
    expect(fetch).toHaveBeenCalledWith("/api/ratings?search=item1");
    expect(result).toBe(4.5); // Average of 4 and 5
  });

  it("should return 0 when no ratings are available", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const result = await getRatingbyID("item2");
    expect(fetch).toHaveBeenCalledWith("/api/ratings?search=item2");
    expect(result).toBe(0);
  });

  it("should return 0 if the fetch response is not ok", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => "Not Found",
    });

    const result = await getRatingbyID("item3");
    expect(fetch).toHaveBeenCalledWith("/api/ratings?search=item3");
    expect(result).toBe(0);
  });

  it("should return 0 if fetch itself fails", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    const result = await getRatingbyID("item4");
    expect(fetch).toHaveBeenCalledWith("/api/ratings?search=item4");
    expect(result).toBe(0);
  });
});