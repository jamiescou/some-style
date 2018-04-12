import React from 'react';
import PropTypes from 'prop-types';

export default class BuildComponents extends React.Component {
    /**
     * 自生成
     * @param  {[array]} layout         [这里的layout,是layout数据返回的所有数据]
     * @param  {[array]} schema         [description]
     * @param  {[array]} data           [description]
     * @param  {[object]} componentList [description]
     * @return {[null]}                 [description]
     */

    constructor() {
        super();
    }

    /**
     * 用来生成外层包裹窗口
     * @param  {[type]} layout [description]
     * @return {[type]}        [description]
     */
    _renderWrap(layout, _level = 0) {
        let level = _level;
        //        let {compoundMode, className = '', type = '', width = '100%', children} = layout;
        let compoundMode = layout.get('compoundMode');
        let className = layout.get('className', '');
        let type = layout.get('type', '');
        let width = layout.get('width', '100%');
        let children = layout.get('children');

        if (compoundMode === 'vertical') {
            className = 'mcds-layout__row';
        } else {
            className = 'mcds-layout__column';
        }

        if (type === 'list'){
            className += ' mcds-list';
        }
        return (
            <div className={className} key={level} style={{width}}>
                {this._renderChild(children, level++)}
            </div>
        );
    }

    // 向下递归children节点
    _renderChild(children, _level = 0){
        let level = _level;
        let result = [];
        children.toArray().map(child => {
            let id = child.get('id');
            if (id) {
                return result.push(<div className="mcds-layout__item-12" style={{width: child.get('width')}} key={id}>{this._findComponents(id)}</div>);
            }
            return result.push(this._renderWrap(child, level++));
        });

        return result;
    }

    _findComponents(id) {
        // 需要装载的组件集合
        let needComponents = this.props.layout.get('components');

        // 现有的组件可用组件集合
        let componentList = this.props.componentList;

        // 需要的组件
        let needComponent = needComponents.get(id);

        if (!needComponent) {
            return null;
        }

        if (needComponent && componentList[needComponent.get('name')]) {
            let Component = componentList[needComponent.get('name')];
            let props = this.props;
            return <Component {...props} config={needComponent.get('config')} />;
        }

        return needComponent.name;
    }

    render() {
        let { layout } = this.props;
        if (layout && layout.get('layout')) {
            return this._renderWrap(layout.get('layout'));
        }

        return <div />;
    }
}

BuildComponents.propTypes = {
    meta: PropTypes.object,
    schema: PropTypes.object,
    layout: PropTypes.object,
    data: PropTypes.object,
    componentList: PropTypes.object
};
