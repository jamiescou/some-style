import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import I from 'immutable';
import {
    TextArea,
    Popover,
    PopoverBody,
    PopoverTrigger
} from 'carbon';
import styles from 'styles/modules/standard-object/index.scss';
export default class FilterLogic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            add: props.flag,
            logical_relation: this.props.filter.logical_relation
        };
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            logical_relation: nextProps.filter.logical_relation
        });
    }
    handleClick() {
        this.setState({add: !this.state.add});
    }
    handleChange(val){
        let logical_relation = val;
        this.setState({
            logical_relation
        }, () => {
            if (this.props.onChangeHeader) {
                this.props.onChangeHeader('onlyFilter');
            }
            if (this.props.onPositionHeader) {
                this.props.onPositionHeader('saveFilter');
            }
            this.props.onChange(I.fromJS({logical_relation}));
        });
    }

    render() {
        let logical_relation = this.state.logical_relation;
        return (
            <div className={classnames('mcds-filter__condition', styles['filter-position__relative'])}>
                <a className={classnames('mcds-filter__inline-block mcds-text__size-13', {'mcds-text': !this.state.add})} onClick={::this.handleClick}>添加筛选逻辑</a>
                <PopoverTrigger triggerBy="click" placement="top" overlay={<PopoverDemoThemeInfo />}>
                    <span className={classnames('mcds-icon mcds-filter__inline-block mcds-icon__info-solid-14 mcds-filter__logic-icon mcds-p__l-5', styles['filter-m_t-2'])} />
                </PopoverTrigger>
                <div className={classnames('mcds-p__t-10', {'mcds-filter__close': this.state.add})} >
                    <TextArea value={logical_relation} onChange={this.handleChange.bind(this)} ref="textArea" name="textarea" placeholder="1 AND 2" />
                </div>
                <i className={classnames('mcds-icon__arrow-line-20 mcds-filter__icon mcds-text__size-14', {'mcds-icon__rotate-270': this.state.add})} onClick={::this.handleClick} style={{top: '24px'}} />
            </div>
        );
    }
}
FilterLogic.propTypes = {
    flag: PropTypes.bool,
    filter: PropTypes.object,
    onChangeHeader: PropTypes.func,
    onPositionHeader: PropTypes.func,
    onChange: PropTypes.func
};

let PopoverDemoThemeInfo = props => (
    <Popover theme="info" className={classnames(props.className)}>
        <PopoverBody>
            筛选逻辑
        </PopoverBody>
    </Popover>
);
PopoverDemoThemeInfo.propTypes = {
    className: PropTypes.string
};
