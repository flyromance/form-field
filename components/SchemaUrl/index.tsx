/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useEffect, useState } from 'react';
import { SchemaForm, connect, SchemaMarkupField as Field, IMarkupSchemaFieldProps } from '@formily/antd';
import { Select, Input } from 'antd';
// import {} from '@formily/antd-components';
import qs from 'qs';

interface Props {
    value: string;
    onChange: (v: any) => void;
    protocol?: string; // snssdk1585
    options?: { [key: string]: any };
    disabled?: boolean;
}

const schemaConfig: { [key: string]: IMarkupSchemaFieldProps[] } = {
    webview: [
        {
            name: 'url',
            type: 'string',
            title: '链接地址',
            required: true,
        },
        {
            name: 'title',
            type: 'string',
            title: '页面标题',
        },
        {
            name: 'share_title',
            type: 'string',
            title: '分享卡片标题',
        },
        {
            name: 'share_desc',
            type: 'string',
            title: '分享卡片描述',
        },
        {
            name: 'share_icon_url',
            type: 'string',
            title: '分享卡片缩略图',
        },
        {
            name: 'share_url',
            type: 'string',
            title: '分享卡片点击跳转链接',
            'x-rules': [{ format: 'http' }],
        },
        {
            name: 'is_support_slide',
            type: 'radio',
            title: '是否支持滑动退出',
            enum: [
                { label: '是', value: '1' },
                { label: '否', value: '0' },
            ],
        },
    ],
    'class/room': [
        {
            name: 'keciid',
            type: 'string',
            title: '课次id',
            required: true,
        },
    ],
    'class/detail': [
        {
            name: 'keciid',
            type: 'string',
            title: '课次id',
            required: true,
        },
        {
            name: 'keshiid',
            type: 'string',
            title: '课时id',
            required: true,
        },
        {
            name: 'bankeid',
            type: 'string',
            title: '班课id',
            required: true,
        },
    ],
    'class/playback': [
        {
            name: 'keciid',
            type: 'string',
            title: '课次id',
            required: true,
        },
        {
            name: 'keshiid',
            type: 'string',
            title: '课时id',
            required: true,
        },
        {
            name: 'bankeid',
            type: 'string',
            title: '班课id',
            required: true,
        },
        {
            name: 'enter_from',
            type: 'string',
            title: '跳转来源',
        },
    ],
};

function parseUrl(str) {
    const regexp = /^([\w]+):\/\/([\w/]+)(?:\?([^#]*?))?(?:#(.*))?$/;
    const match = regexp.exec(str);
    const ret: any = {};
    if (match) {
        ret.protocol = match[1];
        ret.schema = match[2];
        ret.search = match[3];
        ret.query = qs.parse(match[4]);
    }
    return ret;
}

function stringify({ protocol, schema, query }) {
    const search = qs.stringify(query);console.log(search);
    return `${protocol}://${schema}${search ? '?' + search : ''}`;
}

function toFormilySchema(arr: any[] = []) {
    return {
        type: "object",
        properties: arr.reduce((result, curr) => {
            return {
                ...result,
                [curr.name]: {
                    ...curr,
                }
            };
        }, {})
    };
}

function useSchema(value, options) {
    const [parsedUrl, setParsedUrl] = useState(parseUrl(value));


    return {
        schemaKey: parsedUrl.schema,
        query: parsedUrl.query,
        protocol: parsedUrl.protocol,
        schema: toFormilySchema(options[parsedUrl.schema]),
    };
}

const UrlSchema: React.FC<Props> = props => {
    const { value, onChange, protocol = 'snssdk1585', options = schemaConfig, disabled = false } = props;
    const [parsedUrl, setParsedUrl] = useState(parseUrl(value));
    const [schemaKey, setSchemaKey] = useState(parsedUrl.schema || 'webview');
    const [schema, setSchema] = useState(toFormilySchema(options[schemaKey]));
    const [query, setQuery] = useState(parsedUrl.query);


    const schemaOptions = useMemo(() => {
        return Object.keys(options);
    }, [options]);

    const handleSchemaChange = value => {
        setSchemaKey(value);
        setSchema(toFormilySchema(options[value]));
        setQuery({});
        // onChange && onChange(stringify({ protocol, query: {}, schema: value }));
    };

    const handleQueryChange = values => {
        onChange && onChange(stringify({ protocol, query: values, schema: schemaKey }));
    };

    if (disabled) {
        return <div>value</div>;
    }

    return (
        <div>
            <Input value={value} onChange={() => {}} />
            <div>
                <span>选择schema</span>
                <Select value={schemaKey} onChange={handleSchemaChange}>
                    {schemaOptions.map(item => (
                        <Select.Option key={item} value={item}>
                            {item}
                        </Select.Option>
                    ))}
                </Select>
            </div>
            <SchemaForm onChange={handleQueryChange} labelCol={5} value={query} wrapperCol={14} schema={schema} />
        </div>
    );
};

export const ConnectedUrlSchema = connect({})(UrlSchema);

export default UrlSchema;
