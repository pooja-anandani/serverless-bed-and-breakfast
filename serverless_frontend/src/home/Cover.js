
import background from "../images/hero_4.jpg"

export default function Cover(props) {

    const small_title = props.stitle
    const big_title = props.btitle
    return (<>
        <section className="site-hero overlay" style={{ backgroundImage: `url(${background})` }}>
            <div className="container">
                <div className="row site-hero-inner justify-content-center align-items-center">
                    <div className="col-md-10 text-center" >
                        <span className="custom-caption text-uppercase text-white d-block  mb-3">{small_title}</span>
                        <h1 className="heading">{big_title}</h1>
                    </div>
                </div>
            </div>
        </section>
    </>)
}