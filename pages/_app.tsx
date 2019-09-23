import { Fragment } from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import Layout from '@components/Layout';
import '@assets/common.less';


class InTerViewSystem extends App {
  static async getInitialProps(appContext: any) {
    let pageProps = {}
    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx)
    }
    return {pageProps}

  }
  constructor(props:any) {
    super(props);

  }
  componentWillMount(){
    // if(process.browser){
      // let a = document.documentElement.clientWidth > 750 ? 750 : document.documentElement.clientWidth;
      // document.documentElement.style.fontSize = (a / 25) + "px";
    // }
  }
  componentDidMount(){
   
  }
 
  render() {
    const { Component, pageProps } = this.props;
    let pageTitle:string = "TouchFish Blog - 前端技术文章分享（前端=Nextjs+Typescript + 后端=Node+MongoDB）";
    if(pageProps.pageTitle) pageTitle = pageProps.pageTitle;
    return (
      <Fragment>
        <Head>
          <meta charSet='utf-8' />
          {/* <meta name="viewport" content="initial-scale=1,maximun-scale=1,user-scalable=no" /> */}
          <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
          <meta name="keywords" hid="keywords" content="TouchFish Blog、touchfish.cn、www.touchfish.cn、个人博客、SSR、Nextjs、Typescript、Nodejs、Mongodb、技术文章"   description="个人博客（Personal Blog） - 前端技术栈（Nextjs、Typescript）+ 后端（Nodejs、Mongodb） - 技术文章分享：Nextjs、Typescript、Nodejs、Mongodb、技术文章"/>
          <title>{pageTitle}</title>
          <link rel='shortcut icon' href='/static/favicon.ico' type='image/ico' />
        </Head>
        <Container>
            <Layout {...this.props}>
              <Component {...pageProps} />
            </Layout>
        </Container>
      </Fragment>
    );
  }
}

export default InTerViewSystem;
