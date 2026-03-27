import { render, screen } from "@testing-library/react";
import { ContentGrid } from "../components/ContentGrid";
import { useContentStore } from "../store/contentStore";
import { contentGridColumnCountForViewportWidth } from "../utils/contentGridLayout";

jest.mock("../store/contentStore", () => ({
  useContentStore: jest.fn(),
}));

const mockContents = [
  {
    id: "1",
    userName: "User1",
    title: "Item 1",
    image: "img1.jpg",
    pricing: "Free" as const,
  },
  {
    id: "2",
    userName: "User2",
    title: "Item 2",
    image: "img2.jpg",
    pricing: "Paid" as const,
    price: 10,
  },
  {
    id: "3",
    userName: "User3",
    title: "Item 3",
    image: "img3.jpg",
    pricing: "Free" as const,
  },
  {
    id: "4",
    userName: "User4",
    title: "Item 4",
    image: "img4.jpg",
    pricing: "View Only" as const,
  },
  {
    id: "5",
    userName: "User5",
    title: "Item 5",
    image: "img5.jpg",
    pricing: "Free" as const,
  },
];

describe("contentGridLayout (parity with App.css breakpoints)", () => {
  it.each([
    [1300, 4],
    [1201, 4],
    [1200, 3],
    [1000, 3],
    [768, 2],
    [700, 2],
    [480, 1],
    [400, 1],
  ])("viewport width %i uses %i grid columns", (width, expected) => {
    expect(contentGridColumnCountForViewportWidth(width)).toBe(expected);
  });
});

describe("ContentGrid", () => {
  beforeEach(() => {
    (useContentStore as unknown as jest.Mock).mockReturnValue({
      allContent: mockContents,
      selectedPricing: [],
      keyword: "",
      priceRange: [0, 999] as [number, number],
      sortBy: "relevance",
      pageSize: 12,
      loadMore: jest.fn(),
      resetFilters: jest.fn(),
      setKeyword: jest.fn(),
    });
  });

  it("renders the grid and a card title for each item", () => {
    render(<ContentGrid />);
    expect(document.querySelector(".content-grid")).toBeInTheDocument();
    for (const item of mockContents) {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    }
  });
});
