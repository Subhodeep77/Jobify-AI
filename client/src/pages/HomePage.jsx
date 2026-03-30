import React from 'react'
import Banner from '../components/Banner'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Testimonial from '../components/Testimonial'
import CallToAction from '../components/CallToAction'
import Footer from '../components/Footer'

const HomePage = () => {
  return (
    <div>
      <Banner/>
      <Hero/>
      <Features/>
      <Testimonial/>
      <CallToAction/>
      <Footer/>
    </div>
  )
}

export default HomePage;