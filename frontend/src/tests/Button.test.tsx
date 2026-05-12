import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import Button from "../components/common/Button";

describe("Button component", () => {
  test("renders correctly with default settings", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("btn-primary");
  });

  test("uses the correct variant class", () => {
    render(<Button variant="accent">Accent</Button>);
    const button = screen.getByRole("button", { name: /accent/i });
    expect(button).toHaveClass("btn-accent");
  });

  test("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    const button = screen.getByRole("button", { name: /clickable/i });
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
