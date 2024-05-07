import React from "react";
import { useNavigate } from "react-router-dom";

function Entercorrection() {
    const navigate=useNavigate();

    const navaigateToMyprofile = () => {
        navigate("/Myprofile");
    }

}
export default Entercorrection;