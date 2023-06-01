import React from "react";
import Navbar from '../../components/Navigation/Navbar/Navbar';
import Footer from "../../components/Navigation/Footer/Footer";
import './Layout.scss';

export default function Layout(props) {
  return (
    <div>
      <Navbar/>
      { props.children }
      <Footer/>
    </div>
  )
}