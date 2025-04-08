import { getItems } from './model'; 
// Import 'node-fetch' as a module
import fetch, { Response } from 'node-fetch';

// Mock the 'fetch' function before tests
jest.mock('node-fetch', () => ({
  default: jest.fn(),
  Response: jest.requireActual('node-fetch').Response, // Preserve actual Response
}));

// Now you can mock the behavior of fetch in your tests
const mockFetch = fetch as jest.Mock;

test('fetches and sorts items correctly on success', async () => {
  const mockResponse = [
    { id: 2, title: 'Item B' },
    { id: 1, title: 'Item A' },
  ];

  // Mock fetch to return a resolved promise with the mockResponse
  mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse)));

  const result = await getItems(""); // Call your function that uses fetch

  expect(result).toEqual(mockResponse);
  expect(mockFetch).toHaveBeenCalledTimes(1);
  // Additional assertions based on your logic
});
