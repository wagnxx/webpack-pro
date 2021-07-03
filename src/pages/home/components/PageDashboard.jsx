import React from 'react'

export default function PageDashboard({ cardNum }) {
  return (


    <section className="section container -mt-60">
      <div className="row row-no-gutters container-box">
        {
          cardNum.map((item,index) => (
            <div
              key={item}
              className="col col-12  col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-20 p-1"
            >
              <div className="card" >
                <div className="card-body">
                  <h5 className="card-title">Card title {item}</h5>
                  <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  <a href="#" className="btn btn-primary">Go somewhere {item} </a>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </section>

  )
}
