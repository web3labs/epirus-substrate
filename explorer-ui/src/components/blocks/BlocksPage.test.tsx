import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { Provider } from "urql";
import { createMockClient } from "../../_mocks/mockClient";
import BlocksPage from "./BlocksPage";
import { mockPageOf } from "../../_mocks/utils";
import { Edge /* , Page */ } from "../../types/pagination";
import { LightBlock, Block } from "../../types/blocks";

export function buildArrayOf(n: number, f: (index: number) => Object) {
  return [...Array(n)].map((_, i) => f(i));
}

export function mockBlock(i: number) {
  return {
    id: i,
    timeStamp: new Date(),
    // this changes as time goes by - e.g., 22 hrs 23 mins ago
    blockTime: new Date(),
    // TODO: abhi - this should be an ... enum type with variants like Finalized, NotFinalized, etc.
    status: "Finalized",
    // TODO: abhi - should be a hash type?
    hash: "0x123",
    // TODO: abhi - should be a hash type?
    parentHash: "0x123",
    // TODO: abhi - should be a hash type?
    stateRoot: "0x123",
    // TODO: abhi - should be a hash type?
    extrinsicsRoot: "0x123",
    // TODO: abhi - should be an account type?
    collator: "n123p3455",
    specVersion: 53,
  } as unknown as Block;
}

export const mockBlockEdges = buildArrayOf(5, (i) => ({
  node: mockBlock(i),
})) as Edge<LightBlock>[];
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
