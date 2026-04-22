"use client";

import Image from "next/image"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import useResizeObserver from "@/hooks/useResizeObserver"

import styles from "@/styles/space.module.scss"
import styles_home from "@/styles/home.module.scss"

import space from "@/public/assets/space/space.jpg"
import r1 from "@/public/assets/space/r1.png"
import r2 from "@/public/assets/space/r2.png"
import r3 from "@/public/assets/space/r3.png"
import r4 from "@/public/assets/space/r4.png"
import r5 from "@/public/assets/space/r5.png"
import r6 from "@/public/assets/space/r6.png"
import r7 from "@/public/assets/space/r7.png"

import l1 from "@/public/assets/space/l1.png"
import l2 from "@/public/assets/space/l2.png"
import l3 from "@/public/assets/space/l3.png"
import l4 from "@/public/assets/space/l4.png"

import c1 from "@/public/assets/space/c1.png"
import c2 from "@/public/assets/space/c2.png"
import c3 from "@/public/assets/space/c3.png"

// import test from "@/public/assests/shape.png"

// import c4 from "@/public/assets/space/c4.png"
// import c5 from "@/public/assets/space/c5.png"
// import c6 from "@/public/assets/space/c6.png"

const HomeBG = ({ setLoaded }: { setLoaded: Dispatch<SetStateAction<boolean>> }) => {
    const { size, measuredRef } = useResizeObserver()
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const offsetWidth = (size.width || space.width) / space.width
    const offsetHeight = (size.height || space.height) / space.height

    return (
        <div className={styles.home_bg_main} id="home_space">
            <div className={styles.bg_container} ref={measuredRef}>
                <Image
                    src={space}
                    placeholder="blur"
                    alt="space-background"
                    className={styles.spaceBG}
                    onLoad={() => setLoaded(true)}
                    style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                />
                {/*Floating rocks with parallax*/}
                <div className={styles.r1} style={{ transform: `translateY(${scrollY * 0.15}px)` }}>
                    <Image
                        src={r1}
                        alt="space-rock"
                        width={r1.width * offsetWidth}
                        height={r1.height * offsetHeight}
                    />
                </div>
                <div className={styles.r2} style={{ transform: `translateY(${scrollY * 0.25}px)` }}>
                    <Image
                        src={r2}
                        alt="space-rock"
                        width={r2.width * offsetWidth}
                        height={r2.height * offsetHeight}
                    />
                </div>
                <div className={styles.r3} style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
                    <Image
                        src={r3}
                        alt="space-rock"
                        width={r3.width * offsetWidth}
                        height={r3.height * offsetHeight}
                    />
                </div>
                <div className={styles.r4} style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
                    <Image
                        src={r4}
                        alt="space-rock"
                        width={r4.width * offsetWidth}
                        height={r4.height * offsetHeight}
                    />
                </div>
                <div className={styles.r5} style={{ transform: `translateY(${scrollY * 0.12}px)` }}>
                    <Image
                        src={r5}
                        alt="space-rock"
                        width={r5.width * offsetWidth}
                        height={r5.height * offsetHeight}
                    />
                </div>
                <div className={styles.r6} style={{ transform: `translateY(${scrollY * 0.35}px)` }}>
                    <Image
                        src={r6}
                        alt="space-rock"
                        width={r6.width * offsetWidth}
                        height={r6.height * offsetHeight}
                    />
                </div>
                <div className={styles.r7} style={{ transform: `translateY(${scrollY * 0.18}px)` }}>
                    <Image
                        src={r7}
                        alt="space-rock"
                        width={r7.width * offsetWidth}
                        height={r7.height * offsetHeight}
                    />
                </div>
                {/*Lights with parallax*/}
                <div className={styles.l1} style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
                    <Image
                        src={l1}
                        alt="space-light"
                        width={l1.width * offsetWidth}
                        height={l1.height * offsetHeight}
                    />
                </div>
                <div className={styles.l2} style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
                    <Image
                        src={l2}
                        alt="space-light"
                        width={l2.width * offsetWidth}
                        height={l2.height * offsetHeight}
                    />
                </div>
                <div className={styles.l3} style={{ transform: `translateY(${scrollY * 0.15}px)` }}>
                    <Image
                        src={l3}
                        alt="space-light"
                        width={l3.width * offsetWidth}
                        height={l3.height * offsetHeight}
                    />
                </div>
                <div className={styles.l4} style={{ transform: `translateY(${scrollY * 0.25}px)` }}>
                    <Image
                        src={l4}
                        alt="space-light"
                        width={l4.width * offsetWidth}
                        height={l4.height * offsetHeight}
                    />
                </div>
                {/*Comets - usually too fast for parallax but can have some offset*/}
                <div className={styles.c1}>
                    <Image
                        src={c1}
                        alt="space-comet"
                        width={c1.width * offsetWidth}
                        height={c1.height * offsetHeight}
                    />
                </div>
                <div className={styles.c2}>
                    <Image
                        src={c2}
                        alt="space-comet"
                        width={c2.width * offsetWidth}
                        height={c2.height * offsetHeight}
                    />
                </div>
                <div className={styles.c3}>
                    <Image
                        src={c3}
                        alt="space-comet"
                        width={c3.width * offsetWidth}
                        height={c3.height * offsetHeight}
                    />
                </div>
            </div>
            <div className={styles_home.go_button_container}>
                <button className={styles_home.learn_more}>
                    <span className={styles_home.circle} aria-hidden="true">
                        <span className={styles_home.icon + " " + styles_home.arrow}></span>
                    </span>
                    <a className={styles_home.button_text} href="#home_main">
                        Learn More
                    </a>
                </button>
            </div>
        </div>
    )
}


export default HomeBG
