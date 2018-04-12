import React, { Component } from 'react';
import {
    ModalTrigger,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFoot,
    Button,
    Checkbox,
    Radio,
    Select,
    Table
} from 'carbon';

export default class DataMergeModal extends Component {
    static propTypes = {
    };

    render() {
        return (
            <ModalTrigger>
                <Button className="mcds-button__brand">Modal</Button>
                <Modal className="mcds-modal__w-820">
                    <ModalHeader>
                        <i className="mcds-modal__close mcds-icon__close-line-20 close" />
                        <p className="mcds-modal__title">
                            数据合并
                        </p>
                    </ModalHeader>
                    <ModalBody className="mcds-p__l-0 mcds-p__r-0">
                        <div className="mcds-layout__column mcds-p__l-20 mcds-p__r-20">
                            <div className="mcds-layout__item-6">
                                <p>两个线索对象待合并</p>
                            </div>
                            <div className="mcds-layout__item-6">
                                <div className="mcds-layout__column mcds-layout__right">
                                    <Checkbox id="checkbox1" className="mcds-checkbox__font-12" label="仅显示冲突字段" name="checkbox1" />
                                </div>
                            </div>
                        </div>
                        <Table className="mcds-table-col__bordered mcds-m__t-20 mcds-m__b-20">
                            <thead>
                                <tr className="mcds-text-title__caps">
                                    <th className="mcds-truncate">
                                        字段
                                    </th>
                                    <th className="mcds-truncate">
                                        <Checkbox id="checkbox1" className="mcds-checkbox__font-12" label="线索1" name="checkbox1" />
                                    </th>
                                    <th className="mcds-truncate">
                                        <Checkbox id="checkbox2" className="mcds-checkbox__font-12" label="线索2" name="checkbox2" />
                                    </th>
                                    <th className="mcds-truncate">
                                        <Checkbox id="checkbox3" className="mcds-checkbox__font-12" label="线索3" name="checkbox3" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>客户</td>
                                    <td><Radio id="Label" label="美洽" name="name" checked /></td>
                                    <td><Radio id="Label1" label="成都美洽" name="name" /></td>
                                    <td><Radio id="Label2" label="北京美洽" name="name" /></td>
                                </tr>
                                <tr>
                                    <td>电话</td>
                                    <td><Radio id="number" label="182-1098-1710" name="number" /></td>
                                    <td><Radio id="number1" label="182-1098-1711" name="number" /></td>
                                    <td><Radio id="number2" label="182-1098-1712" name="number" checked /></td>
                                </tr>
                                <tr>
                                    <td>冲突字段</td>
                                    <td><Radio id="conflict" label="冲突选项1" name="conflict" /></td>
                                    <td><Radio id="conflict1" label="冲突选项2" name="conflict" /></td>
                                    <td><Radio id="conflict2" label="冲突选项3" name="conflict" /></td>
                                </tr>
                                <tr>
                                    <td>非冲突字段</td>
                                    <td><Radio id="Nonconflict" label="非冲突字段" name="Nonconflict" /></td>
                                    <td><Radio id="Nonconflict1" label="非冲突字段" name="Nonconflict" /></td>
                                    <td><Radio id="Nonconflict2" label="非冲突字段" name="Nonconflict" /></td>
                                </tr>
                            </tbody>
                        </Table>
                    </ModalBody>
                    <ModalFoot>
                        <div className="mcds-layout__column">
                            <div className="mcds-layout__item-6 mcds-layout__left">
                                <Select label="主记录" value={0} required className="mcds-select__horizontal">
                                    <option value={0}>
                                        请选择
                                    </option>
                                </Select>
                            </div>
                            <div className="mcds-layout__column mcds-layout__item-6 mcds-layout__right">
                                <Button className="mcds-button__neutral mcds-btn__right close">
                                    取消
                                </Button>
                                <Button className="mcds-button__brand close">
                                    确认合并
                                </Button>
                            </div>
                        </div>
                    </ModalFoot>
                </Modal>
            </ModalTrigger>
        );
    }
}
