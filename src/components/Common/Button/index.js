import React from "react";
import "./style.css"

const Button=({text,navigate,outline})=>{
    return(<button className= {outline?"outline-btn":"btn"} onClick={()=>navigate("/dashboard")}>{text}</button>)
}

export default Button;