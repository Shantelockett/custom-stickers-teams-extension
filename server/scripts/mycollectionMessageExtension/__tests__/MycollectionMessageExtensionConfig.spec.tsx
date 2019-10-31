import * as React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";

import { StickerMessageExtensionConfig } from "../MycollectionMessageExtensionConfig";

describe("MycollectionMessageExtensionConfig Component", () => {
    // Snapshot Test Sample
    it("should match the snapshot", () => {
        const wrapper = shallow(<StickerMessageExtensionConfig />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    // Component Test Sample
    it("should render the tab", () => {
        const component = shallow(<StickerMessageExtensionConfig />);
        const divResult = component.containsMatchingElement(<div>mycollection configuration</div>);

        expect(divResult).toBeTruthy();
    });
});


