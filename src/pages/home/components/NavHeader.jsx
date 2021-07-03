import React from 'react'

export default function NavHeader() {
  return (
    <section className="container top pt-4">
      <h1 className="text-center text-white">
        最优质的时间管理,欢迎您的到来
    </h1>
      <nav className="nav">
        <a className="nav-link active" href="#">Active</a>
        <a className="nav-link" href="#">Link</a>
        <a className="nav-link" href="#">Link</a>
        <a className="nav-link disabled" href="#" tabIndex="-1" aria-disabled="true">Disabled</a>
      </nav>
    </section>
  )
}
