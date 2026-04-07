import React from 'react'
import Banner from '../components/Banner'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Testimonial from '../components/Testimonial'
import CallToAction from '../components/CallToAction'
import Footer from '../components/Footer'

const HomePage = () => {
  return (
    <div className='bg-stone-50 dark:bg-gray-950 transition-colors duration-300'>
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