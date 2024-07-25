import ReactDOM from "react-dom";
import {ConfigProvider} from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import React from "react";

export async function bootstrap(props) {
    console.log('微应用正在启动', props);
}

export async function mount(props) {
    console.log('微应用正在挂载', props);
    let { GetApp, DomContainer } = props
    ReactDOM.render(
        <ConfigProvider locale={zhCN}>
            <GetApp/>
        </ConfigProvider>,
        document.getElementById(DomContainer))
}

export async function unmount(props) {
    console.log('微应用正在卸载', props);
    // ReactDOM.unmountComponentAtNode(document.getElementById('qk-container'));
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update() {
    console.log('微应用update');
}
