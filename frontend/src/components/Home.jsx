import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const Home = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

    // Spring physics for smoother parallax
    const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

    const fadeIn = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="overflow-hidden bg-light" ref={targetRef}>
            {/* Hero Section */}
            <motion.div 
                className="hero-section position-relative d-flex align-items-center justify-content-center"
                style={{
                    minHeight: '110vh',
                    marginTop: '-86px',
                    backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.3), rgba(15, 23, 42, 0.5)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    opacity,
                    scale
                }}
            >
                <div className="container position-relative z-2 text-center" style={{paddingTop: '100px'}}>
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeIn} className="d-inline-block mb-4">
                            <span className="glass-panel px-4 py-2 rounded-pill text-white text-uppercase letter-spacing-2 fw-bold small border border-light border-opacity-25">
                                Welcome to Luxury
                            </span>
                        </motion.div>
                        
                        <motion.h1 variants={fadeIn} className="display-1 fw-bold mb-4 text-white font-heading" style={{textShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
                            HARUN'S
                            <span className="d-block display-2 fw-light fst-italic mt-2">Exclusive Retreat</span>
                        </motion.h1>
                        
                        <motion.p variants={fadeIn} className="lead mb-5 text-light opacity-90 mx-auto" style={{maxWidth: '700px', fontSize: '1.25rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
                            Experience the finest authentic Bengali cuisine and world-class hospitality in a serene environment. 
                            <br/><span className="small opacity-75 font-monospace">আমাদের এখানে পাবেন ভর্তা, ভাজি, মাছ, মাংস এবং সব ধরনের দেশীয় খাবার।</span>
                        </motion.p>
                        
                        <motion.div variants={fadeIn} className="d-flex gap-4 justify-content-center flex-wrap">
                            <Link to="/rooms" className="btn btn-gold btn-lg px-5 py-3 shadow-lg rounded-pill hover-scale">
                                Book Your Stay
                            </Link>
                            <a href="#dining" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill hover-scale backdrop-blur">
                                Discover Dining
                            </a>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Down Indicator */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    className="position-absolute bottom-0 start-50 translate-middle-x mb-5 z-2"
                >
                    <a href="#features" className="text-white opacity-50 hover-opacity-100">
                        <i className="bi bi-chevron-down fs-1"></i>
                    </a>
                </motion.div>
            </motion.div>

            {/* Features Section - Floating Cards */}
            <div id="features" className="container position-relative z-10" style={{marginTop: '-150px'}}>
                <div className="row g-4">
                    {[
                        { icon: "bi-house-heart-fill", title: "Luxury Accommodation", desc: "Elegant suites designed for your ultimate comfort. সুলভ মূল্যে এসি এবং নন-এসি রুম।" },
                        { icon: "bi-egg-fried", title: "Authentic Cuisine", desc: "Farm-to-table freshness in every bite. প্রতিদিন বাজার থেকে আনা তাজা মাছ ও সবজি।" },
                        { icon: "bi-clock-history", title: "24/7 Service", desc: "Round-the-clock concierge at your service. আপনার প্রয়োজনে আমরা আছি ২৪ ঘন্টা।" }
                    ].map((feature, index) => (
                        <motion.div 
                            key={index}
                            className="col-lg-4"
                            initial={{ opacity: 0, y: 100 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.8 }}
                        >
                            <div className="p-5 glass-card h-100 text-center rounded-4 shadow-lg bg-white border-bottom border-4 border-gold hover-lift">
                                <div className="mb-4 d-inline-flex p-4 rounded-circle bg-light text-navy shadow-inner">
                                    <i className={`bi ${feature.icon} display-5`}></i>
                                </div>
                                <h3 className="text-navy mb-3 h4 font-heading">{feature.title}</h3>
                                <p className="text-muted">{feature.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Hotel Gallery Section - Parallax Grid */}
            <div className="container py-5 my-5">
                 <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-5 pt-5"
                >
                    <span className="text-gold text-uppercase fw-bold letter-spacing-2 small">Visual Experience</span>
                    <h2 className="text-navy display-4 font-heading mt-2">Our Elegant Spaces</h2>
                    <div className="bg-secondary mx-auto mt-4" style={{width: '60px', height: '2px', opacity: 0.2}}></div>
                </motion.div>
                
                <div className="row g-3">
                    <div className="col-md-6">
                        <motion.div 
                            className="position-relative overflow-hidden rounded-4 h-100 shadow-lg"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.5 }}
                        >
                            <img src="/images/rooms/ocean.jpg" alt="Ocean View" className="w-100 h-100 object-fit-cover" style={{minHeight: '500px'}} />
                            <div className="position-absolute bottom-0 start-0 w-100 p-4 bg-gradient-dark text-white">
                                <h4 className="font-heading">Ocean View Suites</h4>
                            </div>
                        </motion.div>
                    </div>
                    <div className="col-md-6">
                        <div className="row g-3 h-100">
                            <div className="col-12 h-50">
                                <motion.div 
                                    className="position-relative overflow-hidden rounded-4 h-100 shadow-lg"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <img src="/images/rooms/luxury.jpg" alt="Luxury Suite" className="w-100 h-100 object-fit-cover" />
                                    <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-dark text-white">
                                        <h5 className="font-heading">Presidential Luxury</h5>
                                    </div>
                                </motion.div>
                            </div>
                            <div className="col-6 h-50">
                                <motion.div 
                                    className="position-relative overflow-hidden rounded-4 h-100 shadow-lg"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <img src="/images/rooms/suite_honey.jpg" alt="Honeymoon Suite" className="w-100 h-100 object-fit-cover" />
                                </motion.div>
                            </div>
                            <div className="col-6 h-50">
                                <motion.div 
                                    className="position-relative overflow-hidden rounded-4 h-100 shadow-lg"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <img src="/images/rooms/garden.jpg" alt="Garden View" className="w-100 h-100 object-fit-cover" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Marquee Services - Modern Trend */}
            <div className="bg-navy py-5 overflow-hidden position-relative">
                <div className="container-fluid">
                    <motion.div 
                        className="d-flex gap-5 text-white opacity-50 display-1 fw-bold text-uppercase whitespace-nowrap"
                        animate={{ x: [0, -1000] }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        <span>Relax • Dine • Enjoy • Luxury • Comfort • </span>
                        <span>Relax • Dine • Enjoy • Luxury • Comfort • </span>
                        <span>Relax • Dine • Enjoy • Luxury • Comfort • </span>
                    </motion.div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="container py-5 my-5">
                <div className="row g-4 text-center">
                    {[
                        { icon: "bi-cup-hot", title: "Breakfast Included", desc: "Start your day with a complimentary gourmet breakfast." },
                        { icon: "bi-wifi", title: "High-Speed WiFi", desc: "Stay connected with free blazing fast internet access." },
                        { icon: "bi-car-front", title: "Free Parking", desc: "Secure and convenient parking for all our guests." },
                        { icon: "bi-shield-check", title: "Smart Security", desc: "24/7 surveillance ensuring your complete safety." },
                        { icon: "bi-water", title: "Infinity Pool", desc: "Relax and unwind in our temperature-controlled pool." },
                        { icon: "bi-briefcase", title: "Business Center", desc: "Fully equipped spaces for your professional needs." },
                        { icon: "bi-controller", title: "Kids Zone", desc: "Fun and safe play areas for our younger guests." },
                        { icon: "bi-music-note-beamed", title: "Live Entertainment", desc: "Enjoy cultural performances and live music evenings." }
                    ].map((service, index) => (
                        <motion.div 
                            className="col-lg-3 col-md-6" 
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="p-4 h-100 rounded-4 hover-bg-light transition-all border border-light">
                                <i className={`bi ${service.icon} display-6 text-gold mb-3 d-inline-block`}></i>
                                <h5 className="text-navy font-heading">{service.title}</h5>
                                <p className="text-muted small mb-0">{service.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Dining Lounge Preview */}
            <div id="dining" className="container my-5 py-5">
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-5"
                >
                    <span className="text-gold text-uppercase fw-bold letter-spacing-2 small">Culinary Excellence</span>
                    <h2 className="text-navy display-4 font-heading mt-2">Dining Lounge</h2>
                    <div className="bg-secondary mx-auto mt-4" style={{width: '60px', height: '2px', opacity: 0.2}}></div>
                </motion.div>
                
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div id="diningCarousel" className="carousel slide shadow-2xl rounded-4 overflow-hidden border border-white" data-bs-ride="carousel">
                             <div className="carousel-indicators">
                                <button type="button" data-bs-target="#diningCarousel" data-bs-slide-to="0" className="active"></button>
                                <button type="button" data-bs-target="#diningCarousel" data-bs-slide-to="1"></button>
                                <button type="button" data-bs-target="#diningCarousel" data-bs-slide-to="2"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active" data-bs-interval="4000">
                                    <div className="position-relative">
                                        <img src="https://bijoybanglabd.com/uploads/images/posts/image1724318907.webp" className="d-block w-100" alt="Dining Area 1" style={{height: '600px', objectFit: 'cover'}} />
                                        <div className="position-absolute bottom-0 start-0 w-100 h-50" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'}}></div>
                                        <div className="carousel-caption d-none d-md-block pb-5">
                                            <h5 className="display-4 font-heading text-white">Traditional Ambiance</h5>
                                            <p className="lead opacity-90 text-white">পরিবার নিয়ে খাবার উপভোগ করার জন্য মনোরম পরিবেশ</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="carousel-item" data-bs-interval="4000">
                                    <div className="position-relative">
                                        <img src="https://d2u0ktu8omkpf6.cloudfront.net/9bd768c79ec1bfe0c1fb7174001e6f7979d53104faa32f0a.jpg" className="d-block w-100" alt="Dining Area 2" style={{height: '600px', objectFit: 'cover'}} />
                                        <div className="position-absolute bottom-0 start-0 w-100 h-50" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'}}></div>
                                        <div className="carousel-caption d-none d-md-block pb-5">
                                            <h5 className="display-4 font-heading text-white">Fresh & Delicious</h5>
                                            <p className="lead opacity-90 text-white">আমাদের প্রতিটি পদ তৈরি হয় অত্যন্ত যত্ন সহকারে</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="carousel-item" data-bs-interval="4000">
                                    <div className="position-relative">
                                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTmjzXPzxHsUwGQqJxoeoqLHG-WLTCXapsrA&s" className="d-block w-100" alt="Dining Area 3" style={{height: '600px', objectFit: 'cover'}} />
                                        <div className="position-absolute bottom-0 start-0 w-100 h-50" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'}}></div>
                                        <div className="carousel-caption d-none d-md-block pb-5">
                                            <h5 className="display-4 font-heading text-white">Bengali Hospitality</h5>
                                            <p className="lead opacity-90 text-white">আপনাদের সন্তুষ্টিই আমাদের প্রধান লক্ষ্য</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#diningCarousel" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon p-4 rounded-circle bg-dark bg-opacity-25 blur-sm" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#diningCarousel" data-bs-slide="next">
                                <span className="carousel-control-next-icon p-4 rounded-circle bg-dark bg-opacity-25 blur-sm" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
             {/* Call to Action */}
            <div className="py-5 bg-gold text-white text-center">
                <div className="container">
                    <h2 className="display-6 font-heading mb-4">Ready to Experience Luxury?</h2>
                    <Link to="/rooms" className="btn btn-navy btn-lg px-5 rounded-pill shadow-lg hover-scale">Book Your Room Now</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;