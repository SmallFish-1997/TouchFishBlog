// import ParticlesMap from './ParticlesMap'
import Header from '@components/header'
import Footer from '@components/footer'
// import ToTop from '@components/toTop'
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer, toast } from 'react-toastify';
import dynamic from 'next/dynamic';
const DynamicToTop = dynamic(import('@components/toTop'), {
  ssr: false
})
const Layout = (ctx: any) => {
  let { children,router } = ctx;
  
  
  return (
    <section className={'body-container'}>
      <Header pathname={router.pathname}/>
      <ToastContainer position={toast.POSITION.TOP_CENTER} autoClose={3000} />

      {/* <ParticlesMap /> */}
      <div className="component-container">
        {children}
      </div>

      <DynamicToTop/>
      <Footer/>
    </section>
  );
};

export default Layout;