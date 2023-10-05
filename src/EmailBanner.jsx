import React, {useState} from 'react'
import './EmailBanner.css'
import axios from "axios"

function EmailBanner() {
    const [email, setEmail] = useState('')

    const HandleSubscribe = async(e) => {
        e.preventDefault();

        try {
            const _email = email;
            const res = await axios.post('http://localhost:4000/Newsletter', {
                email: _email
            }).catch((error) => {
                console.log(error)
            });
        } catch (error) {
            console.log("Error message: ", error.message)
            
        }


    }
    return(
        <div className="emailbox">
            <div className="emailbox-form">
                <h1>SIGN UP FOR OUR DAILY INSIDER</h1>
            
                <input type="email" className="input" name="email" placeholder="Enter Your Email" required="required" value={email} onChange={(e) => setEmail(e.target.value)} />
               
                <div className="emailbutton" onClick={HandleSubscribe}>
                    SUBSCRIBE
                </div>
            </div>
        </div>
    )
}

export default EmailBanner