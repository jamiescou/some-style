import _ from 'lodash';
import {List} from 'immutable';
import {connect} from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import EditModal from '../modal/update';
import { checkEditable } from '../build-field';
import { updateObject } from 'redux/reducers/standard-object/detailview/data';


import {
    Process,
    ProcessTabContent,
    notify
} from 'carbon';

class process extends Component{
    constructor(props) {
        super(props);
        this.state = {
            // 用id去查找input,避免发生重复,可能会有用
            steps: []
        };
    }

    componentWillMount() {
        // 构建 state.step 初始化数据
        let steps = this._buildProcessState();

        this.setState({steps});
    }

    setProcessStateOver(i) {
        console.log('i', i);
        let { config, data, schema } = this.props;
        let { objName, id } = this.context.router.params;
        let relatedField = config.get('relatedField');
        let attrs = schema.get(relatedField);
        let options = [];
        let result = {};

        if (attrs.get('options')) {
            options = attrs.getIn(['options', 'list', 'all', 'options_value']).toJS();
            result[relatedField] = options[i];
            result.version = data.get('version');


            this.props.updateObject(objName, id, result)
                .then(() => {
                    notify.add('修改成功setProcessStateOver');
                    return true;
                }, response => notify.add({message: response.error.message || '操作失败', theme: 'error'}));
        }
    }

    // 构建state对应的step
    _buildProcessState() {
        let { config, data, schema } = this.props;
        let step = {};
        const buildFieldObject = (name, index) => ({
            key: `step-${index}`,
            name,
            schema: schema.get(name),
            edit: false,
            value: data.get(name) || null
        });

        let steps = config.get('steps');
        if (!steps || !List.isList(steps) || steps.size === 0) {
            return false;
        }

        steps.toArray().map((v, i) => {
            if (v.get('fields')) {
                let tmp = {};
                v.get('fields').map(key => {
                    tmp[key] = buildFieldObject(key, i);
                });
                step[`step-${i}`] = tmp;
            }
        });
        return step;
    }

    // 用来生成单条字段
    _buildProcessEditItem(itemObject, index) {
        let { data } = this.props;

        let editItem;
        let value = data.get(itemObject.name);
        if (value) {
            editItem = <span className="mcds-text mcds-text__size-13">{value}</span>;
        } else {
            this.getEditItem(index);
        }
        return (
            <div key={`${itemObject.key}-${itemObject.name}`} className="mcds-layout__column mcds-layout__middle mcds-divider__bottom mcds-process__tab-grid-item mcds-text__weak">
                <div className="mcds-layout__item ">{itemObject.schema.get('display_name') || itemObject.schema.get('name')}</div>
                <div className="mcds-layout__right ">
                    <span className="mcds-readonly__span">{editItem}</span>
                </div>
            </div>
        );
    }

    getEditItem(index) {
        let { data } = this.props;
        if (data) {
            return (
                <span
                    title="编辑"
                    onClick={() => {
                        let editButton = this.refs[`${index}_edit`];
                        editButton.click();
                    }}>
                    <i className="mcds-icon__edit-line-20 mcds-text__size-20 mcds-cursor__pointer" />
                </span>
            );
        }
        return null;
    }

    getGuidance(stepIndex) {
        let { config } = this.props;
        let guidanceIndex = stepIndex.replace('step-', '');
        return config.getIn(['steps', guidanceIndex, 'guidance']);
    }

    getEditOrder(stepIndex) {
        let { steps } = this.state;
        let result = [];

        _.map(steps[stepIndex], (v, key) => {
            result.push(key);
        });

        return result;
    }

    // 用来生成Process'stepArr所需要的对象
    buildStepArr() {
        let { config, schema } = this.props;
        let attrs = schema.get(config.get('relatedField'));
        let options = [];
        // console.log("attrs", attrs);
        if (attrs.get('options')) {
            options = attrs.getIn(['options', 'list', 'all', 'options_value']).toJS();
        }
        return options.map(v => ({text: v}));
        // let lastOne = result.pop();
        // lastOne.className = "mcds-process__closed-lost";
        // result.push(lastOne);
    }

    getCurrentStep() {
        let { config, data, schema } = this.props;
        let attrs = schema.get(config.get('relatedField'));
        let current = data.get(config.get('relatedField'));

        let options = [];
        if (attrs.get('options')) {
            options = attrs.getIn(['options', 'list', 'all', 'options_value']).toJS();
        }
        return options.indexOf(current) || 0;
    }

    // 构建整个tabContents数组
    buildProcessTabContent() {
        let { data} = this.props;
        let { steps } = this.state;

        let stepTabContent = _.map(steps, ((v, stepIndex) => {
            // 构建左侧关键字段的条目信息
            let items = _.map(v, (j) => this._buildProcessEditItem(j, stepIndex) );
            let editOrder = this.getEditOrder(stepIndex);
            let editButton = <span ref={`${stepIndex}_edit`} className="mcds-text__link mcds-cursor__pointer mcds-text__size-13">编辑</span>;

            return (
                <ProcessTabContent key={v} >
                    <section className={'mcds-process__tab-grid'}>
                        <div className="mcds-layout__column mcds-divider__top mcds-divider__bottom mcds-process__tab-grid-item mcds-text__weak">
                            <div className="mcds-layout__item">关键字段</div>
                            {checkEditable(data) ? <div className="mcds-layout__right">
                                <EditModal
                                    order={editOrder}
                                    trigger={editButton} />
                            </div> : null
                            }
                        </div>
                        {items}
                    </section>

                    <section className="mcds-process__tab-grid  mcds-text__weak">
                        <div className="mcds-divider__top mcds-divider__bottom mcds-process__tab-grid-item">
                            指导
                        </div>
                        <div className="mcds-p__l-20 mcds-p__t-20 mcds-p__b-20 mcds-text__size-13 mcds-divider__bottom mcds-process__tab-grid-richtext" dangerouslySetInnerHTML={{__html: this.getGuidance(stepIndex)}} />
                    </section>
                </ProcessTabContent>
            );
        }));

        return stepTabContent;
    }

    render() {
        let stepArr = [
            {text: 'Unqualified'},
            {text: 'New'},
            {text: 'Working'},
            {text: 'Nurturing'},
            {text: 'Closed', className: 'mcds-process__closed-lost'}
        ];
        return (
            <Process
                stepArr={stepArr}
                currentStep={1}
                activeStep={1}
                onBefore={() => {
                    return true;
                }}
                buttonText={'标记完成'}>
                <div />
            </Process>
        );
    }
}

process.contextTypes = {
    router: PropTypes.object.isRequired
};

process.propTypes = {
    config: PropTypes.object,
    data: PropTypes.object,
    schema: PropTypes.object,
    updateObject: PropTypes.func
};

// const editItem
export default connect(
    null,
    dispatch => bindActionCreators({ updateObject }, dispatch)
)(process);
