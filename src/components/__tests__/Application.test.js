import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
} from "@testing-library/react";

import Application from "components/Application";

describe("Application", () => {
  afterEach(cleanup);

  xit("render", () => {
    render(<Application />);
  });

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });
});
