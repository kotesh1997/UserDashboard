import "@testing-library/jest-dom";
import axios from "axios";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddUser from "../components/add-user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AddUser Component", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
  });

  test("should submit form successfully", async () => {
    mockedAxios.post.mockResolvedValue({ data: {} });

    render(
      <QueryClientProvider client={queryClient}>
        <AddUser isOpen={true} onDialogSwitch={jest.fn()} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: "25" } });

    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith("http://0.0.0.0:8000/users/", {
        name: "John Doe",
        email: "john@example.com",
        age: "25",
      });
    });
  });

  test("should handle API error", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Network error"));

    render(
      <QueryClientProvider client={queryClient}>
        <AddUser isOpen={true} onDialogSwitch={jest.fn()} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: "25" } });

    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });
  });
});
