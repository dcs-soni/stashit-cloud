import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "../hooks/useAuth";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("useAuth", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("should initialize as not authenticated when no token exists", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.username).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("should store token in localStorage on login", () => {
    const { result } = renderHook(() => useAuth());

    // Create a valid JWT with username payload
    const payload = { id: "123", username: "testuser" };
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = btoa(JSON.stringify(payload));
    const testToken = `${header}.${body}.signature`;

    act(() => {
      result.current.login(testToken);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith("token", testToken);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.username).toBe("testuser");
  });

  it("should clear token from localStorage on logout", () => {
    const { result } = renderHook(() => useAuth());

    // Login first
    const payload = { id: "123", username: "testuser" };
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = btoa(JSON.stringify(payload));
    const testToken = `${header}.${body}.signature`;

    act(() => {
      result.current.login(testToken);
    });

    // Then logout
    act(() => {
      result.current.logout();
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.username).toBeNull();
  });

  it("should decode username from JWT on login", () => {
    const { result } = renderHook(() => useAuth());

    // Create a valid JWT with the username
    const payload = { id: "456", username: "john_doe" };
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = btoa(JSON.stringify(payload));
    const token = `${header}.${body}.signature`;

    act(() => {
      result.current.login(token);
    });

    expect(result.current.username).toBe("john_doe");
  });
});
