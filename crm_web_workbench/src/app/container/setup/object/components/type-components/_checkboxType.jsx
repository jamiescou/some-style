import _ from 'lodash';
import classnames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Radio
} from 'carbon';

import CheckboxComponent from '../base-components/_checkbox';
import FieldType from '../base-components/_field';
let style = require('styles/modules/setup/object.scss');

export default class BuildCheckbox extends Component {
    constructor(){
        super();
        this.state = {
            default: false
        };
        this.getValue = this.getValue.bind(this);
    }
    getValue(){
        let getIndex = this.refs.getIndex.getValue();
        let mergeData = _.merge({}, getIndex, this.state);
        return mergeData;
    }

    // 设置是否选取
    handleChooseRadio(bool){
        this.setState({
            default: bool
        });
    }
    render(){
        let {schema, curSchema} = this.props;
        return (
            <div className="mcds-layout__column mcds-p__t-20 mcds-p__l-40 mcds-p__r-40 mcds-p__b-40">
                <FieldType className="mcds-layout__item-6" schema={schema} curSchema={curSchema} onTypeChange={this.props.onTypeChange} />
                <div className="mcds-layout__item-12 mcds-m__t-20">
                    <span className={classnames('mcds-text__size-12', style['text-color'])}>默认值</span>
                    <div className={classnames('mcds-m__t-5 clearfix', style['create-type__checkbox'])}>
                        <Radio checked={this.state.default} className="mcds-m__r-12" label="选取的" name="choosed" onChange={this.handleChooseRadio.bind(this, true)} />
                        <Radio checked={!this.state.default} label="未选取的" name="choosed" onChange={this.handleChooseRadio.bind(this, false)} />
                        <CheckboxComponent ref="getIndex" type="index" />
                    </div>
                </div>
            </div>
        );
    }
}

BuildCheckbox.propTypes = {
    schema: PropTypes.object,
    curSchema: PropTypes.object,
    onTypeChange: PropTypes.func
};
