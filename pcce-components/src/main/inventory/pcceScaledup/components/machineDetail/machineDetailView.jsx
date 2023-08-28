/* global cd */
import React, { Component } from 'react';
import ComponentFooter from 'ccbu_ui/componentfooter';
import cx from 'classnames';
import StatusIndicator from 'ccbu_ui/statusIndicator';
import StatusMessage from 'ccbu_ui/statusMessage';
import styles from '../../inventory.css';
import { compileErrorMessages } from 'utilities';
import { CVP, DC_CVP, DC_EXTERNAL_MEDIA_SERVER, EXTERNAL_MEDIA_SERVER, SAVING_STATUS_LABEL } from '../../../../base/constants';
import PropTypes from 'prop-types';
import Checkbox from 'ccbu_ui/checkbox';
import ConfirmationDialog from 'ccbu_ui/confirmationDialog';
import MachineTypeDropDownAndHostNameView from '../../../base/machineDetails/machineTypeDropDownAndHostNameView/machineTypeDropDownAndHostNameView';
import UserNameAndPasswordComponent from '../../../base/machineDetails/userNameAndPasswordView/userNameAndPasswordView';
import FTPView from '../../../base/machineDetails/ftpView/ftpView';
import DeployCheckboxView from '../../../base/machineDetails/deployCheckboxView/deployCheckboxView';
import MediaServerView from '../../../base/machineDetails/mediaServerView/mediaServerView';
import ECEAppInstanceView from '../../../base/machineDetails/eceAppInstanceView/eceAppInstanceView';
import PrincipalCheckboxView from '../../../base/machineDetails/principalCheckboxView/principalCheckboxView';
import SyncView from '../../../base/machineDetails/syncView/syncView';
import {
    DC_EXTERNAL_CVVB,
    ENABLE_MEDIA_SERVER,
    EXTERNAL_CVVB,
    FTP_CREDENTIAL,
    FTP_ENABLED,
    PRINCIPAL,
    PUBLIC,
    SERVICE_PRINCIPAL_AW,
    SERVICE_PRINCIPAL_VVB
} from '../../../constants';
const { bundle } = cd.locale;

export default class MachineDetailView extends Component {
    constructor (props) {
        super(props);
        this.changeView = this.changeView.bind(this);
        this.principalCheckBox = this.principalCheckBox.bind(this);
    }

    changeView () {
        const { cancelMachineUpdate } = this.props;
        cancelMachineUpdate();
    }

    getMediaServerFTPView () {
        const { item, model } = this.props;
        if (item && (item.type === EXTERNAL_MEDIA_SERVER || item.type === DC_EXTERNAL_MEDIA_SERVER)) {
            this.checkAndAddFTPCredService();
              return (
                <div className="pad-top-125r">
                    <div className="marginBottom_10 pad-top-1r hz-sp-border-top mar-right-1r-imp" />
                    <tr>
                        <td >
                            <label className="control-label font-family-bold ft-sz-14">
                                {cd.locale.bundle.ftp}
                            </label>
                        </td>
                    </tr>

                    <fieldset className="i-block">
                        <legend>
                            <div className={cx(styles.customLegend)}>

                                <Checkbox id={FTP_ENABLED} {...model(FTP_ENABLED)} />

                                <span className={cx('relative', styles.legendText)}>
                                    {cd.locale.bundle.ftpEnabled}
                                </span>
                            </div>
                        </legend>
                        <div className={cx(styles.fieldSetSyncStatus, 'pad-top-4px')}>
                        <FTPView
                                componentId={componentId}
                                groupTitle={groupTitle}
                                isEditView={isEditView}
                                model={model}
                            />
                        </div>
                    </fieldset>
                </div>
            );
        } else {
            return (null);
        }
    }


    getCVPFTPView () {
        const { item, model } = this.props;
        if (item && (item.type === CVP || item.type === DC_CVP)) {
              this.checkAndAddFTPCredService();
            return (
                <div className="pad-top-125r">
                    <div className="marginBottom_10 pad-top-1r hz-sp-border-top mar-right-1r-imp" />
                    <tr>
                        <td >
                            <label className="control-label font-family-bold ft-sz-14">
                                {cd.locale.bundle.EXTERNAL_MEDIA_SERVER}
                            </label>
                        </td>
                    </tr>
           
            <fieldset className="i-block">
                        <legend>
                            <div className={cx(styles.customLegend)}>
                            <MediaServerView
                             componentId={componentId}
                             groupTitle={bundle.EXTERNAL_MEDIA_SERVER}
                             isEditView={isEditView}
                             model={model}
                             />
                         <span className={cx('relative', styles.legendText)}>
                                    {cd.locale.bundle.enableMediaServer}
                                </span>
                            </div>
                        </legend>
                        <div className={cx(styles.fieldSetSyncStatus, 'pad-top-4px')}>
                            <tr>
                                <td>
                                    <label className="control-label font-family-light ft-sz-12">{cd.locale.bundle.ftpEnabled}</label>
                                </td>
                                <td className="padding_left_81rem">
                                    <Checkbox id={FTP_ENABLED} {...model(FTP_ENABLED)} disabled={!model(ENABLE_MEDIA_SERVER).value} />
                                </td>
                            </tr>
                            <FTPView
                                componentId={componentId}
                                groupTitle={groupTitle}
                                isEditView={isEditView}
                                model={model}
                            />
                        </div>
                    </fieldset>
                </div>
            );
        } else {
            return (null);
        }
    }

    checkAndAddFTPCredService () {
        const { item } = this.props;
        const networksArray = item && item.networks[0].network;
        const services = networksArray.find(net => net.type === PUBLIC).services[0].service;
        const ftpCredService = services.find(service => service.type === FTP_CREDENTIAL);
        // create ftp credential service if it doesn't exist already
        if (!ftpCredService) {
            this.createAndAddService(FTP_CREDENTIAL, services);
        }
    }

    createAndAddService (serviceType, services) {
        const service = { type: serviceType };
        if (services) {
            services.push(service);
        }
    }

    /*
     * Add Service If does not exist
     */
    addPrincipalVVBIfNotExists (services) {
        const principalVVBService = services.find((service) => service.type === SERVICE_PRINCIPAL_VVB);
        if (!principalVVBService) {
            this.createAndAddService(SERVICE_PRINCIPAL_VVB, services);
        }
    }

/*
        Principal property for AW and VVB machines
        */
    principalCheckBox () {
        const { toShowPrincipal, model, item } = this.props;
        const networksArray = item && item.networks[0].network;
        let pairingValue, services;
        networksArray && networksArray.forEach((net) => {
            if (net.type === PUBLIC) {
                services = net.services[0].service;
                if (item.type === EXTERNAL_CVVB || item.type === DC_EXTERNAL_CVVB) {
                    this.addPrincipalVVBIfNotExists(services);
                }
                services.forEach((service) => {
                    if (service.type === SERVICE_PRINCIPAL_AW || service.type === SERVICE_PRINCIPAL_VVB) {
                        pairingValue = !!service.pairing && service.pairing.toString() === 'true';
                    }
                });
            }
        });
        if (toShowPrincipal) {
            return (
                <div>
                    <tr>
                        <td>
                            <label className="control-label font-family-light ft-sz-12">{cd.locale.bundle.Principal}</label>
                        </td>
                        <td className="padding_left_82">
                            <Checkbox {...model(PRINCIPAL)} disabled={pairingValue} />
                        </td>
                    </tr>
                </div>
            );
        }
    }


    getAnyErrorMessage () {
        const { status, clearErrorMessage } = this.props;
        if (status && status.errorOccurred) {
            return (
                <div>
                    <StatusMessage
                        messageType={'error'}
                        onClose={clearErrorMessage}
                        messages={compileErrorMessages(status.message)} autoClose={false} />
                </div>
            );
        }
    }

    /**
     * Creates the progress indicator DOM
     * @returns {XML}
     */
    getProgressElement () {
        const { status } = this.props;
        if (status && status.inProgress) {
            return (
                <StatusIndicator status={SAVING_STATUS_LABEL} />
            );
        }
    }

    render() {
        const {
            deployConfirmationHandler,
            hideDeployDialog,
            confirmationMessage,
            showDeploy,
            showDeployDialog,
            updatedValues,
            allowEdit,
            saveHandler,
            model,
            isPrincipalAW,
            showInstanceField,
            showPrincipalCheckbox,
            showSyncDetails,
            allowHostNameEdit,
            hostNameTitle,
            isEditView,
            machineTypes,
            item

        } = this.props;
    
        return (
            <div className="flex flex-col flex1">
                <ConfirmationDialog
                    message={confirmationMessage}
                    show={showDeployDialog}
                    onHide={hideDeployDialog}
                    onConfirmation={deployConfirmationHandler}
                    changeColorOfDoneButton
                />
                {this.getProgressElement()}
                {this.getAnyErrorMessage()}
                <div className="ffont-family-bold ft-sz-16 mar-left-125r">
                    {cd.locale.bundle.multiEdit} {updatedValues && updatedValues.MACHINE_NAME}
                </div>
                <div className={cx('flex', 'flex1', 'flex-col', 'overflow-y-auto', 'mar-left-125r')}>
                    {this.principalCheckBox()}
                    {this.getCVPFTPView()}
                    {this.getMediaServerFTPView()}
                    
                    <MachineTypeDropDownAndHostNameView
                        allowHostNameEdit={allowHostNameEdit}
                        hostNameTitle={hostNameTitle}
                        isEditView={isEditView}
                        machineTypes={machineTypes}
                        model={model}
                        showInstanceField={showInstanceField}
                    />
    
                    { showSyncDetails && <SyncView model={model}/>}

                    <UserNameAndPasswordComponent
                     updatedValues={updatedValues} model={model}/>
                    <FTPView model={model} item={item} />
                    <DeployCheckboxView model={model} showDeploy={showDeploy} />
                    <MediaServerView model={model} item={item}/>
                    <ECEAppInstanceView updatedValues={updatedValues} model={model}/>
    
                </div>
                <div className={cx(styles.footer, 'flex0', 'relative')}>
                    <ComponentFooter
                        saveButton={{
                            show: allowEdit,
                            disable: false,
                            label: bundle.save
                        }}
                        cancelButton={{
                            show: true,
                            disable: false,
                            label: allowEdit ? bundle.cancel : bundle.ok,
                            color: allowEdit ? 'gray' : 'blue'
                        }}
                        cancelButtonClickHandler={this.changeView}
                        saveButtonClickHandler={saveHandler}
                        prefix="inv-detail-"
                    />
                </div>
            </div>
        );
    }
} 
             
MachineDetailView.propTypes = {
                 
    allowEdit: PropTypes.bool,
    allowHostNameEdit: PropTypes.bool,
    confirmationMessage: PropTypes.string,
    updatedValues:PropTypes.object,
    hideDeployDialog: PropTypes.func,
    showDeployDialog: PropTypes.func,
    hostNameTitle: PropTypes.string,
    deployConfirmationHandler: PropTypes.func,
    isEditView: PropTypes.bool,
    item:PropTypes.object,
    showDeploy:PropTypes.func,
    isPrincipalAW: PropTypes.bool,
    machineTypes: PropTypes.string,
    model: PropTypes.func,
    saveHandler: PropTypes.func,
    showInstanceField: PropTypes.bool,
    showPrincipalCheckbox: PropTypes.bool,
    showSyncDetails: PropTypes.bool,
    showDeployCheckbox: PropTypes.bool,
    cancelMachineUpdate: PropTypes.func,
    status: PropTypes.object,
};