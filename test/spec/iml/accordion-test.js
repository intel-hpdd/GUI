// @flow

import { default as AccordionComponent, PanelComponent } from "../../../source/iml/accordion.js";
import { render } from "inferno";

describe("accordion", () => {
  let body, div, accordion;
  beforeEach(() => {
    div = document.createElement("div");
    body = document.querySelector("body");

    if (body != null) body.appendChild(div);

    accordion = (
      <AccordionComponent id="test-accordion">
        <PanelComponent collapsed={false} panelId={`collapse0`} headingId={`heading0`} accordionId={"test-accordion"}>
          <h2>Title</h2>
          <>
            <h4>Details:</h4>
            <table class="table">
              <tbody>
                <tr>
                  <td>Created At</td>
                  <td>Jan 01 2019 00:00:00</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>Online</td>
                </tr>
              </tbody>
            </table>
          </>
        </PanelComponent>
      </AccordionComponent>
    );

    render(accordion, div);
  });

  afterEach(() => {
    render(null, div);
    if (body != null) body.removeChild(div);
  });

  it("should render", () => {
    expect(div).toMatchSnapshot();
  });
});
