import Inferno from "inferno";
import AccordionComponent, { PanelComponent } from "../../../source/iml/accordion.js";

describe("accordion", () => {
  let el, accordion;
  beforeEach(() => {
    el = document.createElement("div");
    Inferno.render(
      <AccordionComponent id="accordion-test">
        <PanelComponent
          collapsed={false}
          panelId={"collapseOne"}
          headingId={"headingOne"}
          accordionId={"accordion-test"}
        >
          <div>Accordion Panel 1</div>
          <div>
            1. Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf
            moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch
            3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et.
            Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan
            excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt
            you probably haven't heard of them accusamus labore sustainable VHS.
          </div>
        </PanelComponent>
        <PanelComponent
          collapsed={true}
          panelId={"collapseTwo"}
          headingId={"headingTwo"}
          accordionId={"accordion-test"}
        >
          <div>Accordion Panel 2</div>
          <div>
            2. Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf
            moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch
            3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et.
            Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan
            excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt
            you probably haven't heard of them accusamus labore sustainable VHS.
          </div>
        </PanelComponent>

        <PanelComponent
          collapsed={true}
          panelId={"collapseThree"}
          headingId={"headingThree"}
          accordionId={"accordion-test"}
        >
          <div>Accordion Panel 3</div>
          <div>
            3. Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf
            moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch
            3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et.
            Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan
            excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt
            you probably haven't heard of them accusamus labore sustainable VHS.
          </div>
        </PanelComponent>
      </AccordionComponent>,
      el
    );

    accordion = el.querySelector("#accordion-test");
  });

  it("should match the snapshot", () => {
    expect(accordion).toMatchSnapshot();
  });
});
