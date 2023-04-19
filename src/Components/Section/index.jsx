import React from 'react'
import styles from './Section.module.scss'
import { motion } from "framer-motion";

export default function Section({ children, background, className }) {
    return (
        <section className={`${styles.section} ${className}`} style={{ background: background }}>
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
            >
                {children}
            </motion.div>
        </section>
    )
}
