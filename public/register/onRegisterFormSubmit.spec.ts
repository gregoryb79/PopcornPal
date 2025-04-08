import { onRegisterFormSubmit } from "./controller";

describe("onRegisterFormSubmit", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if email is missing", async () => {
    const formData = new FormData();
    formData.append("password", "password123");
    formData.append("username", "testuser");

    await expect(onRegisterFormSubmit(formData)).rejects.toThrow("email can't be empty");
  });

  it("should throw an error if password is missing", async () => {
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("username", "testuser");

    await expect(onRegisterFormSubmit(formData)).rejects.toThrow("Password can't be empty");
  });

  it("should throw an error if username is missing", async () => {
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");

    await expect(onRegisterFormSubmit(formData)).rejects.toThrow("username can't be empty");
  });

  it("should call doRegister and return true on successful registration", async () => {
    const mockDoRegister = jest.fn(async () => undefined); // Simulate successful registration

    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");
    formData.append("username", "testuser");

    const result = await onRegisterFormSubmit(formData, mockDoRegister);

    expect(result).toBe(true);
    expect(mockDoRegister).toHaveBeenCalledTimes(1);
    expect(mockDoRegister).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
      username: "testuser",
    });
  });

  it("should throw an error if doRegister fails", async () => {
    const mockDoRegister = jest.fn(async () => {
      throw new Error("Registration failed");
    });

    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");
    formData.append("username", "testuser");

    await expect(onRegisterFormSubmit(formData, mockDoRegister)).rejects.toThrow("Registration failed");
    expect(mockDoRegister).toHaveBeenCalledTimes(1);
    expect(mockDoRegister).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
      username: "testuser",
    });
  });
});