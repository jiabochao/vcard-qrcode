'use client';

import {PageContainer} from '@ant-design/pro-components';
import {Card} from 'antd';
import React, {useEffect, useMemo, useState} from 'react';
import {
    Button,
    Cascader,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Mentions,
    Select,
    TreeSelect,
} from 'antd';
import {Modal} from 'antd';
import {QRCode} from 'antd';
import {Flex, Segmented} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {MinusOutlined} from '@ant-design/icons';
import {
    Checkbox,
    ColorPicker,
    Radio,
    Slider,
    Switch,
    Upload,
} from 'antd';

import type {GetProp, UploadFile, UploadProps} from 'antd';
import ImgCrop from 'antd-img-crop';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];


const {RangePicker} = DatePicker;

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
    },
};

const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

export default function Home() {

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const onChange: UploadProps['onChange'] = ({fileList: newFileList}) => {
        setFileList(newFileList);
    };

    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as FileType);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [form] = Form.useForm();

    const showModal = () => {
        const values = form.getFieldsValue(['name', 'org', 'title', 'telWork', 'telCell', 'email', 'adrWork']);
        console.log(values)
        if (fileList.length === 0) {
            return;
        }
        let file = fileList[fileList.length - 1];
        const url = URL.createObjectURL(file.originFileObj as FileType);
        if (url) {
            setQRCodeIconUrl(url);
            setQRCodeValue(`BEGIN:VCARD
VERSION:3.0
N;CHARSET=UTF-8:${values.name}
ORG;CHARSET=UTF-8:${values.org}
TITLE;CHARSET=UTF-8:${values.title}
TEL;WORK:${values.telWork}
TEL;CELL:${values.telCell}
EMAIL:${values.email}
ADR;WORK;CHARSET=UTF-8:${values.adrWork}
END:VCARD`);
        }
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [qrCodeIconUrl, setQRCodeIconUrl] = useState<string>('');
    const [qrCodeValue, setQRCodeValue] = useState<string>('');


    const [size, setSize] = useState<number>(160);

    const increase = () => {
        setSize((prevSize) => {
            const newSize = prevSize + 10;
            if (newSize > 300) {
                return 300;
            }
            return newSize;
        });
    };

    const decline = () => {
        setSize((prevSize) => {
            const newSize = prevSize - 10;
            if (newSize < 48) {
                return 48;
            }
            return newSize;
        });
    };


    return (
        <div
            style={{
                boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
                minHeight: '100vh',
                background: '#F5F7FA',
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                padding: 24,
            }}
        >
            <Card style={{
                minHeight: 'calc(100vh - 50px)'
            }}>
                <PageContainer
                    ghost
                    loading={false}
                    header={{
                        title: '微信名片二维码生成',
                    }}
                >

                    <Flex justify={'center'} align={'center'}>
                        <Form form={form} {...formItemLayout} variant="filled" style={{width: 600}}>
                            <Form.Item label="姓名" name="name" rules={[{required: true, message: '请输入！'}]}>
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label="移动电话"
                                name="telCell"
                                rules={[{required: true, message: '请输入！'}]}
                            >
                                <InputNumber style={{width: '100%'}}/>
                            </Form.Item>


                            <Form.Item
                                label="工作电话"
                                name="telWork"
                                rules={[{required: true, message: '请输入！'}]}
                            >
                                <InputNumber style={{width: '100%'}}/>
                            </Form.Item>

                            <Form.Item
                                label="电子邮箱"
                                name="email"
                                rules={[{required: true, message: '请输入！'}]}
                            >
                                <Mentions/>
                            </Form.Item>

                            <Form.Item
                                label="组织"
                                name="org"
                                rules={[{required: true, message: '请输入！'}]}
                            >
                                <Mentions/>
                            </Form.Item>

                            <Form.Item label="职位" name="title" rules={[{required: true, message: '请输入！'}]}>
                                <Input/>
                            </Form.Item>


                            <Form.Item
                                label="工作地址"
                                name="adrWork"
                                rules={[{required: true, message: '请输入！'}]}
                            >
                                <Input.TextArea/>
                            </Form.Item>


                            <Form.Item label="二维码图片" valuePropName="fileList" getValueFromEvent={normFile}>
                                <ImgCrop rotationSlider>
                                    <Upload
                                        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                        listType="picture-card"
                                        fileList={fileList}
                                        onChange={onChange}
                                        onPreview={onPreview}
                                        maxCount={1}
                                    >
                                        {fileList.length < 5 && '+ Upload'}
                                    </Upload>
                                </ImgCrop>
                            </Form.Item>

                            <Form.Item wrapperCol={{offset: 6, span: 16}}>
                                <Button type="primary" onClick={showModal}>
                                    生成
                                </Button>
                            </Form.Item>
                        </Form>
                    </Flex>

                    <Modal title="预览" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={[
                        <Button.Group key='size'>
                            <Button onClick={decline} disabled={size <= 48} icon={<MinusOutlined/>}>
                            </Button>
                            <Button onClick={increase} disabled={size >= 300} icon={<PlusOutlined/>}>
                            </Button>
                        </Button.Group>]}
                    >
                        <Flex justify={'center'} gap="small">
                            <QRCode
                                errorLevel="H"
                                value={qrCodeValue}
                                icon={qrCodeIconUrl}
                                size={size}
                                iconSize={size / 4}
                            />
                        </Flex>
                    </Modal>

                </PageContainer>
            </Card>

        </div>
    );
};
