import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { useNavigate } from 'react-router-dom';
import './IntroPage.css';

// Đăng ký GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

const IntroPage = () => {
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const ctaRef = useRef(null);
    const missionRef = useRef(null);
    const valuesRef = useRef(null);
    const featuresRef = useRef(null);
    const sloganRef = useRef(null);

    useEffect(() => {
        // Hero section animation
        const heroTl = gsap.timeline();

        heroTl
            .fromTo(heroRef.current,
                { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    duration: 2,
                    ease: "power2.inOut"
                }
            )
            .fromTo(titleRef.current,
                {
                    y: 100,
                    opacity: 0,
                    scale: 0.8
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1.2,
                    ease: "back.out(1.7)"
                },
                "-=1"
            )
            .fromTo(subtitleRef.current,
                {
                    y: 50,
                    opacity: 0,
                    scale: 0.9
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: "power2.out"
                },
                "-=0.8"
            )
            .fromTo(ctaRef.current,
                {
                    y: 30,
                    opacity: 0,
                    scale: 0.8
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.3)"
                },
                "-=0.6"
            );

        // Floating animation for hero elements
        gsap.to([titleRef.current, subtitleRef.current], {
            y: -10,
            duration: 2,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1
        });

        // CTA button hover effect
        const ctaButton = ctaRef.current;
        ctaButton.addEventListener('mouseenter', () => {
            gsap.to(ctaButton, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        ctaButton.addEventListener('mouseleave', () => {
            gsap.to(ctaButton, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        // Scroll animations
        gsap.fromTo(missionRef.current,
            {
                x: -100,
                opacity: 0,
                rotationY: -15
            },
            {
                x: 0,
                opacity: 1,
                rotationY: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: missionRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        gsap.fromTo(valuesRef.current,
            {
                x: 100,
                opacity: 0,
                rotationY: 15
            },
            {
                x: 0,
                opacity: 1,
                rotationY: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: valuesRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        // Features animation with stagger
        const featureItems = featuresRef.current.querySelectorAll('.feature-item');
        gsap.fromTo(featureItems,
            {
                y: 50,
                opacity: 0,
                scale: 0.8
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "back.out(1.7)",
                stagger: 0.2,
                scrollTrigger: {
                    trigger: featuresRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        // Slogan animation
        gsap.fromTo(sloganRef.current,
            {
                y: 30,
                opacity: 0,
                scale: 0.9
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "elastic.out(1, 0.3)",
                scrollTrigger: {
                    trigger: sloganRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        // Parallax effect for background
        gsap.to(heroRef.current, {
            yPercent: -50,
            ease: "none",
            scrollTrigger: {
                trigger: heroRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        return () => {
            // Cleanup
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    const handleGetStarted = () => {
        // Add click animation
        gsap.to(ctaRef.current, {
            scale: 0.95,
            duration: 0.1,
            ease: "power2.in",
            onComplete: () => {
                gsap.to(ctaRef.current, {
                    scale: 1,
                    duration: 0.1,
                    ease: "power2.out",
                    onComplete: () => {
                        navigate('/signin');
                    }
                });
            }
        });
    };

    return (
        <div className="intro-page">
            {/* Hero Section */}
            <section ref={heroRef} className="hero-section">
                <div className="hero-content">
                    <h1 ref={titleRef} className="hero-title">
                        🌟 LaunchPad
                    </h1>
                    <p ref={subtitleRef} className="hero-subtitle">
                        Từ ý tưởng đến hành động – Cùng nhau tiến xa
                    </p>
                    <button
                        ref={ctaRef}
                        className="cta-button"
                        onClick={handleGetStarted}
                    >
                        Bắt đầu ngay
                    </button>
                </div>
                <div className="hero-background">
                    <div className="floating-shapes">
                        <div className="shape shape-1"></div>
                        <div className="shape shape-2"></div>
                        <div className="shape shape-3"></div>
                        <div className="shape shape-4"></div>
                    </div>
                </div>
            </section>

            {/* Introduction Section */}
            <section className="intro-section">
                <div className="container">
                    <div ref={missionRef} className="mission-content">
                        <h2 className="section-title">Giới thiệu về chúng tôi</h2>
                        <p className="section-text">
                            LaunchPad là nền tảng tiên phong dành cho những cá nhân đang tìm kiếm cộng sự để cùng biến ý tưởng thành hiện thực. Dù bạn là sinh viên, freelancer hay chuyên gia, tại đây bạn có thể:
                        </p>
                        <ul className="feature-list">
                            <li>Đăng tải các dự án tâm huyết của mình</li>
                            <li>Tìm kiếm thành viên phù hợp theo kỹ năng, lĩnh vực</li>
                            <li>Làm việc nhóm hiệu quả với các công cụ tích hợp như chat, kanban, lịch trình</li>
                        </ul>
                        <p className="section-text">
                            Chúng tôi xây dựng LaunchPad với mục tiêu trở thành bệ phóng cho các dự án khởi đầu từ đam mê, tiến xa nhờ cộng tác.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="mission-section">
                <div className="container">
                    <div ref={missionRef} className="mission-content">
                        <h2 className="section-title">🎯 Sứ mệnh của chúng tôi</h2>
                        <h3 className="mission-heading">Kết nối những bộ óc khát khao tạo ra giá trị.</h3>
                        <p className="section-text">
                            Chúng tôi tin rằng mọi ý tưởng tuyệt vời đều cần một đội ngũ xuất sắc để hiện thực hóa. LaunchPad không chỉ giúp bạn tìm được người đồng hành, mà còn cung cấp môi trường làm việc trực tuyến hiệu quả, từ giai đoạn lên ý tưởng đến hoàn thiện dự án.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="values-section">
                <div className="container">
                    <div ref={valuesRef} className="values-content">
                        <h2 className="section-title">💡 Giá trị cốt lõi</h2>
                        <div className="values-grid">
                            <div className="value-item">
                                <h3>Kết nối thực chất</h3>
                                <p>Không chỉ là hồ sơ – chúng tôi hướng đến sự phù hợp về năng lực và mục tiêu.</p>
                            </div>
                            <div className="value-item">
                                <h3>Hợp tác hiệu quả</h3>
                                <p>Cung cấp công cụ giúp nhóm vận hành mượt mà như một tổ chức chuyên nghiệp.</p>
                            </div>
                            <div className="value-item">
                                <h3>Trao quyền cho cá nhân</h3>
                                <p>Mọi người đều có thể bắt đầu một điều gì đó lớn lao.</p>
                            </div>
                            <div className="value-item">
                                <h3>Minh bạch & tôn trọng</h3>
                                <p>Văn hóa làm việc tích cực, rõ ràng và tôn trọng mọi ý kiến.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Slogan Section */}
            <section className="slogan-section">
                <div className="container">
                    <div ref={sloganRef} className="slogan-content">
                        <h2 className="slogan-title">✨ Slogan gợi ý</h2>
                        <div className="slogan-grid">
                            <div className="slogan-item">"Từ ý tưởng đến hành động – Cùng nhau tiến xa."</div>
                            <div className="slogan-item">"Kết nối đúng người – Khởi tạo đúng giá trị."</div>
                            <div className="slogan-item">"Launch your dream. Build with the right team."</div>
                            <div className="slogan-item">"Không còn đơn độc trên hành trình khởi nghiệp."</div>
                            <div className="slogan-item">"Mỗi dự án đều xứng đáng có một đội ngũ tuyệt vời."</div>
                            <div className="slogan-item">"Cộng tác dễ dàng, phát triển không giới hạn."</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div ref={featuresRef} className="features-content">
                        <h2 className="section-title">📌 Tính năng nổi bật</h2>
                        <div className="features-grid">
                            <div className="feature-item">
                                <h3>Bảng tuyển thành viên thông minh</h3>
                                <p>Gợi ý ứng viên phù hợp theo lĩnh vực, kỹ năng, và mục tiêu cá nhân.</p>
                            </div>
                            <div className="feature-item">
                                <h3>Chat & thông báo thời gian thực</h3>
                                <p>Trao đổi linh hoạt, gắn kết dễ dàng.</p>
                            </div>
                            <div className="feature-item">
                                <h3>Kanban Board và Quản lý tiến độ</h3>
                                <p>Theo dõi công việc, phân công rõ ràng.</p>
                            </div>
                            <div className="feature-item">
                                <h3>Hồ sơ cá nhân & Portfolio</h3>
                                <p>Thể hiện năng lực và kinh nghiệm nổi bật.</p>
                            </div>
                            <div className="feature-item">
                                <h3>Không gian nhóm riêng tư</h3>
                                <p>Tập trung, bảo mật và hiệu quả.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="final-cta-section">
                <div className="container">
                    <div className="final-cta-content">
                        <h2>Sẵn sàng bắt đầu hành trình?</h2>
                        <p>Tham gia LaunchPad ngay hôm nay và tìm kiếm cộng sự cho dự án của bạn</p>
                        <button
                            className="cta-button final-cta"
                            onClick={handleGetStarted}
                        >
                            Bắt đầu ngay
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default IntroPage; 