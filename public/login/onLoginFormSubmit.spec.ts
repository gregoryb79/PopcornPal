import { onLoginFormSubmit } from "./controller";

describe("onLoginFormSubmit", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if email is missing", async () => {
    const formData = new FormData();
    formData.append("password", "password123");

    await expect(onLoginFormSubmit(formData)).rejects.toThrow("email can't be empty");
  });  

  it("should throw an error if password is missing", async () => {
    const formData = new FormData();
    formData.append("email", "test@example.com");

    await expect(onLoginFormSubmit(formData)).rejects.toThrow("Password can't be empty");
  });
  
  it("should call doLogIn and return true on successful login", async () => {
    const mockDoLogIn = jest.fn(async () => undefined); // Simulate successful login

    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");

    // Inject the mock function into the controller
    const result = await onLoginFormSubmit(formData, mockDoLogIn);

    expect(result).toBe(true);
    expect(mockDoLogIn).toHaveBeenCalledTimes(1);
    expect(mockDoLogIn).toHaveBeenCalledWith("test@example.com", "password123");
  });

  it("should throw an error if doLogIn fails", async () => {
    const mockDoLogIn = jest.fn(async () => {
      throw new Error("Invalid credentials");
    });

    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");

    await expect(onLoginFormSubmit(formData, mockDoLogIn)).rejects.toThrow("Invalid credentials");
    expect(mockDoLogIn).toHaveBeenCalledTimes(1);
    expect(mockDoLogIn).toHaveBeenCalledWith("test@example.com", "password123");
  });
});