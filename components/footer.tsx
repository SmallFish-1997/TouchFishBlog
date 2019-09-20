import { PureComponent, ReactNode } from 'react';
import '@assets/footer.less';


export default class Footer extends PureComponent {
  render(): ReactNode {
    return (<section className="footer-container">
      <ul>
        <li>Welcome To Visit TouchFish Blog</li>
        <li>
          About My Other Community Links：
          <a href="https://juejin.im/user/5b122516f265da6e0b6ff258/posts" target="_blank">
            <img src="/static/juejin.svg" alt=""/>
          </a>
          <a href="https://github.com/SmallFish-1997" target="_blank">
            <img className="link-icons" src="/static/github.svg"/>
          </a>
        </li>
      </ul>
    </section >)
  }
}
