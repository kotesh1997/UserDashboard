import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserDashboard from "../pages/user-dashboard"; // Update with the correct path
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../components/add-user", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="add-user-dialog">Add User Dialog</div>),
}));

jest.mock("../components/user-table", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="user-data-table">User Data Table</div>),
}));

const renderWithQueryClient = (ui: React.ReactNode) => {
  const queryClient = new QueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe("UserDashboard Component", () => {
  test("renders UserDashboard with Add User button and UserDataTable", () => {
    renderWithQueryClient(<UserDashboard />);

    expect(screen.getByText("Add User")).toBeInTheDocument();
    expect(screen.getByTestId("user-data-table")).toBeInTheDocument();
  });

  test("opens AddUser dialog when clicking Add User button", () => {
    renderWithQueryClient(<UserDashboard />);
    
    const addButton = screen.getByText("Add User");
    fireEvent.click(addButton);

    expect(screen.getByTestId("add-user-dialog")).toBeInTheDocument();
  });

  test("closes AddUser dialog when clicking Add User button again", () => {
    renderWithQueryClient(<UserDashboard />);
    
    const addButton = screen.getByText("Add User");
    
    // Open dialog
    fireEvent.click(addButton);
    expect(screen.getByTestId("add-user-dialog")).toBeInTheDocument();

    // Close dialog
    fireEvent.click(addButton);
    expect(screen.queryByTestId("add-user-dialog")).not.toBeInTheDocument();
  });
});
