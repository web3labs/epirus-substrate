import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { Provider } from "urql";
import { createMockClient } from "../../_mocks/mockClient";
import BlocksPage from "./BlocksPage";
import { mockPageOf } from "../../_mocks/utils";
import { Edge } from "../../types/pagination";
import { LightBlock, Block } from "../../types/blocks";
import { mockBlockEdges } from "../../_mocks/data"

export function buildArrayOf(n: number, f: (index: number) => Object) {
  return [...Array(n)].map((_, i) => f(i));
}

export function mockBlock(i: number) {
  return {
    id: i,
    timestamp: new Date(),
    status: "Finalized",
    hash: "0x123",
    parentHash: "0x123",
    stateRoot: "0x123",
    extrinsicsRoot: "0x123",
    specVersion: 53,
  } as unknown as Block;
}

test("Blocks page", () => {
  const mockClient = createMockClient({
    blocksConnection: mockPageOf(mockBlockEdges),
  });

  const { container } = render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/blocks"]}>
        <Routes>
          <Route path="blocks" element={<BlocksPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  const listItems = container.getElementsByTagName("li");
  expect(listItems.length).toBeGreaterThanOrEqual(5);
});
