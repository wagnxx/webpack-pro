import React, { useState } from 'react'
import NavHeader from './components/NavHeader'
import PageFooter from './components/pageFooter'
import PageDashboard from './components/PageDashboard'

export default function App() {
  const [cardNum, setCardNum] = useState([1,2,,])
  return (
    <>
      <header>
        <NavHeader />
      </header>
      <main>
        <PageDashboard cardNum={cardNum} />
      </main>
      <footer>
        <PageFooter />
      </footer>
    </>
  )
}
