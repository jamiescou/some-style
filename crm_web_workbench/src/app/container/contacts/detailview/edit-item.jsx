// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import classnames from 'classnames';

// import BuildEditors from 'container/share/base-field-editor';

// import {
//     ReadOnlyInput
// } from 'carbon';

// import style from 'styles/modules/standard-object/index.scss';
// /**
//  * 计算权限值
//  * @param  {[type]} schema [description]
//  * @return {[type]}        [4 可读 2 可写 0 不可读不可编辑 相加]
//  */
// const calculateAuthority = (schema) => {
//     let authority = 0;
//     const Readable = 4;
//     const Writable = 2;
//     let { readable = false, writable = false} = schema;
//     if (readable) {
//         authority += Readable;
//     }

//     if (writable) {
//         authority += Writable;
//     }

//     return authority;
// };

// export default class EditItem extends Component {
//     static propTypes = {
//         // status "edit" || "common"
//         status: PropTypes.string,
//         value: PropTypes.any,
//         className: PropTypes.string,
//         schema: PropTypes.object,
//         onEditClick: PropTypes.func
//     };

//     constructor(props){
//         super(props);

//         this.getValue = this.getValue.bind(this);
//     }

//     getValue() {
//         return this.refs.editItem.getValue();
//     }

//     renderReadOnlyItem() {
//         let { schema, value} = this.props;
//         return (
//             <ReadOnlyInput label={schema.display_name || schema.name } value={String(value)} name="InputReadOnlyBottom" />
//         );
//     }

//     _renderEditAndReadItemTypes() {
//         // onEditBlur, onClick
//         let { schema, value } = this.props;
//         console.log('schema123', schema)
//         return <BuildEditors ref="editItem" schema={schema} value={value} />;
//     }

//     renderEditAndReadItem() {
//         let { status = 'common', schema, value, onEditClick } = this.props;
//         let editOrShowArea = status === 'common' ? <ReadOnlyInput label={schema.display_name || schema.name } value={value || ''} name="InputReadOnlyBottom" /> : this._renderEditAndReadItemTypes();
//         return (
//             <div>
//                 {editOrShowArea}
//                 <div onClick={onEditClick} className={classnames(`mcds-icon__container mcds-icon__container-noborder mcds-cursor__pointer ${style['edit-item__right-icon']}`, {hide: status === 'edit'})}>
//                     <span className="mcds-icon__edit-line-20" />
//                 </div>
//             </div>
//         );
//     }


//     render() {
//         let { schema, value } = this.props;
//         let authority = calculateAuthority(schema);
//         let className = this.props.className ? this.props.className : '';
//         let EditElement = '';
//         className += ' ' + style['edit-item'];

//         // 无任何权限
//         if (authority === 0) {
//             // EditElement =  React.DOM.noscript();;
//             EditElement = schema.name + ':' + value;
//         }

//         // 可读
//         if (authority === 4) {
//             EditElement = this.renderReadOnlyItem();
//         }


//         // 可读可写
//         if (authority === 6) {
//             EditElement = this.renderEditAndReadItem();
//         }


//         return (
//             <div className={className}>
//                 {EditElement}
//             </div>
//         );
//     }
// }
