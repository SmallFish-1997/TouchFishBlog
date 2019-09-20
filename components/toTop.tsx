// 置顶组件 - SFC无状态组件示例
import { SFC } from 'react';
import { Icon } from 'antd';
interface IProps {
}
const TOTOP: SFC<IProps> = () => {
    const BodyContainers:HTMLCollectionOf<Element> = document.getElementsByClassName('body-container');
    if (BodyContainers.length) {
        let timer_out: any = null;
        BodyContainers[0].addEventListener('scroll', function (event: any): void {
            if (timer_out) clearTimeout(timer_out);
            timer_out = setTimeout(() => {
                const ToTopDom = document.getElementsByClassName('to-top')[0];
                if (event.target.scrollTop >= 400 && !ToTopDom.classList.contains('show-to-top')) {
                    ToTopDom.classList.add('show-to-top');
                }
                if(event.target.scrollTop < 400 && ToTopDom.classList.contains('show-to-top')){
                    ToTopDom.classList.remove('show-to-top');
                }
            },100)

        })
    }

    return (<div className="to-top">
        <Icon type="up-circle" onClick={() => {
            if (BodyContainers.length) {
                BodyContainers[0].scrollTop = 0;
            }
        }} />
    </div>)
}
export default TOTOP;
