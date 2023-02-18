import React from "react";
import Navbar from '../../components/Navigation/Navbar/Navbar';

export default function Layout(props) {
  return (
    <div>
      <Navbar/>
      { props.children }
    </div>
  )
}