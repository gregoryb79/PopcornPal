import { getItems } from "../public/model";

global.fetch = jest.fn();

describe("getItems", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch items and return them sorted by releaseDate in descending order", async () => {
    const mockItems = [
      { _id: "1", title: "Item 1", releaseDate: "2023-01-01" },
      { _id: "2", title: "Item 2", releaseDate: "2023-02-01" },
    ];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockItems,
    });

    const result = await getItems("?type=Movie");
    expect(fetch).toHaveBeenCalledWith("/api/items?type=Movie");
    expect(result).toEqual([
      { _id: "2", title: "Item 2", releaseDate: "2023-02-01" },
      { _id: "1", title: "Item 1", releaseDate: "2023-01-01" },
    ]);
  });

  it("should throw an error if the fetch response is not ok", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });

    await expect(getItems("?type=Movie")).rejects.toThrow(
      "Failed to fetch notes. Status: 500. Message: Internal Server Error"
    );
    expect(fetch).toHaveBeenCalledWith("/api/items?type=Movie");
  });

  it("should throw an error if fetch itself fails", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    await expect(getItems("?type=Movie")).rejects.toThrow("Network Error");
    expect(fetch).toHaveBeenCalledWith("/api/items?type=Movie");
  });

  it("should return an empty array if the API returns no items", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const result = await getItems("?type=Movie");
    expect(fetch).toHaveBeenCalledWith("/api/items?type=Movie");
    expect(result).toEqual([]);
  });

  it("should handle items with missing releaseDate gracefully", async () => {
    const mockItems = [
      { _id: "1", title: "Item 1", releaseDate: "2023-01-01" },
      { _id: "2", title: "Item 2" }, // Missing releaseDate
    ];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockItems,
    });

    const result = await getItems("?type=Movie");
    expect(fetch).toHaveBeenCalledWith("/api/items?type=Movie");
    expect(result).toEqual([
      { _id: "1", title: "Item 1", releaseDate: "2023-01-01" },
      { _id: "2", title: "Item 2" },
    ]);
  });

  it("should handle invalid JSON response gracefully", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });

    await expect(getItems("?type=Movie")).rejects.toThrow("Invalid JSON");
    expect(fetch).toHaveBeenCalledWith("/api/items?type=Movie");
  });
});
