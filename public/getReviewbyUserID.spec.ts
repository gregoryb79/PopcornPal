import { getReviewbyUserID } from "./model";

describe("getReviewbyUserID", () => {
    beforeEach(() => {
        global.fetch = jest.fn(); // Mock the fetch API
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it("should return the review for the given itemId", async () => {
        const itemId = "123";

        // Mock fetch response
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { _id: "1", itemId: "123", content: "Great movie!" },
                { _id: "2", itemId: "456", content: "Not bad." },
            ],
        });

        const result = await getReviewbyUserID(itemId);

        expect(result).toEqual({ _id: "1", itemId: "123", content: "Great movie!" });
        expect(global.fetch).toHaveBeenCalledWith("/api/reviews");
    });

    it("should return null if no review matches the itemId", async () => {
        const itemId = "789";

        // Mock fetch response
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { _id: "1", itemId: "123", content: "Great movie!" },
                { _id: "2", itemId: "456", content: "Not bad." },
            ],
        });

        const result = await getReviewbyUserID(itemId);

        expect(result).toBeNull();
        expect(global.fetch).toHaveBeenCalledWith("/api/reviews");
    });

    it("should return null if the reviews array is empty", async () => {
        const itemId = "123";

        // Mock fetch response
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        const result = await getReviewbyUserID(itemId);

        expect(result).toBeNull();
        expect(global.fetch).toHaveBeenCalledWith("/api/reviews");
    });

    it("should return null if the API call fails", async () => {
        const itemId = "123";

        // Mock fetch response
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            text: async () => "Error message",
        });

        const result = await getReviewbyUserID(itemId);

        expect(result).toBeNull();
        expect(global.fetch).toHaveBeenCalledWith("/api/reviews");
    });

    it("should return null if an exception occurs during fetch", async () => {
        const itemId = "123";

        // Mock fetch to throw an error
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

        const result = await getReviewbyUserID(itemId);

        expect(result).toBeNull();
        expect(global.fetch).toHaveBeenCalledWith("/api/reviews");
    });
});