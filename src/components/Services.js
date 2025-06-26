import React,{Component} from 'react';
import {Link} from 'react-router-dom';
 class Services extends Component{
     render(){
         return(
            <div>
            <section class="inner-page-banner" id="home">
            </section>
            
            
            
            <div class="breadcrumb-agile">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item">
		              <Link to='/'>Home</Link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">Services</li>
                </ol>
            </div>
            
            
            <section class="what-we-do py-5">
                <div class="container py-md-5">
                <h3 class="heading text-center mb-3 mb-sm-5">Our Stylings</h3>
                    <div class="row what-we-do-grid">
                        <div class="col-lg-3 col-md-6 pr-0 pl-md-3 pl-0">
                            <img src="assets/images/sp1.jpg" class="img-fluid" alt="" />
                        </div>
                        <div class="col-lg-3 col-md-6 bg-grid-clr">
                            <h4 class="mt-md-0 my-2">HAIRCUTS</h4>
                            <p class="">A well-crafted haircut enhances your personality, offering a fresh, clean, and confident look tailored to your style.</p>
                        </div>
                        <div class="col-lg-3 col-md-6 pr-0 pl-md-3 pl-0 mt-lg-0 mt-4">
                            <img src="assets/images/sp2.jpg" class="img-fluid" alt="" />
                        </div>
                        <div class="col-lg-3 col-md-6 bg-grid-clr mt-lg-0 mt-md-4">
                            <h4 class="mt-md-0 my-2">SHAVES</h4>
                            <p class="">A clean, professional shave offers a refreshing feel and sharpens your appearance, giving you a polished and well-groomed look.</p>
                        </div>
                        
                        <div class="col-lg-3 col-md-6 pr-0 pl-md-3 pl-0 mt-lg-5 mt-4">
                            <img src="assets/images/sp3.jpg" class="img-fluid" alt="" />
                        </div>
                        <div class="col-lg-3 col-md-6 bg-grid-clr mt-lg-5 mt-md-4">
                            <h4 class="mt-md-0 my-2">BEARD TRIM</h4>
                            <p class="">A beard trim helps maintain a neat and defined look, enhancing your facial features while keeping your style sharp and well-groomed.</p>
                        </div>
                        <div class="col-lg-3 col-md-6 pr-0 pl-md-3 pl-0 mt-lg-5 mt-4">
                            <img src="assets/images/sp4.jpg" class="img-fluid" alt="" />
                        </div>
                        <div class="col-lg-3 col-md-6 bg-grid-clr mt-lg-5 mt-md-4">
                            <h4 class="mt-md-0 my-2">MUSTACHE TRIM</h4>
                            <p class="">A mustache trim adds precision and shape to your look, ensuring a clean, polished appearance that complements your overall grooming style.</p>
                        </div>
                    </div>
                </div>
            </section>
            
                <section class="testimonials py-5" id="testimonials">
                    <div class="container py-md-5">
                           <h3 class="heading text-center mb-3 mb-sm-5">Client Reviews</h3>
                        <div class="row mt-3">
            
                            <div class="col-md-4 test-grid text-left px-lg-3">
                                <div class="test-info">
            
                                    <p>"Absolutely loved the haircut and beard trim! The stylist was professional and understood exactly what I wanted."</p>
                                    <h3 class="mt-md-4 mt-3">Rahul Mehta</h3>
            
                                    <div class="test-img text-center mb-3">
                                        <img src="assets/images/test1.jpg" class="img-fluid" alt="user-image" />
                                    </div>
                                    <div class="mobl-footer test-soc text-center">
                                        <ul class="list-unstyled">
                                            <li>
                                                <a href="#">
                                        <span class="fa fa-facebook-f"></span>
                                    </a>
                                            </li>
                                            <li class="mx-1">
                                                <a href="#">
                                        <span class="fa fa-twitter"></span>
                                    </a>
                                            </li>
            
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 test-grid text-left px-lg-3 py-sm-5 py-md-0 py-3">
                                <div class="test-info">
            
                                    <p>"Great ambiance and hygienic setup. Booking my appointment online made everything super convenient!"</p>
                                    <h3 class="mt-md-4 mt-3">Amit Patel</h3>
                                    <div class="test-img text-center mb-3">
                                        <img src="assets/images/test2.jpg" class="img-fluid" alt="user-image" />
                                    </div>
                                    <div class="mobl-footer test-soc text-center">
                                        <ul class="list-unstyled">
                                            <li>
                                                <a href="#">
                                        <span class="fa fa-facebook-f"></span>
                                    </a>
                                            </li>
                                            <li class="mx-1">
                                                <a href="#">
                                        <span class="fa fa-twitter"></span>
                                    </a>
                                            </li>
            
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 test-grid text-left px-lg-3">
                                <div class="test-info">
            
                                    <p>"Timely service and very polite staff. Highly recommend the head massage – totally worth it!"</p>
                                    <h3 class="mt-md-4 mt-3">Rajiv Verma</h3>
            
                                    <div class="test-img text-center mb-3">
                                        <img src="assets/images/test3.jpg" class="img-fluid" alt="user-image" />
                                    </div>
                                    <div class="mobl-footer test-soc text-center">
                                        <ul class="list-unstyled">
                                            <li>
                                                <a href="#">
                                        <span class="fa fa-facebook-f"></span>
                                    </a>
                                            </li>
                                            <li class="mx-1">
                                                <a href="#">
                                        <span class="fa fa-twitter"></span>
                                    </a>
                                            </li>
            
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
            
            
                    </div>
                </section>
                </div>
         )
     }
 }
 export default Services