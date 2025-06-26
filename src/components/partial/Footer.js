import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Footer extends Component{
    render(){
        return(
            <footer class="footer-content">
        <div class="layer footer">
            <div class="container-fluid">
                <div class="row footer-top-inner-w3ls">
                    <div class="col-lg-4 col-md-6 footer-top ">
                        <h2>
								<Link to='/' class="btn">HSM System</Link>
                        </h2>
                        <p class="my-3">Our salon offers a relaxing and modern environment where skilled professionals provide exceptional hair, beard, and beauty services. We focus on quality, hygiene, and personalized care to ensure every client looks and feels their best. Whether it's a quick trim or a complete makeover, we deliver style with perfection.
                        </p>
                    </div>
                    <div class="col-lg-4 col-md-6 mt-md-0 mt-5">
                        <div class="footer-w3pvt">
                            <h3 class="mb-3 w3pvt_title">Opening Hours</h3>
                            <hr/>
                            <ul class="list-info-w3pvt last-w3ls-contact mt-lg-4">
                                <li>
                                    <p>🕒 Monday – Saturday: 09:00 AM to 10:00 PM</p>
                                </li>
                                <li class="my-2">
                                    <p>🕒 Sunday: 09:00 AM to 02:00 PM</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 mt-lg-0 mt-5">
                        <div class="footer-w3pvt">
                            <h3 class="mb-3 w3pvt_title">Contact Us</h3>
                            <hr/>
                            <div class="last-w3ls-contact">
                                <p>📧 Email:
                                    <a href="mailto:example@email.com"><br></br> info@hsmsystem.com</a>
                                </p>
                            </div>
                            <div class="last-w3ls-contact my-2">
                                <p>📞 Mobile:<br></br> +91 98765 43210</p>
                            </div>
                            <div class="last-w3ls-contact">
                                <p>📍 Address:<br></br>HSM System,<br></br>104, Pramukh Arcade, Nr. Ujala Circle, Sarkhej, Ahmedabad – 382210.</p>
                            </div>
                        </div>
                    </div>

                </div>

                <p class="copy-right-grids text-li text-center my-sm-4 my-4">© 2025 HSM System. | All Rights Reserved | Developed by Dhruv Patel
                </p>
                <div class="w3ls-footer text-center mt-4">
                    <ul class="list-unstyled w3ls-icons">
                        <li>
                            <a href="https://facebook.com" target="_blank">
							<span class="fa fa-facebook-f"></span>
						</a>
                        </li>
                        <li>
                            <a href="https://twitter.com" target="_blank">
							<span class="fa fa-twitter"></span>
						</a>
                        </li>
                        <li>
                            <a href="https://instagram.com" target="_blank">
							<span class="fa fa-instagram"></span>
						</a>
                        </li>
                        <li>
                            <a href="https://pinterest.com" target="_blank">
							<span class="fa fa-pinterest-p"></span>
						</a>
                        </li>
                    </ul>
                </div>
                <div class="move-top text-right"><a href="#home" class="move-top"> <span class="fa fa-angle-up  mb-3" aria-hidden="true"></span></a></div>
            </div>
            {/* <!-- //footer bottom --> */}
        </div>
    </footer>
        )
    }
}
export default Footer