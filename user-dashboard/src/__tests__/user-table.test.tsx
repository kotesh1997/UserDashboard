import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserDataTable from "../components/user-table"; // Update with the correct path
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios");

const queryClient = new QueryClient();
const mockedAxios = axios as jest.Mocked<typeof axios>;

const renderWithQueryClient = (ui: React.ReactNode) => {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe("UserDataTable Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("shows loading state while fetching data", () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {}));

    renderWithQueryClient(<UserDataTable />);
    expect(screen.getByText(/Data is loading.../i)).toBeInTheDocument();
  });

  test("calls delete function when delete button is clicked", async () => {
    const mockUsers = [{ id: 'mock-id', name: "John Doe", email: "john@example.com", age: 30 }];
    
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(mockUsers) })
    ) as jest.Mock;

    mockedAxios.delete.mockResolvedValue({});

    renderWithQueryClient(<UserDataTable />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledWith("http://0.0.0.0:8000/users/mock-id");
    });
  });

  test("shows message when no users are available", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    ) as jest.Mock;

    renderWithQueryClient(<UserDataTable />);
    
    await waitFor(() => {
      expect(screen.getByText(/No users available at this moment/i)).toBeInTheDocument();
    });
  });
});
