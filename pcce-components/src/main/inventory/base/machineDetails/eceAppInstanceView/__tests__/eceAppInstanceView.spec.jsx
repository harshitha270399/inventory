import React from 'react';
import { shallow } from 'enzyme';
import EnzymeToJson from 'enzyme-to-json';
import ECEAppInstanceView from '../eceAppInstanceView'; 

const defaultProps = {
    updatedValues: { eceAppInstance: true },
    model: jest.fn()
};

describe('ECEAppInstanceView test suite', () => {
    it('should render correctly with eceAppInstance', () => {
        const component = shallow(<ECEAppInstanceView {...defaultProps} />);
        expect(EnzymeToJson(component)).toMatchSnapshot();
    });

    it('should not render when eceAppInstance is not provided', () => {
        const propsWithoutECE = {
            ...defaultProps,
            updatedValues: { eceAppInstance: false }
        };

        const component = shallow(<ECEAppInstanceView {...propsWithoutECE} />);
        expect(EnzymeToJson(component)).toMatchSnapshot();
    });
});
