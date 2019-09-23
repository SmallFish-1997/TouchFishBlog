import { PureComponent, ReactNode } from 'react';
import { Row, Col } from 'antd';
import '@assets/Example.less';

interface P {
}
interface S {
    list: any[]
}
export default class Example extends PureComponent<P, S>{
    constructor(props: P) {
        super(props);
    }
    state: S = {
        list: [
            {
                img: '01.png',
                title: 'PublishSubscribe-Example',
                link:'ExampleDetail/SubscribePublish',
                detail:'一个模拟用户订阅公众号内容分发的简单案例',
            },
            {
                img: '02.png',
                title: 'AntdForVue',
                link:'https://github.com/SmallFish-1997/antd-for-vue',
                detail:'Vue+ant-design-vue+vue-i18n 试水vue-antd + 语言国际化',
            }
        ]
    }
    static async getInitialProps() {
        return { pageTitle:'日常案例Demo-TouchFish' };
    }
    render(): ReactNode {
        return (
            <section className="example-container public-container">
                <h3>
                    Example Page
                </h3>
                <p>目前共计 {this.state.list.length} 个Demo</p>
                <Row gutter={15}>
                    {
                        this.state.list.map((item, index) => {
                            return (
                                <Col key={index} xs={{ span: 24 }} sm={{span:12}} lg={{ span: 8 }} xl={{ span: 6 }} onClick={()=>{
                                    window.open(item.link);
                                }}>
                                    <div className="example-item">
                                        <img src={`/static/example-img/${item.img}`} />
                                        <p>
                                            {item.title}
                                        </p>
                                        <p>
                                            {item.detail}
                                        </p>
                                    </div>
                                </Col>
                            )
                        })
                    }


                </Row>
            </section>
        );
    }
}