import React from 'react';
import { Link } from 'react-router';

import BaseEditor from '../../share/base-field-editor';

import style from 'styles/modules/vetting/detail.scss';

export default class VetAttachment extends React.Component {
    static propTypes ={};
    constructor(props){
        super(props);
        this.state = {
        };
    }
    renderAttachment(){
        // 暂时先这么放着
        let arr = [
            {
                fileIcon: '/public/img/logo.svg',
                fileName: 'List.zip',
                uploadTime: '11.29',
                fileSize: '15.6MB'
            }, {
                fileIcon: '/public/img/logo.svg',
                fileName: 'List2.zip',
                uploadTime: '11.09',
                fileSize: '156MB'
            }
        ];
        return (
            <ul className="mcds-list mcds-tile mcds-list__divider-bottom">
                {arr.map((v, i) => (
                    <li className="mcds-p__b-10 mcds-p__t-10" key={i}>
                        <div className="mcds-tile mcds-media">
                            <div className="mcds-media__figure">
                                <span className="mcds-avatar mcds-avatar__medium">
                                    <img src={v.fileIcon} />
                                </span>
                            </div>
                            <div className="mcds-media__body mcds-tile__detail">
                                <h3 className="mcds-truncate mcds-tile__head" title="title">
                                    <Link to="javascript:void(0);">
                                        {v.fileName}
                                    </Link>
                                </h3>
                                <div className="mcds-tile__detail">
                                    <ul className="mcds-tile__detail-list">
                                        <li className="mcds-tile__item mcds-tile__detail-weak mcds-truncate">
                                            {v.uploadTime}
                                        </li>
                                        <li
                                            className="mcds-tile__item mcds-tile__detail-weak mcds-truncate mcds-m__l-5 mcds-m__r-5">
                                            •
                                        </li>
                                        <li className="mcds-tile__item mcds-tile__detail-weak mcds-truncate">
                                            {v.fileSize}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    render() {
        let schema = {
            name: 'file',
            display_name: 'file',
            type: 'file',
            nullable: true,
            readable: true,
            writable: true
        };
        let value= {
            name: '123123'
        };
        return (
            <article className={`mcds-card ${style.card}`}>
                <div className="mcds-card__header mcds-grid">
                    <header className="mcds-media mcds-card__media">
                        <div className="mcds-media__figure mcds-icon__container mcds-bg__yellow">
                            <span
                                className="mcds-text__size-24 mcds-icon__paperclip-solid-24 mcds-text__base mcds-text__white" />
                        </div>
                        <div className="mcds-media__body">
                            附件
                        </div>
                    </header>
                    {<BaseEditor
                        value={value}
                        schema={schema} />}
                </div>
                <div className="mcds-m__b-10 mcds-card__body">
                    {this.renderAttachment()}
                </div>
            </article>
        );
    }
}


