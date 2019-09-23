import {SFC} from 'react';
interface IProps{
    visible:boolean,
}
const GlobalLoading:SFC<IProps> = (props)=>{
    const loadingSty = {
        width:'100%',
        height:'100%'
    }
    return (
        <section className={`global-loding ${props.visible?"show-dom":"hide-dom"}`} >
            {/* <img src="/static/loaidng.gif" style={loadingSty}/> */}
            {/* loading */}
        </section>
    );
}

export default GlobalLoading;