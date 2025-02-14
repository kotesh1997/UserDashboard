import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

jest.mock("../pages/user-dashboard", () => () => <div data-testid="user-dashboard">User Dashboard</div>);

describe("App Component", () => {
  test("renders without crashing", () => {
    render(<App />);
  });

  test("renders the UserDashboard component", () => {
    render(<App />);
    expect(screen.getByTestId("user-dashboard")).toBeInTheDocument();
  });
});
