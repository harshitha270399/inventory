/* global cd */
import React from 'react';
import PropTypes from 'prop-types';
import Input from 'collab/input';
import {
    ECE_APP_INSTANCE
} from '../../../constants';
import * as styles from '../../style.css';

const { bundle } = cd.locale;

const ECEAppInstanceView = ({ updatedValues, model }) => (
    <div className={styles.groupBox}>
        <div className={styles.groupBoxLegend}>{bundle.applicationInstance}</div>
        <div className={'flex mar-top-125r flex0'}>
            <div className={'flex0-170basis'}>
                <label className="control-label" htmlFor={'appInstanceInput'}>
                    {bundle.applicationInstance}
                    <span className="required">*</span>
                </label>
            </div>
            <div>
                {
                    updatedValues && updatedValues.eceAppInstance
                        ? (
                            <Input
                                id={'appInstanceInput'}
                                type={'text'}
                                maxLength={24}
                                {...model(ECE_APP_INSTANCE)}
                            />
                        )
                        : null
                }
            </div>
        </div>
    </div>
);

ECEAppInstanceView.propTypes = {
    updatedValues: PropTypes.object,
    model: PropTypes.func
};

export default ECEAppInstanceView;
