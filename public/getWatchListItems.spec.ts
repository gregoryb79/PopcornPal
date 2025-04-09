import { getWatchListItems, returnedWatchlist } from "./model";

const validBody1 : returnedWatchlist = {
    _id: "1",
    itemTitle: "Test title 01",    
    itemId: "1",    
    status: "Completed",
  };

const validBody2 : returnedWatchlist = {
    _id: "3",
    itemTitle: "Test title 02",   
    itemId: "3",    
    status: "Watching",
  };

describe("getWatchListItems", () => {
    it("should return filtered and sorted items based on the watchlist", async () => {
        const watchlist = [validBody1, validBody2];
        const query = "?type=movie";

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        { _id: "1", releaseDate: "2023-01-01" },
                        { _id: "2", releaseDate: "2022-01-01" },
                        { _id: "3", releaseDate: "2023-05-01" },
                    ]),
            })
        ) as jest.Mock;

        const result = await getWatchListItems(watchlist, query);
        
        expect(result).toEqual([
            { _id: "3", releaseDate: "2023-05-01" },
            { _id: "1", releaseDate: "2023-01-01" },
        ]);
        expect(global.fetch).toHaveBeenCalledWith("/api/items?type=movie");
    });

    it("should throw an error if the API call fails", async () => {
        const watchlist = [validBody1];
        const query = "?type=movie";

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                text: () => Promise.resolve("Error message"),
            })
        ) as jest.Mock;

        await expect(getWatchListItems(watchlist, query)).rejects.toThrow(
            "Failed to fetch notes. Status: undefined. Message: Error message"
        );
    });

    it("should return an empty array if no items match the watchlist", async () => {
        const watchlist = [validBody1];
        const query = "?type=movie";

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        { _id: "5", releaseDate: "2023-01-01" },
                        { _id: "6", releaseDate: "2022-01-01" },
                    ]),
            })
        ) as jest.Mock;

        const result = await getWatchListItems(watchlist, query);

        expect(result).toEqual([]);
    });
});