import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';

export default class FilterCondition extends React.Component{
    constructor(props) {
        super(props);
        let ary = [];

        this.state = {
            filter: this.props.filter,
            condition: false,
            edit: ary
        };
    }

    closeCondition(){
        this.setState({condition: !this.state.condition});
    }

    // 先放着

    // handleClick(index) {
    //     let datas = this.state.filter;
    //     let aryResult = this.state.edit;
    //     datas.splice(index, 1);
    //     aryResult.splice(index, 1);
    //     aryResult[0] = 0;
    //     this.setState({
    //         filter: datas,
    //         edit: aryResult
    //     });
    // }

    // clearData() {
    //     let filter = this.state.filter;
    //     filter.length = 0;
    //     this.setState({filter: filter});
    // }

    // handleEdit(index, e) {
    //     let result = this.state.edit;
    //     result[index] = 1;
    //     if (e.target.tagName === 'P') {
    //         this.setState({edit: result});
    //     }
    // }

    render(){
        return (
            <div className="mcds-filter__condition">
                <div className="mcds-layout__column">
                    <p className="mcds-text__size-13">筛选条件</p>
                    <i className={classnames('mcds-icon__arrow-line-20 mcds-filter__icon mcds-text__size-14', this.state.condition ? 'mcds-icon__rotate-180' : null)} onClick={::this.closeCondition} />
                </div>
                <div className={classnames('animated', {'mcds-filter__close fadeOut': this.state.condition, fadeIn: !this.state.condition})}>
                    <div className="mcds-m__t-19">
                        <p className="mcds-text__weak mcds-text__size-12 mcds-m__t-10 mcds-m__b-10">匹配这些筛选条件</p>
                        <div className="mcds-layout__column">
                            <ul className="mcds-list">
                                <li className="mcds-list__item mcds-m__b-10 pointer">
                                    <div className="mcds-filter__field">
                                        <i className="mcds-icon__close-line-20 mcds-filter__icon-close mcds-text__size-13" />
                                        <div className="mcds-p__l-12 mcds-p__t-9 mcds-p__t-13">
                                            <p className="mcds-text__weak mcds-text__size-12">称谓</p>
                                            <p className="mcds-text__size-13">who am i</p>
                                        </div>
                                    </div>
                                </li>
                                <li className="mcds-list__item mcds-m__b-10 pointer">
                                    <div className="mcds-filter__field">
                                        <i className="mcds-icon__close-line-20 mcds-filter__icon-close mcds-text__size-13" />
                                        <div className="mcds-p__l-12 mcds-p__t-9 mcds-p__t-13">
                                            <p className="mcds-text__weak mcds-text__size-12">称谓</p>
                                            <p className="mcds-text__size-13">who am i</p>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mcds-m__t-19">
                        <div className="mcds-layout__column">
                            <div className="mcds-layout__item-6 mcds-layout__column mcds-layout__left">
                                <Link className="mcds-text__size-13" href="javascript:;">增加筛选条件</Link>
                            </div>
                            <div className="mcds-layout__item-6 mcds-layout__column mcds-layout__right">
                                <Link className="mcds-text__size-13" href="javascript:;">全部清除</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

FilterCondition.propTypes = {
    filter: PropTypes.array,
    listViewScope: PropTypes.object
};


