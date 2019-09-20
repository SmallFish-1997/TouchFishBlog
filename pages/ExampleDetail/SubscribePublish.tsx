import {PureComponent,ReactNode} from 'react';
export default class SubscribePublish extends PureComponent{
    render():ReactNode{
        return (
            <section className="about-me-container public-container">
                <iframe src="/static/example-code/SubscribePublish/publish.html" style={{border:0,width:'100%',height:'100vh',minHeight:800}}></iframe>
            </section>
        );
    }
}